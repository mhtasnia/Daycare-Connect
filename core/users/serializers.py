from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from booking.models import DaycarePricing
from booking.serializers import DaycarePricingSerializer
import json

from .models import User, Parent, DaycareCenter, EmailOTP, DaycareImage, Child, Address, EmergencyContact, AREA_CHOICES
from .email_service import EmailService

User = get_user_model()

class EmailOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=[
        ('registration', 'Registration'),
        ('login', 'Login'),
        ('password_reset', 'Password Reset'),
    ], default='registration')

    def validate_email(self, value):
        purpose = self.initial_data.get('purpose', 'registration')
        
        if purpose == 'registration':
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("A user with this email already exists.")
        
        return value

    def create(self, validated_data):
        email = validated_data['email']
        purpose = validated_data['purpose']
        
        # Invalidate any existing OTPs for this email and purpose
        EmailOTP.objects.filter(
            email=email, 
            purpose=purpose, 
            is_used=False
        ).update(is_used=True)
        
        # Create new OTP
        otp = EmailOTP.objects.create(
            email=email,
            purpose=purpose
        )
        
        # Send email
        EmailService.send_otp_email(email, otp.otp_code, purpose)
        
        return otp

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    purpose = serializers.ChoiceField(choices=[
        ('registration', 'Registration'),
        ('login', 'Login'),
        ('password_reset', 'Password Reset'),
    ], default='registration')

    def validate(self, data):
        email = data['email']
        otp_code = data['otp_code']
        purpose = data['purpose']
        
        # Debug: Print what we're looking for
        print(f"Looking for OTP: email={email}, purpose={purpose}, code={otp_code}")
        
        # Get all OTPs for this email and purpose (for debugging)
        all_otps = EmailOTP.objects.filter(email=email, purpose=purpose).order_by('-created_at')
        print(f"Found {all_otps.count()} OTPs for this email/purpose")
        
        for otp in all_otps[:3]:  # Show last 3 OTPs
            print(f"OTP: code={otp.otp_code}, used={otp.is_used}, attempts={otp.attempts}, expires={otp.expires_at}, created={otp.created_at}")
        
        try:
            otp = EmailOTP.objects.filter(
                email=email,
                purpose=purpose,
                is_used=False
            ).latest('created_at')
            print(f"Selected OTP: code={otp.otp_code}, expires={otp.expires_at}, now={timezone.now()}")
        except EmailOTP.DoesNotExist:
            print("No valid OTP found")
            raise serializers.ValidationError("No valid OTP found for this email.")
        
        # Check if OTP is still valid (not expired, not used, has attempts left)
        if timezone.now() > otp.expires_at:
            print("OTP has expired")
            raise serializers.ValidationError("OTP has expired. Please request a new code.")
        
        if otp.is_used:
            print("OTP already used")
            raise serializers.ValidationError("This OTP has already been used. Please request a new code.")
        
        if otp.attempts >= otp.max_attempts:
            print("Max attempts exceeded")
            raise serializers.ValidationError("Maximum OTP attempts exceeded. Please request a new code.")
        
        # Verify the OTP code
        if not otp.verify(otp_code):
            remaining_attempts = otp.max_attempts - otp.attempts
            print(f"OTP verification failed: provided={otp_code}, expected={otp.otp_code}, remaining={remaining_attempts}")
            if remaining_attempts > 0:
                raise serializers.ValidationError(f"Invalid OTP. {remaining_attempts} attempts remaining.")
            else:
                raise serializers.ValidationError("Maximum OTP attempts exceeded. Please request a new code.")
        
        print("OTP verification successful!")
        data['otp_instance'] = otp
        return data

class BaseRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    otp_code = serializers.CharField(write_only=True, max_length=6, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'otp_code']

    def validate(self, data):
        email = data['email']
        otp_code = data['otp_code']
        
        # Check if there's a recently verified OTP for this email
        # Look for OTPs that were used in the last 5 minutes (for registration flow)
        recent_verified_otp = EmailOTP.objects.filter(
            email=email,
            purpose='registration',
            is_used=True,
            otp_code=otp_code,
            created_at__gte=timezone.now() - timedelta(minutes=5)
        ).first()
        
        if recent_verified_otp:
            print(f"Found recently verified OTP for registration: {recent_verified_otp.otp_code}")
            data['verified_otp'] = recent_verified_otp
            return data
        
        # If no recently verified OTP, try to verify a fresh one
        try:
            otp = EmailOTP.objects.filter(
                email=email,
                purpose='registration',
                is_used=False
            ).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({"otp_code": "No valid OTP found for this email."})
        
        # Check if OTP is expired
        if timezone.now() > otp.expires_at:
            raise serializers.ValidationError({"otp_code": "OTP has expired. Please request a new code."})
        
        # Check attempts
        if otp.attempts >= otp.max_attempts:
            raise serializers.ValidationError({"otp_code": "Maximum OTP attempts exceeded. Please request a new code."})
        
        # Verify the code
        if not otp.verify(otp_code):
            remaining_attempts = otp.max_attempts - otp.attempts
            if remaining_attempts > 0:
                raise serializers.ValidationError({"otp_code": f"Invalid OTP. {remaining_attempts} attempts remaining."})
            else:
                raise serializers.ValidationError({"otp_code": "Maximum OTP attempts exceeded. Please request a new code."})
        
        # Store the verified OTP instance for later use
        data['verified_otp'] = otp
        return data

    def create(self, validated_data):
        otp_code = validated_data.pop('otp_code')
        verified_otp = validated_data.pop('verified_otp')
        
        user = User(
            email=validated_data['email'],
            user_type='parent',  # Default to parent, override in subclasses
            is_email_verified=True  # Mark as verified since OTP was validated
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create parent profile
        Parent.objects.create(user=user)
        
        # Send welcome email
        EmailService.send_welcome_email(user.email, user.user_type)
        
        return user

class ParentRegisterSerializer(BaseRegisterSerializer):
    pass  # Inherits all functionality from BaseRegisterSerializer

# Child Serializer
class ChildSerializer(serializers.ModelSerializer):
    age = serializers.ReadOnlyField()
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Child
        fields = ['id', 'full_name', 'date_of_birth', 'gender', 'special_needs', 'photo', 'photo_url', 'age', 'created_at']
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

# Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    full_address = serializers.ReadOnlyField()
    area_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Address
        fields = ['street_address', 'city', 'area', 'area_display', 'postal_code', 'country', 'full_address']
    
    def get_area_display(self, obj):
        return obj.get_area_display() if obj.area else ""

# Emergency Contact Serializer
class EmergencyContactSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EmergencyContact
        fields = [
            'id', 'full_name', 'relationship', 'phone_primary', 'phone_secondary', 
            'email', 'address', 'photo', 'photo_url', 'is_authorized_pickup', 'notes', 'created_at'
        ]
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

# Enhanced Parent Profile Serializer
class ParentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    is_email_verified = serializers.BooleanField(source='user.is_email_verified', read_only=True)
    joined_at = serializers.DateTimeField(source='user.joined_at', read_only=True)
    profile_image_url = serializers.SerializerMethodField()
    children = ChildSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    emergency_contact = EmergencyContactSerializer(read_only=True)

    class Meta:
        model = Parent
        fields = [
            'email', 'user_type', 'is_email_verified', 'joined_at',
            'full_name', 'profession', 'phone', 'profile_image', 'profile_image_url',
            'children', 'address', 'emergency_contact'
        ]
    
    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

# Update Parent Profile Serializer
class UpdateParentProfileSerializer(serializers.ModelSerializer):
    # Address fields
    street_address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    area = serializers.ChoiceField(choices=AREA_CHOICES, required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Parent
        fields = [
            'full_name', 'profession', 'phone', 'profile_image',
            'street_address', 'city', 'area', 'postal_code', 'country'
        ]

    def validate_phone(self, value):
        if value and not value.startswith(('01', '+8801')):
            raise serializers.ValidationError("Please enter a valid Bangladesh phone number.")
        return value

    def update(self, instance, validated_data):
        # Extract address fields
        address_fields = {
            'street_address': validated_data.pop('street_address', None),
            'city': validated_data.pop('city', None),
            'area': validated_data.pop('area', None),
            'postal_code': validated_data.pop('postal_code', None),
            'country': validated_data.pop('country', None),
        }
        
        # Update parent fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create address
        address_data = {k: v for k, v in address_fields.items() if v is not None}
        if address_data:
            address, created = Address.objects.get_or_create(parent=instance)
            for attr, value in address_data.items():
                setattr(address, attr, value)
            address.save()
        
        return instance

class DaycareImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DaycareImage
        fields = ['id', 'image', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class DaycareCenterRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    otp_code = serializers.CharField(write_only=True, max_length=6, min_length=6)
    user_type = serializers.CharField(write_only=True, default='daycare')

    class Meta:
        model = DaycareCenter
        fields = ['email', 'password', 'otp_code', 'user_type', 'name', 'phone', 'address', 'area', 'nid_number', 'image']

    def validate(self, data):
        email = data['email']
        otp_code = data['otp_code']
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        # Check if there's a recently verified OTP for this email
        recent_verified_otp = EmailOTP.objects.filter(
            email=email,
            purpose='registration',
            is_used=True,
            otp_code=otp_code,
            created_at__gte=timezone.now() - timedelta(minutes=5)
        ).first()
        
        if recent_verified_otp:
            print(f"Found recently verified OTP for daycare registration: {recent_verified_otp.otp_code}")
            data['verified_otp'] = recent_verified_otp
            return data
        
        # If no recently verified OTP, try to verify a fresh one
        try:
            otp = EmailOTP.objects.filter(
                email=email,
                purpose='registration',
                is_used=False
            ).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({"otp_code": "No valid OTP found for this email."})
        
        # Check if OTP is expired
        if timezone.now() > otp.expires_at:
            raise serializers.ValidationError({"otp_code": "OTP has expired. Please request a new code."})
        
        # Check attempts
        if otp.attempts >= otp.max_attempts:
            raise serializers.ValidationError({"otp_code": "Maximum OTP attempts exceeded. Please request a new code."})
        
        # Verify the code
        if not otp.verify(otp_code):
            remaining_attempts = otp.max_attempts - otp.attempts
            if remaining_attempts > 0:
                raise serializers.ValidationError({"otp_code": f"Invalid OTP. {remaining_attempts} attempts remaining."})
            else:
                raise serializers.ValidationError({"otp_code": "Maximum OTP attempts exceeded. Please request a new code."})
        
        # Store the verified OTP instance
        data['verified_otp'] = otp
        return data

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        otp_code = validated_data.pop('otp_code')
        verified_otp = validated_data.pop('verified_otp')
        user_type = validated_data.pop('user_type', 'daycare')
        
        user = User.objects.create_user(
            email=email,
            password=password,
            user_type=user_type,
            is_verified=False,  # Daycare verification by admin
            is_email_verified=True  # Email verified via OTP
        )
        
        daycare = DaycareCenter.objects.create(user=user, **validated_data)
        
        # Send welcome email
        EmailService.send_welcome_email(user.email, user.user_type)
        
        return daycare

class PricingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = DaycarePricing
        fields = ['id', 'name', 'price', 'frequency']

class DaycareProfileSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source='user.email')
    user_type = serializers.ReadOnlyField(source='user.user_type')
    is_verified = serializers.ReadOnlyField()
    is_email_verified = serializers.ReadOnlyField(source='user.is_email_verified')
    joined_at = serializers.ReadOnlyField(source='user.joined_at')
    main_image_url = serializers.SerializerMethodField()
    images = DaycareImageSerializer(many=True, read_only=True)
    # REMOVED 'source' as it's redundant when field name matches related_name
    pricing_tiers = DaycarePricingSerializer(many=True, read_only=True)

    class Meta:
        model = DaycareCenter
        fields = [
            'name', 'phone', 'address', 'area', 'description', 'services',
            'featured_services', 'rating', 'nid_number', 'email', 'user_type',
            'is_verified', 'is_email_verified', 'joined_at', 'main_image_url',
            'images', 'pricing_tiers'
        ]

    def get_main_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class UpdateDaycareProfileSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = DaycareCenter
        fields = [
            'name', 'phone', 'address', 'area', 'description',
            'services', 'featured_services', 'images'
        ]

    def update(self, instance, validated_data):
        request = self.context.get('request')
        images_data = validated_data.pop('images', None)

        # Update main DaycareCenter fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle images
        if images_data is not None:
            DaycareImage.objects.filter(daycare=instance).delete()
            for img in images_data:
                DaycareImage.objects.create(daycare=instance, image=img)

        # --- Handle pricing_tiers manually ---
        pricing_tiers_data = None
        if request and hasattr(request, 'data'):
            raw = request.data.get('pricing_tiers')
            import json
            if raw:
                if isinstance(raw, str):
                    try:
                        pricing_tiers_data = json.loads(raw)
                    except Exception:
                        pricing_tiers_data = []
                elif isinstance(raw, list):
                    pricing_tiers_data = raw
        print("DEBUG: pricing_tiers_data to be saved:", pricing_tiers_data)
        if pricing_tiers_data and isinstance(pricing_tiers_data, list):
            instance.pricing_tiers.all().delete()
            for tier in pricing_tiers_data:
                print("DEBUG: Creating pricing tier:", tier)
                if tier.get('name') and tier.get('price') and tier.get('frequency'):
                    DaycarePricing.objects.create(
                        daycare=instance,
                        name=tier['name'],
                        price=tier['price'],
                        frequency=tier['frequency'],
                        is_active=tier.get('is_active', True)
                    )
        # ---

        return instance