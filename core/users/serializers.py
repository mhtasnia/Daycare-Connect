from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import User, Parent, DaycareCenter

User = get_user_model()

class BaseRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            user_type='parent'  # Explicitly enforce parent role
        )
        user.set_password(validated_data['password'])
        user.save()
        # Parent profile will be created/updated later with more info
        Parent.objects.create(user=user)
        return user

class ParentRegisterSerializer(BaseRegisterSerializer):
    # No extra fields required for registration now
    pass


class DaycareCenterRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    user_type = serializers.CharField(write_only=True, default='daycare')

    class Meta:
        model = DaycareCenter
        fields = ['email', 'password', 'user_type', 'name', 'phone', 'address', 'license', 'image']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        user_type = validated_data.pop('user_type', 'daycare')
        user = User.objects.create_user(
            email=email,
            password=password,
            user_type=user_type,
            is_verified=False
        )
        daycare = DaycareCenter.objects.create(user=user, **validated_data)
        return daycare