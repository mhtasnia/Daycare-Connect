from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

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
    joined_at = models.DateTimeField(default=timezone.now)  # Automatically set on creation

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()


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

