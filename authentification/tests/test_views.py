from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

from authentification.models import User


class TestViews(APITestCase):
    """ class that test the view of the 'authentification' app """

    def setUp(self):
        test_user1 = User.objects.create_user(username='rien@g.com', password='1X<ISRUkw+tuK')
        test_user1.save()

    def test_login_view_success(self):
        url = reverse('login')
        data = {'username': 'rien@g.com',
                'password': '1X<ISRUkw+tuK'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data['token'])

    def test_login_view_bad_password(self):
        url = reverse('login')
        data = {'username': 'rien@g.com',
                'password': '1X<ISRUkw+tK'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Invalid Credentials")

    # def test_register_view_success(self):
    #     url = reverse('register')
    #     data = {'username': 'rie47n@g.com',
    #             'password1': '1X<ISRUkw+tuK',
    #             'password2': '1X<ISRUkw+tuK'}
    #     response = self.client.post(url, data, format='multipart')

    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertIsNotNone(response.data['token'])

    # def test_change_password(self):
    #     pass

    # def test_logout(self):
    #     url = reverse('change_password')

