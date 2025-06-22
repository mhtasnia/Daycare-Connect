from rest_framework import serializers
from .models import User, Parent, DaycareCenter

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
    # Add any extra fields for DaycareCenter here

    class Meta:
        model = User
        fields = ['email', 'password', 'user_type', 'is_verified']  # add more as needed
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['user_type'] = 'daycare'
        validated_data['is_verified'] = False
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        # Create DaycareCenter profile
        DaycareCenter.objects.create(user=user)
        return user