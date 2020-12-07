import json

from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from authentification.models import User


class MainViews(APITestCase):
    """ class that test the view of the 'main' app """
    init_token = None
    
    @classmethod
    def setUpTestData(cls):
        cls.test_user = User.objects.create_user(
            username="rien@g.com", password="1X<ISRUkw+tuK"
        )
        User.objects.create_user(
            pk=2, username="3@g.com", password="1X<ISRUkw+tuK"
        )
        User.objects.create_user(
            pk=3, username="2@g.com", password="1X<ISRUkw+tuK"
        )

    def setUp(self):
        url = reverse("login")
        data = {"username": "rien@g.com", "password": "1X<ISRUkw+tuK"}

        resp = self.client.post(url, data, format="json")
        self.init_token = resp.data['access'] 


    def test_user_detailed_profil(self):
        # token = Token.objects.get(user__username=MainViews.test_user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + self.init_token)
        response = client.get("/user/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content)

    def test_user_updated_location(self):
        # token = Token.objects.get(user__username=MainViews.test_user)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + self.init_token)
        data = {"long": 42, "lat": 12}
        response = client.post("/user/update/", data, format="json")

        data = json.loads(response.content)
        response_data = data["features"][0]["geometry"]["coordinates"]

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data, [42.0, 12.0])

    def test_user_updated_friends(self):
        # token = Token.objects.get(user__username="rien@g.com")

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + self.init_token)
        rsp_old = client.get("/user/friends_list/")

        data = [{"id": 2}, {"id": 3}]
        response = client.post("/user/friends_list/", data, format="json")
        rsp_new = client.get("/user/friends_list/")
        data = json.loads(rsp_new.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(rsp_old.content, rsp_new.content)
        self.assertIs(len(data), 2)

    def test_users_list(self):
        # token = Token.objects.get(user__username="rien@g.com")

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + self.init_token)

        response = client.get("/user/users_list/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content)

    def test_users_friends_location(self):
        # token = Token.objects.get(user__username="rien@g.com")

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + self.init_token)

        response = client.get("/user/friends_location/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content)
