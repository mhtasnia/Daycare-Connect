from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Parent

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
        'emergency_contact', 'phone', 'joined_at'
    )
    search_fields = (
        'user__email', 'full_name', 'profession', 'address',
        'emergency_contact', 'phone'
    )
    ordering = ('id',)
    readonly_fields = ('joined_at',)

admin.site.register(User, UserAdmin)
admin.site.register(Parent, ParentAdmin)
