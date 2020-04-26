from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry, fromstr

from authentification.models import User

from .models import Shops

# need refactoring !!!

def run_query(man):
    """ run the query to the DB for the 6 clostest bar from the user """
    user_location = User.objects.get(pk=man)
    return Shops.objects.annotate(
        distance=Distance('geom', user_location.location)
    ).order_by('distance')[0:6]


def do(man):
    """ return a ranked list of the 6 shops, the closer shop get the higher rank """
    query = run_query(man)
    ranked_list = []
    rank = query.count()
    for i in query:
        shop = {'id': i.id,
                'name': i.name,
                'distance': i.distance.m,
                'rank': rank}
        rank -= 1
        ranked_list.append(shop)
    return ranked_list


def jeu():
    """ sum the overall score of the shops listed and print return the shop with the higher score """
    user1 = do(1)
    user2 = do(2)
    juju = {}
    jaja = []

    for i in [*user1, *user2]:
        juju[i['id']] = 0
        jaja.append({i['id']: i['rank']})
    for i in jaja:
        for key, value in i.items():
            juju[key] = juju[key] + value
    print(juju)
    x_key = max(juju, key=juju.get)
    print(x_key)
