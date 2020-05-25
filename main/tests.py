import json

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from authentification.models import User


class MainViews(APITestCase):
    """ class that test the view of the 'main' app """

    def setUp(self):
        test_user1 = User.objects.create_user(
            username="rien@g.com", password="1X<ISRUkw+tuK"
        )
        test_user1.save()
        url = reverse("login")
        data = {"username": "rien@g.com", "password": "1X<ISRUkw+tuK"}
        self.client.post(url, data, format="json")

    def test_user_detailed_profil(self):
        token = Token.objects.get(user__username="rien@g.com")

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = client.get("/user/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content)

    def test_user_updated_location(self):
        token = Token.objects.get(user__username="rien@g.com")

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        data = {"long": 42, "lat": 12}
        response = client.post("/user/update/", data, format="json")

        data = json.loads(response.content)
        response_data = data["features"][0]["geometry"]["coordinates"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data, [42.0, 12.0])
