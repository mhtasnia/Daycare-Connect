from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
import random
import string
from datetime import timedelta

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    USER_TYPE_CHOICES = (
        ('parent', 'Parent'),
        ('daycare', 'Daycare'),
        ('super_admin', 'Super Admin'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_verified = models.BooleanField(default=False)  # For daycares
    is_email_verified = models.BooleanField(default=False)  # For email verification
    joined_at = models.DateTimeField(default=timezone.now)  # Automatically set on creation

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

class EmailOTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=[
        ('registration', 'Registration'),
        ('login', 'Login'),
        ('password_reset', 'Password Reset'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = self.generate_otp()
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)

    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=6))

    def is_valid(self):
        now = timezone.now()
        is_not_expired = now < self.expires_at
        is_not_used = not self.is_used
        has_attempts_left = self.attempts < self.max_attempts
        
        print(f"OTP validity check: not_expired={is_not_expired}, not_used={is_not_used}, has_attempts={has_attempts_left}")
        print(f"Current time: {now}, Expires at: {self.expires_at}")
        
        return is_not_used and has_attempts_left and is_not_expired

    def verify(self, provided_otp):
        print(f"Verifying OTP: provided='{provided_otp}', stored='{self.otp_code}'")
        
        # Increment attempts first
        self.attempts += 1
        self.save()
        
        # Check if still valid after incrementing attempts
        if not self.is_valid():
            print("OTP no longer valid after incrementing attempts")
            return False
        
        # Compare OTP codes (strip whitespace and ensure string comparison)
        provided_clean = str(provided_otp).strip()
        stored_clean = str(self.otp_code).strip()
        
        print(f"Comparing: '{provided_clean}' == '{stored_clean}'")
        
        if provided_clean == stored_clean:
            self.is_used = True
            self.save()
            print("OTP verification successful!")
            return True
        
        print("OTP codes don't match")
        return False

    def __str__(self):
        return f"OTP for {self.email} - {self.purpose} - {self.otp_code}"

class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    full_name = models.CharField(max_length=100, blank=True)
    profession = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Parent"
        verbose_name_plural = "Parents"
        ordering = ['full_name']
        
    def __str__(self):
        return self.full_name

class DaycareCenter(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='daycare_profile')
    name = models.CharField(max_length=200)
    address = models.TextField()
    area = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    services = models.TextField()
    images = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    license = models.CharField(max_length=100, default='UNKNOWN')  # <-- must exist and be named 'license'
    image = models.ImageField(
        upload_to='media/daycare_docs/',
        default='media/daycare_docs/default.jpg',
        null=False,
        blank=True
    )

    def __str__(self):
        return self.name