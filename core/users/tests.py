from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from users.models import User, EmailOTP, DaycareCenter # Make sure 'User' is imported from 'users.models' if that's your custom user model
from django.utils import timezone
from datetime import timedelta
import random
import string

class AuthTests(APITestCase):

    # Helper to generate a consistent OTP for tests
    def _generate_test_otp(self):
        return ''.join(random.choices(string.digits, k=6))

    def test_send_otp_success(self):
        url = reverse('send-otp')
        response = self.client.post(url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.data)
        self.assertTrue(EmailOTP.objects.filter(email='test@example.com').exists())

    def test_send_otp_invalid_email(self):
        url = reverse('send-otp')
        response = self.client.post(url, {'email': 'notanemail'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data) # Check for email specific error

    def test_verify_otp_success(self):
        test_email = 'verify@example.com'
        # Let the model generate the OTP by not providing otp_code during creation
        # The save method in EmailOTP model will generate and assign it.
        otp_obj = EmailOTP.objects.create(
            email=test_email,
            purpose='registration', # Important: OTPs have a purpose
            created_at=timezone.now(),
            expires_at=timezone.now() + timedelta(minutes=10),
            is_used=False # Ensure it's not used initially
        )
        # Now use the actual generated OTP code from the object for the POST request
        url = reverse('verify-otp')
        response = self.client.post(url, {
            'email': test_email,
            'otp_code': otp_obj.otp_code, # Use the dynamically generated OTP
            'purpose': 'registration'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], test_email)
        # After successful verification, the OTP should be marked as used by the view
        otp_obj.refresh_from_db()
        self.assertTrue(otp_obj.is_used)

    def test_verify_otp_invalid(self):
        # We don't need to create a valid OTP for this test, as it's testing invalid input
        url = reverse('verify-otp')
        response = self.client.post(url, {'email': 'invalid@example.com', 'otp_code': '999999', 'purpose': 'registration'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # You might want to check for specific error messages here too, e.g., 'otp_code' not found

    def test_parent_register_success(self):
        test_email = 'parent@example.com'
        test_otp_code = self._generate_test_otp() # Generate a specific OTP for this test

        # Create an EmailOTP that is 'ready' for verification by the register endpoint
        # It should NOT be marked as used/verified yet by the test setup.
        # The register endpoint's logic should handle the verification and mark it used.
        EmailOTP.objects.create(
            email=test_email,
            otp_code=test_otp_code,
            purpose='registration',
            is_used=False, # Must be false initially for the registration view to verify it
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        url = reverse('parent-register')
        data = {
            'email': test_email,
            'password': 'securePass123',
            'confirm_password': 'securePass123',
            'full_name': 'Parent Tester',
            'otp_code': test_otp_code # Use the generated OTP
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=test_email).exists())
        # Optionally, check that the OTP used for registration is now marked as used
        otp_obj = EmailOTP.objects.get(email=test_email, purpose='registration')
        self.assertTrue(otp_obj.is_used)


    def test_parent_register_duplicate_email(self):
        # Create a user with a specific email
        User.objects.create_user(email='parent2@example.com', password='pass12345', user_type='parent')

        # Create an OTP for the duplicate email attempt
        EmailOTP.objects.create(
            email='parent2@example.com',
            otp_code=self._generate_test_otp(),
            purpose='registration',
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        url = reverse('parent-register')
        data = {
            'email': 'parent2@example.com',
            'password': 'securePass123',
            'confirm_password': 'securePass123',
            'full_name': 'Parent Tester',
            'otp_code': '000000' # OTP doesn't matter much for duplicate email test, but still needed
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data) # Assert that the 'email' field has an error

    def test_daycare_register_success(self):
        test_email = 'daycare@example.com'
        test_otp_code = self._generate_test_otp() # Generate a specific OTP for this test

        # Create an EmailOTP for the daycare registration
        EmailOTP.objects.create(
            email=test_email,
            otp_code=test_otp_code,
            purpose='registration',
            is_used=False, # Must be false initially
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        url = reverse('daycare-register')
        data = {
            'email': test_email,
            'password': 'daycarePass123',
            'confirm_password': 'daycarePass123',
            'name': 'Happy Kids Daycare',
            'license_number': 'ABC-123456',
            'phone': '01700000000', # Corrected from 'phone_number' to 'phone'
            'address': 'Dhaka',
            'otp_code': test_otp_code # Use the generated OTP
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(DaycareCenter.objects.filter(name='Happy Kids Daycare').exists())
        # Optionally, check that the OTP used for registration is now marked as used
        otp_obj = EmailOTP.objects.get(email=test_email, purpose='registration')
        self.assertTrue(otp_obj.is_used)