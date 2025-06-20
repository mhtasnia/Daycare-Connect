from django.urls import path
from .views import parent_register, parent_login, parent_logout

urlpatterns = [
    path('register/', parent_register, name='parent-register'),
    path('login/', parent_login, name='parent-login'),
    path('logout/', parent_logout, name='parent-logout'),
]