from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    Booking, BookingReview, BookingMessage, 
    DaycareAvailability, BookingPayment, DaycarePricing
)

@admin.register(DaycarePricing)
class DaycarePricingAdmin(admin.ModelAdmin):
    list_display = [
        'daycare_name', 'booking_type', 'price', 'duration_unit', 
        'is_active', 'created_at'
    ]
    list_filter = ['booking_type', 'duration_unit', 'is_active', 'created_at']
    search_fields = ['daycare__name']
    ordering = ['daycare__name', 'booking_type']
    
    def daycare_name(self, obj):
        return obj.daycare.name
    daycare_name.short_description = 'Daycare'
    daycare_name.admin_order_field = 'daycare__name'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'parent_name', 'daycare_name', 'child_name', 
        'booking_type', 'status', 'start_date', 'total_amount', 
        'payment_status', 'created_at'
    ]
    list_filter = [
        'status', 'booking_type', 'payment_status', 
        'created_at', 'start_date', 'daycare__area'
    ]
    search_fields = [
        'parent__full_name', 'parent__user__email',
        'daycare__name', 'child__full_name'
    ]
    readonly_fields = [
        'created_at', 'updated_at', 'confirmed_at', 
        'cancelled_at', 'remaining_amount', 'duration_days'
    ]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('parent', 'daycare', 'child')
        }),
        ('Booking Details', {
            'fields': (
                'booking_type', 'start_date', 'end_date', 
                'start_time', 'end_time', 'special_instructions'
            )
        }),
        ('Status & Payment', {
            'fields': (
                'status', 'payment_status', 'total_amount', 
                'paid_amount', 'remaining_amount'
            )
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Timestamps', {
            'fields': (
                'created_at', 'updated_at', 'confirmed_at', 
                'cancelled_at', 'duration_days'
            ),
            'classes': ('collapse',)
        }),
        ('Cancellation', {
            'fields': ('cancellation_reason', 'cancelled_by'),
            'classes': ('collapse',)
        })
    )
    
    def parent_name(self, obj):
        return obj.parent.full_name or obj.parent.user.email
    parent_name.short_description = 'Parent'
    parent_name.admin_order_field = 'parent__full_name'
    
    def daycare_name(self, obj):
        return obj.daycare.name
    daycare_name.short_description = 'Daycare'
    daycare_name.admin_order_field = 'daycare__name'
    
    def child_name(self, obj):
        return obj.child.full_name
    child_name.short_description = 'Child'
    child_name.admin_order_field = 'child__full_name'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'parent', 'parent__user', 'daycare', 'child'
        )


@admin.register(BookingReview)
class BookingReviewAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'parent_name', 'daycare_name', 'rating', 
        'is_approved', 'is_featured', 'created_at'
    ]
    list_filter = [
        'rating', 'is_approved', 'is_featured', 
        'created_at', 'daycare__area'
    ]
    search_fields = [
        'parent__full_name', 'daycare__name', 'comment'
    ]
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('booking', 'parent', 'daycare', 'rating', 'comment')
        }),
        ('Detailed Ratings', {
            'fields': (
                'cleanliness_rating', 'staff_rating', 
                'communication_rating', 'value_rating'
            )
        }),
        ('Moderation', {
            'fields': ('is_approved', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def parent_name(self, obj):
        return obj.parent.full_name or obj.parent.user.email
    parent_name.short_description = 'Parent'
    
    def daycare_name(self, obj):
        return obj.daycare.name
    daycare_name.short_description = 'Daycare'
    
    actions = ['approve_reviews', 'feature_reviews', 'unffeature_reviews']
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "Approve selected reviews"
    
    def feature_reviews(self, request, queryset):
        queryset.update(is_featured=True)
    feature_reviews.short_description = "Feature selected reviews"
    
    def unfature_reviews(self, request, queryset):
        queryset.update(is_featured=False)
    unfature_reviews.short_description = "Unfeature selected reviews"


@admin.register(BookingMessage)
class BookingMessageAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'booking_id', 'sender_name', 'message_type', 
        'subject', 'is_read', 'created_at'
    ]
    list_filter = ['message_type', 'is_read', 'created_at']
    search_fields = ['subject', 'message', 'sender__email']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def booking_id(self, obj):
        return f"#{obj.booking.id}"
    booking_id.short_description = 'Booking'
    
    def sender_name(self, obj):
        if hasattr(obj.sender, 'parent_profile'):
            return obj.sender.parent_profile.full_name or obj.sender.email
        elif hasattr(obj.sender, 'daycare_profile'):
            return obj.sender.daycare_profile.name
        return obj.sender.email
    sender_name.short_description = 'Sender'


@admin.register(DaycareAvailability)
class DaycareAvailabilityAdmin(admin.ModelAdmin):
    list_display = [
        'daycare_name', 'day_of_week', 'is_available', 
        'opening_time', 'closing_time', 'available_slots'
    ]
    list_filter = ['day_of_week', 'is_available', 'daycare__area']
    search_fields = ['daycare__name']
    ordering = ['daycare__name', 'day_of_week']
    
    def daycare_name(self, obj):
        return obj.daycare.name
    daycare_name.short_description = 'Daycare'
    daycare_name.admin_order_field = 'daycare__name'


@admin.register(BookingPayment)
class BookingPaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'booking_id', 'amount', 'payment_method', 
        'payment_type', 'is_verified', 'created_at'
    ]
    list_filter = [
        'payment_method', 'payment_type', 'is_verified', 'created_at'
    ]
    search_fields = [
        'booking__id', 'transaction_id', 'payment_reference'
    ]
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def booking_id(self, obj):
        return f"#{obj.booking.id}"
    booking_id.short_description = 'Booking'
    
    actions = ['verify_payments']
    
    def verify_payments(self, request, queryset):
        queryset.update(is_verified=True, verified_by=request.user)
    verify_payments.short_description = "Verify selected payments"