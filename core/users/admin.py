from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Parent, DaycareCenter
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

class ParentAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'full_name', 'profession', 'address',
         'phone', 'joined_at'
    )
    search_fields = (
        'user__email', 'full_name', 'profession', 'address',
        'emergency_contact', 'phone'
    )
    ordering = ('id',)
    readonly_fields = ('joined_at',)


@admin.register(DaycareCenter)
class DaycareCenterAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_email', 'is_verified', 'area', 'created_at', 'image_tag')
    search_fields = ('user__email', 'area')

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

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 60px;"/>', obj.image.url)
        return "-"
    image_tag.short_description = 'Image'


admin.site.register(User, UserAdmin)
admin.site.register(Parent, ParentAdmin)
admin.site.unregister(blacklist_models.BlacklistedToken)
admin.site.unregister(blacklist_models.OutstandingToken)

