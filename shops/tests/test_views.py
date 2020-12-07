from django.contrib.gis.geos import GEOSGeometry
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from authentification.models import User
from shops.models import Shops


class TestViews(APITestCase):
    """ class that test the view of the 'shops' app """

    @classmethod
    def setUpTestData(cls):
        pnt = GEOSGeometry("POINT(7 24)")
        cls.test_user = User.objects.create_user(
            pk=1, username="1@g.com", password="1X<ISRUkw+tuK", geom=pnt
        )

        pnt = GEOSGeometry("POINT(10 28)")
        cls.test_user = User.objects.create_user(
            pk=2, username="2@g.com", password="1X<ISRUkw+tuK", geom=pnt
        )

        pnt = GEOSGeometry("POINT(3 26)")
        cls.test_user = User.objects.create_user(
            pk=3, username="3@g.com", password="1X<ISRUkw+tuK", geom=pnt
        )

        pnt = GEOSGeometry("POINT(4 28)")
        cls.shop = Shops.objects.create(
            name="shop 1",
            addrhousenumber="154",
            addrstreet="rue de paris",
            addrpostcode="94160",
            geom=pnt,
        )

        pnt = GEOSGeometry("POINT(5 25)")
        cls.shop = Shops.objects.create(
            name="shop 2",
            addrhousenumber="154",
            addrstreet="rue de paris",
            addrpostcode="94160",
            geom=pnt,
        )

        pnt = GEOSGeometry("POINT(9 24)")
        cls.shop = Shops.objects.create(
            name="shop 3",
            addrhousenumber="154",
            addrstreet="rue de paris",
            addrpostcode="94160",
            geom=pnt,
        )

    def test_get_match_not_login(self):
        resp = self.client.get(reverse("resultat"))

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_match(self):
        identification = self.client.post(
            reverse("login"),
            {"username": "1@g.com", "password": "1X<ISRUkw+tuK"},
            format="json",
        )
        token = identification.data['access']

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Bearer " + token)
        resp = client.get(reverse("resultat"))

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(resp.content)

    def test_get_shops_list_not_login(self):
        resp = self.client.get(reverse("all_shops"))

        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_get_shops_list(self):
        user = User.objects.get(username="1@g.com")
        client = APIClient()
        client.force_authenticate(user=user)
        resp = client.get(reverse("all_shops"))

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(resp.content)
