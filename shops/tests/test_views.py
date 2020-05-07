from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.gis.geos import GEOSGeometry, Point
from shops.models import Shops
from authentification.models import User
from shops.views import Home


class TestViews(TestCase):
    """ class that test the view of the 'authentification' app """
    @classmethod
    def setUpTestData(cls):
        pnt = GEOSGeometry('POINT(7 24)')
        cls.test_user = User.objects.create_user(pk=1,
                                                 username='1@g.com',
                                                 password='1X<ISRUkw+tuK',
                                                 location=pnt)

        pnt = GEOSGeometry('POINT(10 28)')
        cls.test_user = User.objects.create_user(pk=2,
                                                 username='2@g.com',
                                                 password='1X<ISRUkw+tuK',
                                                 location=pnt)

        pnt = GEOSGeometry('POINT(3 26)')
        cls.test_user = User.objects.create_user(pk=3,
                                                 username='3@g.com',
                                                 password='1X<ISRUkw+tuK',
                                                 location=pnt)

        pnt = GEOSGeometry('POINT(4 28)')
        cls.shop = Shops.objects.create(
            name='shop 1', addrhousenumber='154',
            addrstreet='rue de paris', addrpostcode='94160', geom=pnt)

        pnt = GEOSGeometry('POINT(5 25)')
        cls.shop = Shops.objects.create(
            name='shop 2', addrhousenumber='154',
            addrstreet='rue de paris', addrpostcode='94160', geom=pnt)

        pnt = GEOSGeometry('POINT(9 24)')
        cls.shop = Shops.objects.create(
            name='shop 3', addrhousenumber='154',
            addrstreet='rue de paris', addrpostcode='94160', geom=pnt)

    def test_get_queryset_charge_view(self):
        resp = self.client.get('/test/')
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, 'shops/index.html')

    def test_get_queryset_content(self):
        resp = self.client.get(reverse('data'))
        print(resp.content.decode())
        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp.content)
