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

    # Daycare Booking Management
    path('daycare/bookings/', views.DaycareBookingListView.as_view(), name='daycare-booking-list'),
    # path('daycare/bookings/<int:booking_id>/', views.daycare_booking_detail, name='daycare-booking-detail'),
    path('daycare/bookings/<int:booking_id>/accept/', views.accept_booking, name='daycare-booking-accept'),
    path('daycare/bookings/<int:booking_id>/complete/', views.complete_booking, name='daycare-booking-complete'),
    path('daycare/history/summary/', views.daycare_booking_history, name='daycare-booking-history'),
    path('daycare/cancel/<int:booking_id>/', views.daycare_cancel_booking, name='daycare-cancel-booking'),
    
    # Daycare Pricing Management
    path('daycare/pricing/', views.DaycarePricingListView.as_view(), name='daycare-pricing-list'),
    path('daycare/pricing/update/', views.update_daycare_pricing, name='daycare-pricing-update'),

    # Public Daycare Listings
    path('public/daycares/', views.PublicDaycareListView.as_view(), name='public-daycare-list'),
]