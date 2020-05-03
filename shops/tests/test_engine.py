from django.test import TestCase
from django.contrib.gis.geos import GEOSGeometry

from shops.models import Shops
from authentification.models import User
from shops.engine import match_maker


class TestViews(TestCase):
    """ class that test the view of the 'authentification' app """
    @classmethod
    def setUpTestData(cls):
        pnt = GEOSGeometry('POINT(7 24)')
        cls.test_user = User.objects.create_user(
            username='1@g.com', password='1X<ISRUkw+tuK', location=pnt)

        pnt = GEOSGeometry('POINT(10 28)')
        cls.test_user = User.objects.create_user(
            username='2@g.com', password='1X<ISRUkw+tuK', location=pnt)

        pnt = GEOSGeometry('POINT(3 26)')
        cls.test_user = User.objects.create_user(
            username='3@g.com', password='1X<ISRUkw+tuK', location=pnt)

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

    def test_run_query_user_1(self):
        """ test that the query return an ordered list of shops
        from the closest to the more far away """
        query = match_maker.run_query(1)

        self.assertEqual(query[0].name, 'shop 3')
        self.assertEqual(query[1].name, 'shop 2')

    def test_run_query_user_2(self):
        """ same as the previous test, is used for validate the
        user number 2 position for the sake of 'find_shop' method
        test """
        query = match_maker.run_query(2)

        self.assertEqual(query[0].name, 'shop 3')
        self.assertEqual(query[1].name, 'shop 1')

    def test_run_query_user_3(self):
        """ same as the previous test, is used for validate the
        user number 3 position for the sake of the 'find_shop' method
        test """
        query = match_maker.run_query(3)

        self.assertEqual(query[0].name, 'shop 2')
        self.assertEqual(query[1].name, 'shop 1')

    def test_ranked_list(self):
        """ test that the method return a correct ranked list
        of shops according to the distance from the user """
        query = match_maker.ranked_list(1)
        self.assertEqual(query[0]['rank'], 3)
        self.assertEqual(query[1]['rank'], 2)
        self.assertEqual(query[2]['rank'], 1)

    def test_find_shop(self):
        """ test the logic of the method with 3 users by asserting
        that a specific shop is the best match regarding all 3 users
        position relative to all shops """
        query = match_maker.find_shop()

        self.assertEqual(query, 3)
