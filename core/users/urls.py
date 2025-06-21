from django.urls import path
from .views import parent_register, parent_login, parent_logout

urlpatterns = [
    path('parents/register/', parent_register, name='parent-register'),
    path('parents/login/', parent_login, name='parent-login'),
    path('parents/logout/', parent_logout, name='parent-logout'),
]