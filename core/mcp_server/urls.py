from django.urls import path
from .views import IntelligentSearchAPIView

urlpatterns = [
    path('search/', IntelligentSearchAPIView.as_view(), name='intelligent_search'),
]