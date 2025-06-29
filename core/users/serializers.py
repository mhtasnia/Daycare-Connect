from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from .models import User, Parent, DaycareCenter, EmailOTP
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
        
        # Verify OTP first
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

class DaycareCenterRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    otp_code = serializers.CharField(write_only=True, max_length=6, min_length=6)
    user_type = serializers.CharField(write_only=True, default='daycare')

    class Meta:
        model = DaycareCenter
        fields = ['email', 'password', 'otp_code', 'user_type', 'name', 'phone', 'address', 'license', 'image']

    def validate(self, data):
        email = data['email']
        otp_code = data['otp_code']
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
        
        # Verify OTP
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