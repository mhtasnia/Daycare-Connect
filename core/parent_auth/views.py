from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ParentRegisterSerializer
from django.contrib.auth import authenticate
from rest_framework.throttling import UserRateThrottle
from rest_framework.decorators import throttle_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView



@api_view(['POST'])
@permission_classes([AllowAny])
def parent_register(request):
    serializer = ParentRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'detail': 'Registration successful.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
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
