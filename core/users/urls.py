from django.urls import path
from .views import parent_register, parent_login, parent_logout, daycare_register_request, daycare_login, daycare_logout

urlpatterns = [
    path('parents/register/', parent_register, name='parent-register'),
    path('parents/login/', parent_login, name='parent-login'),
    path('parents/logout/', parent_logout, name='parent-logout'),
    path('daycares/register/', daycare_register_request, name='daycare-register'),
    path('daycares/login/', daycare_login, name='daycare-login'),
    path('daycares/logout/', daycare_logout, name='daycare-logout'),
]