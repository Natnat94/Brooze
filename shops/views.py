from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry, fromstr
from django.shortcuts import render
from django.views import generic

from authentification.models import User

from .models import Shops

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
