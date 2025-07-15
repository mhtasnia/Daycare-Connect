from django.db import models
from django.contrib.auth import get_user_model
from users.models import Parent, DaycareCenter, Child
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

User = get_user_model()

class DaycarePricing(models.Model):
    BOOKING_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('hourly', 'Hourly'),
        ('drop_in', 'Drop In'),
    ]
    
    daycare = models.ForeignKey(DaycareCenter, on_delete=models.CASCADE, related_name='pricing_tiers')
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_unit = models.CharField(max_length=20, default='month')  # hour, day, week, month
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['daycare', 'booking_type']
        ordering = ['booking_type']
    
    def __str__(self):
        return f"{self.daycare.name} - {self.get_booking_type_display()}: ৳{self.price}/{self.duration_unit}"
class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('hourly', 'Hourly'),
        ('drop_in', 'Drop In'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]
    
    # Basic Information
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='bookings')
    daycare = models.ForeignKey(DaycareCenter, on_delete=models.CASCADE, related_name='bookings')
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking Details
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    # Status and Payment
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Pricing
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Additional Information
    special_instructions = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=20)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    # Cancellation
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)
    cancelled_by = models.CharField(max_length=20, choices=[('parent', 'Parent'), ('daycare', 'Daycare')], blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['parent', 'status']),
            models.Index(fields=['daycare', 'status']),
            models.Index(fields=['start_date']),
        ]
    
    def __str__(self):
        return f"Booking #{self.id} - {self.child.full_name} at {self.daycare.name}"
    
    @property
    def duration_days(self):
        if self.end_date:
            return (self.end_date - self.start_date).days + 1
        return 1
    
    @property
    def remaining_amount(self):
        return self.total_amount - self.paid_amount
    
    @property
    def is_active(self):
        return self.status in ['confirmed', 'active'] and self.start_date <= timezone.now().date()
    
    def can_be_cancelled(self):
        """Check if booking can be cancelled (at least 24 hours before start)"""
        if self.status not in ['pending', 'confirmed']:
            return False
        
        cancellation_deadline = timezone.now() + timedelta(hours=24)
        booking_start = timezone.datetime.combine(self.start_date, self.start_time or timezone.datetime.min.time())
        
        return booking_start > cancellation_deadline


class BookingReview(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review')
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='reviews')
    daycare = models.ForeignKey(DaycareCenter, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    
    # Review aspects
    cleanliness_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    staff_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    communication_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    value_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['booking', 'parent']
    
    def __str__(self):
        return f"Review by {self.parent.full_name} for {self.daycare.name} - {self.rating} stars"


class BookingMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('general', 'General'),
        ('pickup_change', 'Pickup Change'),
        ('schedule_change', 'Schedule Change'),
        ('emergency', 'Emergency'),
        ('complaint', 'Complaint'),
    ]
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_booking_messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='general')
    
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Attachments (for future implementation)
    attachment = models.FileField(upload_to='booking_messages/', null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.email} - {self.subject}"


class DaycareAvailability(models.Model):
    DAY_CHOICES = [
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    ]
    
    daycare = models.ForeignKey(DaycareCenter, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    
    is_available = models.BooleanField(default=True)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    
    # Capacity management
    max_capacity = models.IntegerField(default=30)
    current_bookings = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['daycare', 'day_of_week']
        ordering = ['day_of_week']
    
    def __str__(self):
        return f"{self.daycare.name} - {self.get_day_of_week_display()}"
    
    @property
    def available_slots(self):
        return max(0, self.max_capacity - self.current_bookings)
    
    @property
    def is_full(self):
        return self.current_bookings >= self.max_capacity


class BookingPayment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('bkash', 'bKash'),
        ('nagad', 'Nagad'),
        ('rocket', 'Rocket'),
        ('bank_transfer', 'Bank Transfer'),
        ('card', 'Credit/Debit Card'),
    ]
    
    PAYMENT_TYPE_CHOICES = [
        ('full', 'Full Payment'),
        ('partial', 'Partial Payment'),
        ('advance', 'Advance Payment'),
        ('refund', 'Refund'),
    ]
    
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    
    # Payment details
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    
    # Status
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_payments')
    verified_at = models.DateTimeField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment #{self.id} - ৳{self.amount} for Booking #{self.booking.id}"