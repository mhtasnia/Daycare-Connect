from rest_framework import serializers
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    Booking, BookingReview, BookingMessage, 
    DaycareAvailability, BookingPayment, DaycarePricing
)
from users.models import DaycareCenter, Child, Parent
# from users.serializers import ChildSerializer

# booking/serializers.py (or relevant file)

# booking/serializers.py (or relevant file where DaycarePricingSerializer is defined)

class DaycarePricingSerializer(serializers.ModelSerializer):
        class Meta:
            model = DaycarePricing
            # These fields MUST EXACTLY match the fields in your DaycarePricing model
            fields = ['id', 'name', 'price', 'frequency', 'is_active']

        def to_internal_value(self, data):
            # THIS IS THE CRITICAL DEBUG PRINT
            print("DEBUG DaycarePricingSerializer.to_internal_value: data received for single tier:", data)
            try:
                # This is crucial: call the parent's to_internal_value for default processing
                internal_value = super().to_internal_value(data)
                # THIS IS ANOTHER CRITICAL DEBUG PRINT
                print("DEBUG DaycarePricingSerializer.to_internal_value: internal_value processed for single tier:", internal_value)
                return internal_value
            except serializers.ValidationError as e:
                # THIS IS THE MOST CRITICAL DEBUG PRINT IF VALIDATION FAILS
                print("DEBUG DaycarePricingSerializer.to_internal_value: Validation Error for single tier:", e.detail)
                raise  # Re-raise the error so DRF reports it properly

class DaycareSearchSerializer(serializers.ModelSerializer):
    """Serializer for daycare search results"""
    area_display = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    available_slots = serializers.SerializerMethodField()
    main_image_url = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    
    class Meta:
        model = DaycareCenter
        fields = [
            'id', 'name', 'address', 'area', 'area_display', 'phone', 
            'rating', 'review_count', 'services', 'description',
            'main_image_url', 'available_slots', 'distance', 'created_at'
        ]
    
    def get_area_display(self, obj):
        return obj.get_area_display() if obj.area else ""
    
    def get_rating(self, obj):
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else 0.0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()
    
    def get_available_slots(self, obj):
        # Calculate available slots based on current day
        today = timezone.now().strftime('%A').lower()
        try:
            availability = obj.availability.get(day_of_week=today)
            return availability.available_slots
        except DaycareAvailability.DoesNotExist:
            return 0
    
    def get_main_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_distance(self, obj):
        # Placeholder for distance calculation
        # In a real implementation, you'd calculate based on user's location
        return None


class DaycareDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual daycare view"""
    area_display = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()
    main_image_url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    pricing_tiers = DaycarePricingSerializer(many=True, read_only=True)
    
    class Meta:
        model = DaycareCenter
        fields = [
            'id', 'name', 'address', 'area', 'area_display', 'phone', 
            'rating', 'review_count', 'services', 'description',
            'main_image_url', 'images', 'reviews', 'availability', 'pricing_tiers',
            'created_at'
        ]
    
    def get_area_display(self, obj):
        return obj.get_area_display() if obj.area else ""
    
    def get_rating(self, obj):
        avg_rating = obj.reviews.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating']
        return round(avg_rating, 1) if avg_rating else 0.0
    
    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()
    
    def get_reviews(self, obj):
        reviews = obj.reviews.filter(is_approved=True).order_by('-created_at')[:5]
        return BookingReviewSerializer(reviews, many=True, context=self.context).data
    
    def get_availability(self, obj):
        availability = obj.availability.all().order_by('day_of_week')
        return DaycareAvailabilitySerializer(availability, many=True).data
    
    def get_main_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_images(self, obj):
        images = obj.images.all()
        request = self.context.get('request')
        image_urls = []
        for img in images:
            if request:
                image_urls.append(request.build_absolute_uri(img.image.url))
            else:
                image_urls.append(img.image.url)
        return image_urls


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new bookings"""
    
    class Meta:
        model = Booking
        fields = [
            'daycare', 'child', 'booking_type', 'start_date', 'end_date',
            'start_time', 'end_time', 'special_instructions',
            'emergency_contact', 'payment_method'
        ]
    
    def validate(self, data):
        parent = self.context['request'].user.parent_profile
        
        # Validate child belongs to parent
        if data['child'].parent != parent:
            raise serializers.ValidationError("Child does not belong to this parent.")
        
        # Validate emergency contact belongs to parent
        if data['emergency_contact'].parent != parent:
            raise serializers.ValidationError("Emergency contact does not belong to this parent.")
        
        # Validate dates
        if data['start_date'] < timezone.now().date():
            raise serializers.ValidationError("Start date cannot be in the past.")
        
        # Validate daycare is verified
        if not data['daycare'].user.is_verified:
            raise serializers.ValidationError("This daycare is not verified yet.")
        
        # Calculate end_date based on booking_type
        if data['booking_type'] == 'monthly':
            end_date = data['start_date'] + timedelta(days=30)
        else:  # daily care
            end_date = data['start_date'] + timedelta(days=1)
        
        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            child=data['child'],
            status__in=['pending', 'confirmed', 'active'],
            start_date__lte=end_date,
            end_date__gte=data['start_date']
        )
        
        if overlapping_bookings.exists():
            raise serializers.ValidationError("Child already has a booking during this period.")
        
        data['end_date'] = end_date
        return data
    
    def create(self, validated_data):
        parent = self.context['request'].user.parent_profile
        
        # Calculate total amount based on daycare pricing
        daycare = validated_data['daycare']
        booking_type = validated_data['booking_type']
        
        try:
            # Match booking_type with frequency ('monthly' -> 'Monthly', 'daily' -> 'Daily')
            frequency_mapping = {
                'monthly': 'Monthly',
                'daily': 'Daily',
            }
            frequency = frequency_mapping.get(booking_type)
            
            pricing = DaycarePricing.objects.get(daycare=daycare, frequency=frequency, is_active=True)
            total_amount = pricing.price
        except DaycarePricing.DoesNotExist:
            # Default pricing if not set
            default_rates = {
                'monthly': 8000,
                'daily': 300,
            }
            total_amount = default_rates.get(booking_type, 8000)
        
        # Calculate end_date
        if booking_type == 'monthly':
            end_date = validated_data['start_date'] + timedelta(days=30)
        else:  # daily care
            end_date = validated_data['start_date'] + timedelta(days=1)
        
        # Create booking
        booking = Booking.objects.create(
            parent=parent,
            total_amount=total_amount,
            **validated_data
        )
        
        return booking


class BookingSerializer(serializers.ModelSerializer):
    
    daycare_name = serializers.CharField(source='daycare.name', read_only=True)
    daycare_phone = serializers.CharField(source='daycare.phone', read_only=True)
    daycare_address = serializers.CharField(source='daycare.address', read_only=True)
    daycare_image = serializers.SerializerMethodField()
    child_name = serializers.CharField(source='child.full_name', read_only=True)
    child_age = serializers.IntegerField(source='child.age', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    booking_type_display = serializers.CharField(source='get_booking_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    emergency_contact_name = serializers.CharField(source='emergency_contact.full_name', read_only=True)
    emergency_contact_phone = serializers.CharField(source='emergency_contact.phone_primary', read_only=True)
    can_cancel = serializers.SerializerMethodField()
    can_review = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'daycare', 'daycare_name', 'daycare_phone', 'daycare_address', 
            'daycare_image', 'child', 'child_name', 'child_age',
            'booking_type', 'booking_type_display', 'start_date', 'end_date',
            'start_time', 'end_time', 'status', 'status_display',
            'payment_status', 'payment_method', 'payment_method_display',
            'total_amount', 'paid_amount', 'remaining_amount',
            'special_instructions', 'emergency_contact_name', 'emergency_contact_phone',
            'created_at', 'updated_at', 'confirmed_at', 'cancelled_at',
            'cancellation_reason', 'cancelled_by', 'can_cancel', 'can_review'
        ]
    
    def get_daycare_image(self, obj):
        if obj.daycare.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.daycare.image.url)
            return obj.daycare.image.url
        return None
    
    def get_can_cancel(self, obj):
        return obj.can_be_cancelled()
    
    def get_can_review(self, obj):
        return (obj.status == 'completed' and 
                not hasattr(obj, 'review'))


class BookingUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating booking details"""
    
    class Meta:
        model = Booking
        fields = [
            'start_date', 'start_time', 'end_time',
            'special_instructions', 'emergency_contact', 'payment_method'
        ]
    
    def validate(self, data):
        booking = self.instance
        
        # Only allow updates for pending bookings
        if booking.status not in ['pending']:
            raise serializers.ValidationError("Only pending bookings can be updated.")
        
        # Validate dates
        if 'start_date' in data and data['start_date'] < timezone.now().date():
            raise serializers.ValidationError("Start date cannot be in the past.")
        
        # Validate emergency contact if provided
        if 'emergency_contact' in data:
            parent = booking.parent
            if data['emergency_contact'].parent != parent:
                raise serializers.ValidationError("Emergency contact does not belong to this parent.")
        
        return data
    
    def update(self, instance, validated_data):
        # Update end_date if start_date changes
        if 'start_date' in validated_data:
            new_start_date = validated_data['start_date']
            if instance.booking_type == 'monthly':
                instance.end_date = new_start_date + timedelta(days=30)
            else:  # daily care
                instance.end_date = new_start_date + timedelta(days=30)
        
        return super().update(instance, validated_data)


class BookingCancelSerializer(serializers.Serializer):
    """Serializer for cancelling bookings"""
    cancellation_reason = serializers.CharField(max_length=500)
    
    def validate(self, data):
        booking = self.context['booking']
        
        if not booking.can_be_cancelled():
            raise serializers.ValidationError("This booking cannot be cancelled.")
        
        return data


class BookingReviewSerializer(serializers.ModelSerializer):
    """Serializer for booking reviews"""
    parent_name = serializers.CharField(source='parent.full_name', read_only=True)
    daycare_name = serializers.CharField(source='daycare.name', read_only=True)
    
    class Meta:
        model = BookingReview
        fields = [
            'id', 'booking', 'parent_name', 'daycare_name',
            'rating', 'comment', 'cleanliness_rating', 'staff_rating',
            'communication_rating', 'value_rating', 'is_featured',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['booking', 'parent', 'daycare']
    
    def create(self, validated_data):
        booking = self.context['booking']
        
        # Ensure booking is completed
        if booking.status != 'completed':
            raise serializers.ValidationError("Can only review completed bookings.")
        
        # Ensure no existing review
        if hasattr(booking, 'review'):
            raise serializers.ValidationError("Booking already has a review.")
        
        review = BookingReview.objects.create(
            booking=booking,
            parent=booking.parent,
            daycare=booking.daycare,
            **validated_data
        )
        
        return review


class DaycareAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for daycare availability"""
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = DaycareAvailability
        fields = [
            'day_of_week', 'day_display', 'is_available',
            'opening_time', 'closing_time', 'max_capacity',
            'current_bookings', 'available_slots', 'is_full'
        ]


class BookingMessageSerializer(serializers.ModelSerializer):
    """Serializer for booking messages"""
    sender_name = serializers.SerializerMethodField()
    sender_type = serializers.SerializerMethodField()
    
    class Meta:
        model = BookingMessage
        fields = [
            'id', 'booking', 'sender', 'sender_name', 'sender_type',
            'message_type', 'subject', 'message', 'attachment',
            'is_read', 'created_at'
        ]
        read_only_fields = ['sender']
    
    def get_sender_name(self, obj):
        if hasattr(obj.sender, 'parent_profile'):
            return obj.sender.parent_profile.full_name or obj.sender.email
        elif hasattr(obj.sender, 'daycare_profile'):
            return obj.sender.daycare_profile.name
        return obj.sender.email
    
    def get_sender_type(self, obj):
        if hasattr(obj.sender, 'parent_profile'):
            return 'parent'
        elif hasattr(obj.sender, 'daycare_profile'):
            return 'daycare'
        return 'admin'


class BookingStatsSerializer(serializers.Serializer):
    """Serializer for booking statistics"""
    total_bookings = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    completed_bookings = serializers.IntegerField()
    cancelled_bookings = serializers.IntegerField()
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2)
    upcoming_bookings = serializers.IntegerField()