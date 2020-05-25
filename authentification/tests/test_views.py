from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token

from authentification.models import User


class TestViews(APITestCase):
    """ class that test the view of the 'authentification' app """

    def setUp(self):
        test_user1 = User.objects.create_user(
            username="rien@g.com", password="1X<ISRUkw+tuK"
        )
        test_user1.save()

    def test_login_view_success(self):
        url = reverse("login")
        data = {"username": "rien@g.com", "password": "1X<ISRUkw+tuK"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.data["token"])

    def test_login_view_bad_password(self):
        url = reverse("login")
        data = {"username": "rien@g.com", "password": "1X<ISRUkw+tK"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "Invalid Credentials")

    def test_register_view_success(self):
        url = reverse("register")
        data = {
            "username": "rie47n@g.com",
            "password1": "1X<ISRUkw+tuK",
            "password2": "1X<ISRUkw+tuK",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data["token"])

    def test_change_password_failed(self):
        user = User.objects.get(username="rien@g.com")
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse("change_password")
        data = {
            "old_password": "1X<ISRUkw+tuK",
            "new_password1": "1X<ISRUkw+tK",
            "new_password2": "1X<ISRUk+K",
        }
        response = client.post(url, data, format="json")
        msg = response.data["new_password2"][0]["code"]

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(msg, "password_mismatch")

    def test_change_password_success(self):
        client = APIClient()
        url = reverse("login")
        data = {"username": "rien@g.com", "password": "1X<ISRUkw+tuK"}
        client.post(url, data, format="json")
        old_token = Token.objects.get(user__username="rien@g.com")
        client.credentials(HTTP_AUTHORIZATION="Token " + old_token.key)

        url = reverse("change_password")
        data = {
            "old_password": "1X<ISRUkw+tuK",
            "new_password1": "1X<ISRUkw+tK",
            "new_password2": "1X<ISRUkw+tK",
        }
        resp = client.post(url, data, format="json")
        new_token = Token.objects.get(user__username="rien@g.com")

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(
            resp.data["message"], "le mot de passe a était mis à jour"
        )
        self.assertNotEqual(old_token, new_token)
