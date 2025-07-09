from django.urls import path
from . import views

urlpatterns = [
    # Daycare Search and Discovery
    path('daycares/search/', views.DaycareSearchView.as_view(), name='daycare-search'),
    path('daycares/<int:pk>/', views.DaycareDetailView.as_view(), name='daycare-detail'),
    path('daycares/popular/', views.popular_daycares, name='popular-daycares'),
    path('daycares/nearby/', views.nearby_daycares, name='nearby-daycares'),
    
    # Booking Management
    path('bookings/', views.BookingListView.as_view(), name='booking-list'),
    path('bookings/create/', views.BookingCreateView.as_view(), name='booking-create'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<int:pk>/update/', views.BookingUpdateView.as_view(), name='booking-update'),
    path('bookings/<int:booking_id>/cancel/', views.cancel_booking, name='booking-cancel'),
    
    # Booking Reviews
    path('bookings/<int:booking_id>/review/', views.BookingReviewCreateView.as_view(), name='booking-review-create'),
    
    # Booking Messages
    path('bookings/<int:booking_id>/messages/', views.BookingMessageListView.as_view(), name='booking-messages'),
    path('bookings/<int:booking_id>/messages/create/', views.BookingMessageCreateView.as_view(), name='booking-message-create'),
    
    # Statistics and Analytics
    path('stats/', views.booking_stats, name='booking-stats'),
    path('history/summary/', views.booking_history_summary, name='booking-history-summary'),
]