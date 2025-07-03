from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import (
    ParentRegisterSerializer, 
    DaycareCenterRegisterSerializer,
    EmailOTPSerializer,
    OTPVerificationSerializer,
    ParentProfileSerializer,
    UpdateParentProfileSerializer,
    DaycareProfileSerializer,
    UpdateDaycareProfileSerializer,
)
from django.contrib.auth import authenticate
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import throttle_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .permissions import IsParent, IsDaycare
from .models import DaycareCenter, EmailOTP, Parent

class OTPRateThrottle(UserRateThrottle):
    rate = '5/hour'  # Allow 5 OTP requests per hour per IP

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([OTPRateThrottle])
def send_otp(request):
    """Send OTP to email for verification"""
    serializer = EmailOTPSerializer(data=request.data)
    if serializer.is_valid():
        try:
            otp = serializer.save()
            return Response({
                'detail': 'OTP sent successfully to your email.',
                'email': otp.email,
                'expires_in_minutes': 10
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'detail': 'Failed to send OTP. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP code"""
    serializer = OTPVerificationSerializer(data=request.data)
    if serializer.is_valid():
        return Response({
            'detail': 'OTP verified successfully.',
            'email': serializer.validated_data['email']
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def parent_register(request):
    """Register parent with OTP verification"""
    serializer = ParentRegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            return Response({
                'detail': 'Registration successful! Welcome to Daycare Connect.',
                'email': user.email,
                'user_type': user.user_type
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'detail': 'Registration failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Customize error messages
    errors = serializer.errors
    if 'email' in errors:
        errors['email'] = [
            msg.replace('user with this email already exists.', 'An account with this email already exists.')
            for msg in errors['email']
        ]
    if 'password' in errors:
        errors['password'] = [
            msg.replace('This password is too short. It must contain at least 8 characters.', 
                        'Password must be at least 8 characters long.')
            for msg in errors['password']
        ]
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class LoginThrottle(UserRateThrottle):
    rate = '3/min'  

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def parent_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, email=email, password=password)
    if user is not None:
        if not user.is_email_verified:
            return Response({
                'detail': 'Please verify your email address before logging in.',
                'email_verified': False
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'user_type': user.user_type,
                'is_email_verified': user.is_email_verified
            }
        }, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def parent_logout(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception:
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def parent_profile(request):
    """Get parent profile information"""
    try:
        parent = request.user.parent_profile
        serializer = ParentProfileSerializer(parent)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Parent.DoesNotExist:
        return Response({
            'detail': 'Parent profile not found.'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsParent])
def update_parent_profile(request):
    """Update parent profile information"""
    try:
        parent = request.user.parent_profile
        serializer = UpdateParentProfileSerializer(
            parent, 
            data=request.data, 
            partial=request.method == 'PATCH'
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Return updated profile data
            updated_serializer = ParentProfileSerializer(parent)
            return Response({
                'detail': 'Profile updated successfully.',
                'profile': updated_serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Parent.DoesNotExist:
        return Response({
            'detail': 'Parent profile not found.'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsParent])
def parent_dashboard(request):
    # Only parents can access this view
    return Response({"detail": "Welcome to the parent dashboard."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def daycare_register_request(request):
    """Register daycare with OTP verification"""
    serializer = DaycareCenterRegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            instance = serializer.save()
            return Response({
                'detail': 'Registration request submitted successfully! Please await admin verification.',
                'email': instance.user.email,
                'daycare_name': instance.name
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'detail': 'Registration failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def daycare_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)
    if user is not None and user.user_type == 'daycare':
        if not user.is_email_verified:
            return Response({
                'detail': 'Please verify your email address before logging in.',
                'email_verified': False
            }, status=status.HTTP_403_FORBIDDEN)
        
        if not user.is_verified:
            return Response({'detail': 'Your account is pending admin verification.'}, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'email': user.email,
                'user_type': user.user_type,
                'is_email_verified': user.is_email_verified,
                'is_verified': user.is_verified
            }
        }, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials or not a daycare account.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDaycare])
def daycare_dashboard(request):
    # Only accessible to authenticated, verified daycares
    return Response({"detail": "Welcome to the daycare dashboard."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDaycare])
def daycare_logout(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception:
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daycare_profile(request):
    daycare = request.user.daycare_profile
    serializer = DaycareProfileSerializer(daycare)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_daycare_profile(request):
    daycare = request.user.daycare_profile
    serializer = UpdateDaycareProfileSerializer(daycare, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Profile updated successfully."})
    return Response(serializer.errors, status=400)