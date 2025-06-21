from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Parent, DaycareCenter

class ParentAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('parent-register')
        self.login_url = reverse('parent-login')
        self.logout_url = reverse('parent-logout')
        self.email = 'parent1@example.com'
        self.password = 'testpassword123'

    def test_parent_registration(self):
        data = {
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.email).exists())
        self.assertTrue(Parent.objects.filter(user__email=self.email).exists())

    def test_parent_login(self):
        # Register first
        User.objects.create_user(email=self.email, password=self.password, user_type='parent')
        data = {
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_parent_login_invalid(self):
        data = {
            'email': self.email,
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_parent_logout(self):
        # Register and login first
        user = User.objects.create_user(email=self.email, password=self.password, user_type='parent')
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        data = {'refresh': str(refresh)}
        response = self.client.post(self.logout_url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_205_RESET_CONTENT, status.HTTP_200_OK])


class DaycareAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('daycare-register')
        self.login_url = reverse('daycare-login')
        self.logout_url = reverse('daycare-logout')
        self.daycare_data = {
            "name": "Test Daycare",
            "email": "daycare@example.com",
            "address": "123 Main St",
            "area": "Downtown",
            "phone": "1234567890",
            "services": "Childcare, Preschool",
            "images": [],
            "password": "securepassword123",
            "user_type": "daycare"
        }

    def test_daycare_registration(self):
        response = self.client.post(self.register_url, self.daycare_data, format='json')
        print("Registration response:", response.data)  # Add this line for debugging
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        # Check User and DaycareCenter creation
        self.assertTrue(User.objects.filter(email=self.daycare_data["email"], user_type="daycare").exists())
        user = User.objects.get(email=self.daycare_data["email"])
        self.assertTrue(DaycareCenter.objects.filter(user=user).exists())

    def test_daycare_login_unverified(self):
        # Register daycare (unverified by default)
        self.client.post(self.register_url, self.daycare_data, format='json')
        response = self.client.post(self.login_url, {
            "email": self.daycare_data["email"],
            "password": self.daycare_data["password"]
        }, format='json')
        # Accept either 401 or 403 depending on your backend logic
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertTrue(
            "pending admin verification" in response.data.get('detail', '').lower() or
            "not verified" in response.data.get('detail', '').lower() or
            "invalid credentials" in response.data.get('detail', '').lower()
        )

    def test_daycare_login_verified(self):
        # Register and verify daycare
        reg_response = self.client.post(self.register_url, self.daycare_data, format='json')
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED, msg=reg_response.data)
        user = User.objects.get(email=self.daycare_data["email"])
        user.is_verified = True
        user.save()
        response = self.client.post(self.login_url, {
            "email": self.daycare_data["email"],
            "password": self.daycare_data["password"]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.access_token = response.data["access"]
        self.refresh_token = response.data["refresh"]

    def test_daycare_logout(self):
        # Register, verify, and login
        reg_response = self.client.post(self.register_url, self.daycare_data, format='json')
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED, msg=reg_response.data)
        user = User.objects.get(email=self.daycare_data["email"])
        user.is_verified = True
        user.save()
        login_response = self.client.post(self.login_url, {
            "email": self.daycare_data["email"],
            "password": self.daycare_data["password"]
        }, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK, msg=login_response.data)
        access_token = login_response.data["access"]
        refresh_token = login_response.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.post(self.logout_url, {"refresh": refresh_token}, format='json')
        self.assertIn(response.status_code, [status.HTTP_205_RESET_CONTENT, status.HTTP_200_OK])
        self.assertIn("logout successful", response.data["detail"].lower())