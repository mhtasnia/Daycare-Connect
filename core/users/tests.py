# users/tests/test_authentication.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from users.models import EmailOTP, Parent
from unittest.mock import patch
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class ParentRegistrationTests(APITestCase):

    def setUp(self):
        # Set up a base URL for clarity
        self.send_otp_url = reverse('send-otp')
        self.verify_otp_url = reverse('verify-otp')
        self.parent_register_url = reverse('parent-register')

        # Dummy data for a new parent registration
        self.parent_data = {
            'email': 'newparent@example.com',
            'password': 'StrongPassword123!',
            'otp_code': '123456' # This will be set by the mock or actual OTP
        }

    @patch('users.email_service.EmailService.send_otp_email')
    def _send_and_verify_otp(self, email, mock_send_email, purpose='registration'):
        """Helper to send and verify OTP for registration flow."""
        # 1. Send OTP request
        send_otp_response = self.client.post(self.send_otp_url, {'email': email, 'purpose': purpose}, format='json')
        self.assertEqual(send_otp_response.status_code, status.HTTP_200_OK)
        mock_send_email.assert_called_once_with(email, EmailOTP.objects.filter(email=email, purpose=purpose).latest('created_at').otp_code, purpose)
        mock_send_email.reset_mock() # Reset mock for the next call assertion

        # Get the OTP created in the database
        otp_instance = EmailOTP.objects.filter(email=email, purpose=purpose).latest('created_at')
        actual_otp_code = otp_instance.otp_code

        # 2. Verify OTP
        verify_otp_response = self.client.post(self.verify_otp_url, {
            'email': email,
            'otp_code': actual_otp_code,
            'purpose': purpose
        }, format='json')
        self.assertEqual(verify_otp_response.status_code, status.HTTP_200_OK)
        self.assertTrue(EmailOTP.objects.get(id=otp_instance.id).is_used) # Ensure OTP is marked as used
        return actual_otp_code

    @patch('users.email_service.EmailService.send_otp_email')
    @patch('users.email_service.EmailService.send_welcome_email')
    def test_parent_registration_success(self, mock_send_welcome_email, mock_send_otp_email):
        """
        Test successful parent registration flow: send OTP -> verify OTP -> register.
        """
        email = self.parent_data['email']
        password = self.parent_data['password']

        # Step 1 & 2: Send and Verify OTP using helper
        otp_code = self._send_and_verify_otp(email, mock_send_otp_email)
        self.parent_data['otp_code'] = otp_code # Use the actual OTP code

        # Step 3: Register parent
        response = self.client.post(self.parent_register_url, self.parent_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Registration successful! Welcome to Daycare Connect.')
        self.assertEqual(response.data['email'], email)
        self.assertEqual(response.data['user_type'], 'parent')

        # Verify user and parent profile creation in DB
        user = User.objects.get(email=email)
        self.assertIsNotNone(user)
        self.assertTrue(user.is_email_verified)
        self.assertEqual(user.user_type, 'parent')
        self.assertIsNotNone(user.parent_profile)

        # Ensure welcome email was sent
        mock_send_welcome_email.assert_called_once_with(email, 'parent')

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_without_otp_verification(self, mock_send_otp_email):
        """
        Test registration fails if OTP is sent but not verified (is_used=False).
        """
        email = 'unverified@example.com'
        password = 'TestPassword123!'

        # Send OTP but DON'T verify it
        send_otp_response = self.client.post(self.send_otp_url, {'email': email, 'purpose': 'registration'}, format='json')
        self.assertEqual(send_otp_response.status_code, status.HTTP_200_OK)
        
        # Get the OTP code
        otp_instance = EmailOTP.objects.filter(email=email, purpose='registration').latest('created_at')
        unverified_otp_code = otp_instance.otp_code

        register_data = {
            'email': email,
            'password': password,
            'otp_code': unverified_otp_code
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('otp_code', response.data)
        self.assertEqual(response.data['otp_code'][0], 'No valid OTP found for this email.')
        
        # Ensure user is not created
        self.assertFalse(User.objects.filter(email=email).exists())

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_with_incorrect_otp(self, mock_send_otp_email):
        """
        Test registration fails with an incorrect OTP code, even if sent.
        """
        email = 'wrongotp@example.com'
        password = 'TestPassword123!'

        # Send OTP
        send_otp_response = self.client.post(self.send_otp_url, {'email': email, 'purpose': 'registration'}, format='json')
        self.assertEqual(send_otp_response.status_code, status.HTTP_200_OK)
        
        # Try to register with an incorrect OTP
        register_data = {
            'email': email,
            'password': password,
            'otp_code': '999999' # Incorrect OTP
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('otp_code', response.data)
        # Check for dynamic error message due to attempts
        self.assertRegex(response.data['otp_code'][0], r'Invalid OTP\. \d attempts remaining\.')
        
        self.assertFalse(User.objects.filter(email=email).exists())
        # Ensure OTP attempts are incremented
        otp_instance = EmailOTP.objects.filter(email=email, purpose='registration').latest('created_at')
        self.assertEqual(otp_instance.attempts, 1)

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_with_expired_otp(self, mock_send_otp_email):
        """
        Test registration fails if the OTP has expired.
        """
        email = 'expiredotp@example.com'
        password = 'TestPassword123!'

        # Send OTP
        send_otp_response = self.client.post(self.send_otp_url, {'email': email, 'purpose': 'registration'}, format='json')
        self.assertEqual(send_otp_response.status_code, status.HTTP_200_OK)
        
        # Get the OTP and manually expire it
        otp_instance = EmailOTP.objects.filter(email=email, purpose='registration').latest('created_at')
        otp_instance.expires_at = timezone.now() - timedelta(minutes=1) # Set to past
        otp_instance.save()
        
        register_data = {
            'email': email,
            'password': password,
            'otp_code': otp_instance.otp_code
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('otp_code', response.data)
        self.assertEqual(response.data['otp_code'][0], 'OTP has expired. Please request a new code.')
        self.assertFalse(User.objects.filter(email=email).exists())

    def test_parent_registration_missing_fields(self):
        """
        Test registration fails with missing required fields.
        """
        response = self.client.post(self.parent_register_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertIn('password', response.data)
        self.assertIn('otp_code', response.data)

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_existing_email(self, mock_send_otp_email):
        """
        Test registration fails if email already exists in the system.
        """
        existing_email = 'existingparent@example.com'
        User.objects.create_user(email=existing_email, password='OldPassword123!', user_type='parent')

        # Send and Verify OTP for the existing email (this should still work for OTP)
        otp_code = self._send_and_verify_otp(existing_email, mock_send_otp_email)
        
        register_data = {
            'email': existing_email,
            'password': 'NewPassword123!',
            'otp_code': otp_code
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(response.data['email'][0], 'An account with this email already exists.')

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_password_too_short(self, mock_send_otp_email):
        """
        Test registration fails if password is too short.
        """
        email = 'shortpass@example.com'
        password = 'short' # Less than 8 characters

        # Send and Verify OTP
        otp_code = self._send_and_verify_otp(email, mock_send_otp_email)
        
        register_data = {
            'email': email,
            'password': password,
            'otp_code': otp_code
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertEqual(response.data['password'][0], 'Password must be at least 8 characters long.')
        self.assertFalse(User.objects.filter(email=email).exists())

    @patch('users.email_service.EmailService.send_otp_email')
    def test_parent_registration_with_used_otp(self, mock_send_otp_email):
        """
        Test registration fails if the OTP has already been used.
        """
        email = 'usedotp@example.com'
        password = 'TestPassword123!'

        # Send and Verify OTP (this marks it as used)
        otp_code = self._send_and_verify_otp(email, mock_send_otp_email)
        
        # Manually mark OTP as used again (or simulate a double-use scenario)
        otp_instance = EmailOTP.objects.filter(email=email, purpose='registration').latest('created_at')
        otp_instance.is_used = True
        otp_instance.save()
        
        register_data = {
            'email': email,
            'password': password,
            'otp_code': otp_code
        }
        response = self.client.post(self.parent_register_url, register_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('otp_code', response.data)
        self.assertEqual(response.data['otp_code'][0], 'No valid OTP found for this email.')
        self.assertFalse(User.objects.filter(email=email).exists())