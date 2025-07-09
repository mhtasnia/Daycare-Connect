from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    Booking, BookingReview, BookingMessage, 
    DaycareAvailability, BookingPayment
)
from users.models import DaycareCenter, Parent
from users.permissions import IsParent
from .serializers import (
    DaycareSearchSerializer, DaycareDetailSerializer,
    BookingCreateSerializer, BookingSerializer, BookingUpdateSerializer,
    BookingCancelSerializer, BookingReviewSerializer,
    BookingMessageSerializer, BookingStatsSerializer
)


class DaycareSearchView(generics.ListAPIView):
    """
    Search and filter verified daycares
    """
    serializer_class = DaycareSearchSerializer
    permission_classes = [IsAuthenticated, IsParent]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['area']
    search_fields = ['name', 'address', 'services', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = DaycareCenter.objects.filter(
            user__is_verified=True,
            user__is_email_verified=True
        ).select_related('user')
        
        # Filter by rating
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                min_rating = float(min_rating)
                # Get daycares with average rating >= min_rating
                daycare_ids = []
                for daycare in queryset:
                    avg_rating = daycare.reviews.filter(is_approved=True).aggregate(
                        avg_rating=Avg('rating')
                    )['avg_rating']
                    if avg_rating and avg_rating >= min_rating:
                        daycare_ids.append(daycare.id)
                queryset = queryset.filter(id__in=daycare_ids)
            except ValueError:
                pass
        
        # Filter by availability
        has_availability = self.request.query_params.get('has_availability')
        if has_availability == 'true':
            today = timezone.now().strftime('%A').lower()
            available_daycare_ids = []
            for daycare in queryset:
                try:
                    availability = daycare.availability.get(day_of_week=today)
                    if availability.available_slots > 0:
                        available_daycare_ids.append(daycare.id)
                except DaycareAvailability.DoesNotExist:
                    pass
            queryset = queryset.filter(id__in=available_daycare_ids)
        
        # Filter by services
        services = self.request.query_params.get('services')
        if services:
            service_list = [s.strip() for s in services.split(',')]
            for service in service_list:
                queryset = queryset.filter(services__icontains=service)
        
        return queryset


class DaycareDetailView(generics.RetrieveAPIView):
    """
    Get detailed information about a specific daycare
    """
    serializer_class = DaycareDetailSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def get_queryset(self):
        return DaycareCenter.objects.filter(
            user__is_verified=True,
            user__is_email_verified=True
        ).select_related('user')


class BookingCreateView(generics.CreateAPIView):
    """
    Create a new booking
    """
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def perform_create(self, serializer):
        serializer.save()


class BookingListView(generics.ListAPIView):
    """
    List all bookings for the authenticated parent
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsParent]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'booking_type', 'daycare']
    ordering_fields = ['created_at', 'start_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        parent = self.request.user.parent_profile
        return Booking.objects.filter(parent=parent).select_related(
            'daycare', 'child', 'daycare__user'
        )


class BookingDetailView(generics.RetrieveAPIView):
    """
    Get detailed information about a specific booking
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def get_queryset(self):
        parent = self.request.user.parent_profile
        return Booking.objects.filter(parent=parent).select_related(
            'daycare', 'child', 'daycare__user'
        )


class BookingUpdateView(generics.UpdateAPIView):
    """
    Update booking details (only for pending bookings)
    """
    serializer_class = BookingUpdateSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def get_queryset(self):
        parent = self.request.user.parent_profile
        return Booking.objects.filter(
            parent=parent,
            status='pending'
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsParent])
def cancel_booking(request, booking_id):
    """
    Cancel a booking
    """
    try:
        parent = request.user.parent_profile
        booking = Booking.objects.get(id=booking_id, parent=parent)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = BookingCancelSerializer(
        data=request.data, 
        context={'booking': booking}
    )
    
    if serializer.is_valid():
        booking.status = 'cancelled'
        booking.cancelled_at = timezone.now()
        booking.cancelled_by = 'parent'
        booking.cancellation_reason = serializer.validated_data['cancellation_reason']
        booking.save()
        
        return Response({
            'message': 'Booking cancelled successfully',
            'booking': BookingSerializer(booking, context={'request': request}).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingReviewCreateView(generics.CreateAPIView):
    """
    Create a review for a completed booking
    """
    serializer_class = BookingReviewSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        try:
            booking_id = self.kwargs['booking_id']
            parent = self.request.user.parent_profile
            booking = Booking.objects.get(id=booking_id, parent=parent)
            context['booking'] = booking
        except Booking.DoesNotExist:
            pass
        return context
    
    def create(self, request, *args, **kwargs):
        try:
            booking_id = kwargs['booking_id']
            parent = request.user.parent_profile
            booking = Booking.objects.get(id=booking_id, parent=parent)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return super().create(request, *args, **kwargs)


class BookingMessageListView(generics.ListAPIView):
    """
    List messages for a specific booking
    """
    serializer_class = BookingMessageSerializer
    permission_classes = [IsAuthenticated, IsParent]
    ordering = ['created_at']
    
    def get_queryset(self):
        booking_id = self.kwargs['booking_id']
        parent = self.request.user.parent_profile
        
        try:
            booking = Booking.objects.get(id=booking_id, parent=parent)
            return BookingMessage.objects.filter(booking=booking)
        except Booking.DoesNotExist:
            return BookingMessage.objects.none()


class BookingMessageCreateView(generics.CreateAPIView):
    """
    Send a message for a specific booking
    """
    serializer_class = BookingMessageSerializer
    permission_classes = [IsAuthenticated, IsParent]
    
    def perform_create(self, serializer):
        booking_id = self.kwargs['booking_id']
        parent = self.request.user.parent_profile
        
        try:
            booking = Booking.objects.get(id=booking_id, parent=parent)
            serializer.save(
                booking=booking,
                sender=self.request.user
            )
        except Booking.DoesNotExist:
            raise serializers.ValidationError("Booking not found")


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def booking_stats(request):
    """
    Get booking statistics for the authenticated parent
    """
    parent = request.user.parent_profile
    bookings = Booking.objects.filter(parent=parent)
    
    stats = {
        'total_bookings': bookings.count(),
        'active_bookings': bookings.filter(status__in=['confirmed', 'active']).count(),
        'completed_bookings': bookings.filter(status='completed').count(),
        'cancelled_bookings': bookings.filter(status='cancelled').count(),
        'total_spent': bookings.filter(
            status__in=['completed', 'active']
        ).aggregate(total=Sum('paid_amount'))['total'] or 0,
        'upcoming_bookings': bookings.filter(
            status__in=['pending', 'confirmed'],
            start_date__gte=timezone.now().date()
        ).count()
    }
    
    serializer = BookingStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def popular_daycares(request):
    """
    Get popular daycares based on bookings and reviews
    """
    daycares = DaycareCenter.objects.filter(
        user__is_verified=True,
        user__is_email_verified=True
    ).annotate(
        booking_count=Count('bookings'),
        review_count=Count('reviews', filter=Q(reviews__is_approved=True)),
        avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
    ).filter(
        booking_count__gt=0
    ).order_by('-booking_count', '-avg_rating')[:10]
    
    serializer = DaycareSearchSerializer(
        daycares, 
        many=True, 
        context={'request': request}
    )
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def nearby_daycares(request):
    """
    Get daycares in the same area as the parent
    """
    parent = request.user.parent_profile
    
    # Get parent's area
    parent_area = None
    if hasattr(parent, 'address') and parent.address.area:
        parent_area = parent.address.area
    
    if not parent_area:
        return Response({
            'message': 'Please update your address to see nearby daycares',
            'daycares': []
        })
    
    daycares = DaycareCenter.objects.filter(
        user__is_verified=True,
        user__is_email_verified=True,
        area=parent_area
    ).annotate(
        avg_rating=Avg('reviews__rating', filter=Q(reviews__is_approved=True))
    ).order_by('-avg_rating')
    
    serializer = DaycareSearchSerializer(
        daycares, 
        many=True, 
        context={'request': request}
    )
    return Response({
        'area': parent.address.get_area_display(),
        'daycares': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def booking_history_summary(request):
    """
    Get a summary of booking history with key metrics
    """
    parent = request.user.parent_profile
    bookings = Booking.objects.filter(parent=parent)
    
    # Monthly booking summary for the last 6 months
    six_months_ago = timezone.now().date() - timedelta(days=180)
    monthly_bookings = []
    
    for i in range(6):
        month_start = six_months_ago + timedelta(days=30*i)
        month_end = month_start + timedelta(days=30)
        
        month_bookings = bookings.filter(
            created_at__date__gte=month_start,
            created_at__date__lt=month_end
        )
        
        monthly_bookings.append({
            'month': month_start.strftime('%B %Y'),
            'bookings': month_bookings.count(),
            'amount_spent': month_bookings.aggregate(
                total=Sum('paid_amount')
            )['total'] or 0
        })
    
    # Favorite daycares (most booked)
    favorite_daycares = bookings.values(
        'daycare__name', 'daycare__id'
    ).annotate(
        booking_count=Count('id')
    ).order_by('-booking_count')[:5]
    
    return Response({
        'monthly_summary': monthly_bookings,
        'favorite_daycares': favorite_daycares,
        'total_children_enrolled': bookings.values('child').distinct().count(),
        'average_booking_duration': bookings.filter(
            end_date__isnull=False
        ).aggregate(
            avg_duration=Avg('duration_days')
        )['avg_duration'] or 0
    })