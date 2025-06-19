from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Parent

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
