from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry, fromstr, Point
from django.shortcuts import render
from django.views import generic
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from authentification.models import User
import json
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from .models import Shops
from .engine import Matchmaker
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


class Home(generic.ListView):
    context_object_name = "shops"
    template_name = "shops/index.html"

    def get_queryset(self):
        user_location = User.objects.get(pk=1)
        # print(GEOSGeometry(user_location.location))
        return Shops.objects.annotate(
            distance=Distance("geom", user_location.geom)
        ).order_by("distance")[0:6]

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        best_match = Matchmaker().find_shop(id=1)
        data["result"] = Shops.objects.get(pk=best_match)
        print(data["result"])
        return data


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api(request):
    """ This function return the best match of the closest shop according to the authenticated user's and
    user's friends position.
    The keys needed are: '' """
    user = User.objects.get(auth_token=request.auth)
    best_match = Matchmaker().find_shop(id=user.id)
    best_shop = Shops.objects.filter(pk=best_match)
    response_data = serialize("geojson", best_shop)
    return HttpResponse(response_data, content_type="json")


@api_view()
@permission_classes([IsAuthenticatedOrReadOnly])
def shops_list(request):
    """ this method return the list and of all the shops registered
    in the DB.
    the user need to be authenticated in order to use this method """
    data = Shops.objects.all()
    shops_list = serialize("geojson", data)
    return HttpResponse(shops_list, content_type="json")
