from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Parent, DaycareCenter, Address, Child, EmergencyContact
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist import models as blacklist_models
from django.utils.html import format_html

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'user_type', 'is_staff', 'is_active', 'joined_at')
    list_filter = ('user_type', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'user_type', 'joined_at')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_type', 'is_staff', 'is_active')}
        ),
    )
    filter_horizontal = ('groups', 'user_permissions',)

class AddressInline(admin.StackedInline):
    model = Address
    extra = 0
    max_num = 1

class ChildInline(admin.TabularInline):
    model = Child
    extra = 0
    readonly_fields = ('age',)

class EmergencyContactInline(admin.StackedInline):
    model = EmergencyContact
    extra = 0
    max_num = 1

class ParentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'full_name', 'profession', 'phone', 'get_area', 'joined_at'
    )
    search_fields = (
        'user__email', 'full_name', 'profession', 'phone'
    )
    ordering = ('id',)
    readonly_fields = ('joined_at',)
    inlines = [AddressInline, ChildInline, EmergencyContactInline]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'address')

    def get_area(self, obj):
        if hasattr(obj, 'address') and obj.address.area:
            return obj.address.get_area_display()
        return "Not specified"
    get_area.short_description = 'Area'

@admin.register(DaycareCenter)
class DaycareCenterAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_email', 'name', 'get_area_display', 'is_verified', 'created_at', 'image_tag')
    list_filter = ('area', 'is_verified', 'created_at')
    search_fields = ('user__email', 'name', 'area')
    readonly_fields = ('created_at',)

    def is_verified(self, obj):
        return obj.user.is_verified
    is_verified.boolean = True

    def save_model(self, request, obj, form, change):
        # Sync verification status to user
        obj.user.is_verified = obj.is_verified
        obj.user.save()
        super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(user__user_type='daycare')  

    def user_email(self, obj):
        return obj.user.email

    def get_area_display(self, obj):
        return obj.get_area_display() if obj.area else "Not specified"
    get_area_display.short_description = 'Area'

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 60px;"/>', obj.image.url)
        return "-"
    image_tag.short_description = 'Image'

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('parent', 'street_address', 'get_area_display', 'city', 'postal_code')
    list_filter = ('area', 'city')
    search_fields = ('parent__full_name', 'parent__user__email', 'street_address', 'city')

@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'parent', 'age', 'gender', 'date_of_birth')
    list_filter = ('gender', 'date_of_birth')
    search_fields = ('full_name', 'parent__full_name', 'parent__user__email')
    readonly_fields = ('age',)

@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'parent', 'relationship', 'phone_primary', 'is_authorized_pickup')
    list_filter = ('relationship', 'is_authorized_pickup')
    search_fields = ('full_name', 'parent__full_name', 'parent__user__email', 'phone_primary')

admin.site.register(User, UserAdmin)
admin.site.register(Parent, ParentAdmin)
admin.site.unregister(blacklist_models.BlacklistedToken)
admin.site.unregister(blacklist_models.OutstandingToken)