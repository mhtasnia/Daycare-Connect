from django.urls import path
from .views import (
    parent_register, parent_login, parent_logout, 
    daycare_register_request, daycare_login, daycare_logout,
    send_otp, verify_otp, parent_profile, update_parent_profile,
    daycare_profile, update_daycare_profile,
    manage_children, manage_child, manage_emergency_contacts, manage_emergency_contact
)

urlpatterns = [
    # OTP endpoints
    path('send-otp/', send_otp, name='send-otp'),
    path('verify-otp/', verify_otp, name='verify-otp'),
    
    # Parent endpoints
    path('parents/register/', parent_register, name='parent-register'),
    path('parents/login/', parent_login, name='parent-login'),
    path('parents/logout/', parent_logout, name='parent-logout'),
    path('parents/profile/', parent_profile, name='parent-profile'),
    path('parents/profile/update/', update_parent_profile, name='update-parent-profile'),
    
    # Child management endpoints
    path('parents/children/', manage_children, name='manage-children'),
    path('parents/children/<int:child_id>/', manage_child, name='manage-child'),
    
    # Emergency contact management endpoints
    path('parents/emergency-contacts/', manage_emergency_contacts, name='manage-emergency-contacts'),
    path('parents/emergency-contacts/<int:contact_id>/', manage_emergency_contact, name='manage-emergency-contact'),
    
    # Daycare endpoints
    path('daycares/register/', daycare_register_request, name='daycare-register'),
    path('daycares/login/', daycare_login, name='daycare-login'),
    path('daycares/logout/', daycare_logout, name='daycare-logout'),
    path('daycare/profile/', daycare_profile, name='daycare-profile'),
    path('daycare/profile/update/', update_daycare_profile, name='update-daycare-profile'),
]