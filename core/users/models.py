from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
import random
import string
from datetime import timedelta

# Area choices for Bangladesh
AREA_CHOICES = [
    ('gulshan', 'Gulshan'),
    ('banani', 'Banani'),
    ('uttara', 'Uttara'),
    ('mirpur', 'Mirpur'),
    ('wari', 'Wari'),
    ('dhanmondi', 'Dhanmondi'),
]

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
        
        # Compare OTP codes first (strip whitespace and ensure string comparison)
        provided_clean = str(provided_otp).strip()
        stored_clean = str(self.otp_code).strip()
        
        print(f"Comparing: '{provided_clean}' == '{stored_clean}'")
        
        # Increment attempts
        self.attempts += 1
        self.save()
        
        if provided_clean == stored_clean:
            # Mark as used only if the code matches
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
    phone = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to='parent_images/', blank=True, null=True)
    joined_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Parent"
        verbose_name_plural = "Parents"
        ordering = ['full_name']
        
    def __str__(self):
        return self.full_name or self.user.email

class Address(models.Model):
    parent = models.OneToOneField(Parent, on_delete=models.CASCADE, related_name='address')
    street_address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    area = models.CharField(max_length=20, choices=AREA_CHOICES, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='Bangladesh')
    
    def __str__(self):
        return f"{self.street_address}, {self.get_area_display()}"
    
    @property
    def full_address(self):
        parts = [self.street_address, self.get_area_display(), self.city, self.postal_code, self.country]
        return ', '.join([part for part in parts if part])

class Child(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='children')
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    special_needs = models.TextField(blank=True, help_text="Any special needs, allergies, or medical conditions")
    photo = models.ImageField(upload_to='child_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date_of_birth']
    
    def __str__(self):
        return self.full_name
    
    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

class EmergencyContact(models.Model):
    RELATIONSHIP_CHOICES = [
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('sibling', 'Sibling'),
        ('grandparent', 'Grandparent'),
        ('friend', 'Friend'),
        ('neighbor', 'Neighbor'),
        ('other', 'Other'),
    ]
    
    parent = models.OneToOneField(Parent, on_delete=models.CASCADE, related_name='emergency_contact')
    full_name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    phone_primary = models.CharField(max_length=20)
    phone_secondary = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    photo = models.ImageField(upload_to='emergency_contact_photos/', blank=True, null=True)
    is_authorized_pickup = models.BooleanField(default=False, help_text="Can this person pick up your child?")
    notes = models.TextField(blank=True, help_text="Additional notes about this contact")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.full_name} ({self.relationship})"

class DaycareCenter(models.Model):
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='daycare_profile')
    name = models.CharField(max_length=200)
    address = models.TextField()
    area = models.CharField(max_length=20, choices=AREA_CHOICES, blank=True)
    phone = models.CharField(max_length=20)
    is_verified = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    services = models.TextField()
    pricing = models.TextField(blank=True)
    featured_services = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    nid_number = models.CharField(max_length=100, default='UNKNOWN')  # changed from license
    image = models.ImageField(
        upload_to='daycare_docs/',
        default='daycare_docs/default.jpg',
        null=False,
        blank=True
    )
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.name

class DaycareImage(models.Model):
    daycare = models.ForeignKey(DaycareCenter, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='daycare_images/')