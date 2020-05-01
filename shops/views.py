from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry, fromstr
from django.shortcuts import render
from django.views import generic
from django.core.serializers import serialize
from django.http import HttpResponse
from authentification.models import User

from .models import Shops
from .engine import Matchmaker

# Create your views here.


class Home(generic.ListView):
    context_object_name = 'shops'
    template_name = 'shops/index.html'

    def get_queryset(self):
        user_location = User.objects.get(pk=1)
        print(GEOSGeometry(user_location.location))
        return Shops.objects.annotate(
            distance=Distance('geom', user_location.location)
        ).order_by('distance')[0:6]

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        best_match = Matchmaker().find_shop()
        data['result'] = Shops.objects.get(pk=best_match)
        return data


def geolala(request):  # need to change the name of the method !!!
    user_location = User.objects.get(pk=1)
    data = Shops.objects.annotate(
        distance=Distance('geom', user_location.location)
    ).order_by('distance')[0:6]
    rien = serialize('geojson', data)
    return HttpResponse(rien, content_type='json')