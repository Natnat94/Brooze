import json

from django.contrib.gis.geos import GEOSGeometry, Point
from django.core.serializers import serialize
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from authentification.models import User


def index(request):
    return render(request, "main/index.html")


@api_view()
@permission_classes([IsAuthenticated])
def user_detail(request):
    """ this function return the authenticated user's details in
    GEOJSON format"""
    user = User.objects.filter(auth_token=request.auth)
    response_data = serialize("geojson", user, fields=('username', 'first_name', 'last_name', 'image', 'friends', 'geom'))
    return HttpResponse(response_data, content_type="json")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_user_location(request):
    """ this function update the authenticated user's position in the DB
    and return the updated profile.
    The keys needed are: 'long', 'lat' """
    user = User.objects.filter(auth_token=request.auth)  # Selectionne l'utilisateur
    data = json.loads(request.body)  # charge le contenu JSON de POST
    print(data)
    pnt = Point(
        data["long"], data["lat"]
    )  # Créé un point géographique pour Django
    pnt = GEOSGeometry(pnt)
    user.update(geom=pnt, last_name="mimoun")  # mets a jour sa position
    response_data = serialize("geojson", user)
    return HttpResponse(response_data, content_type="json")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friends_list(request):
    """ this function return the friend list of the user that is
    authenticated.
    The keys needed are:  """
    user = User.objects.get(auth_token=request.auth)
    friends = user.friends.all()
    response_data = serialize("geojson", friends)
    return HttpResponse(response_data, content_type="json")
