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
def user_detail(request, pk):
    user = User.objects.filter(pk=pk)
    response_data = serialize("geojson", user, fields=('username', 'first_name', 'last_name', 'image', 'friends'))
    return HttpResponse(response_data, content_type="json")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_user_location(request, pk):
    user = User.objects.filter(pk=pk)  # Selectionne l'utilisateur
    data = json.loads(request.body)  # charge le contenu JSON de POST
    # print(data)
    pnt = Point(
        data["long"], data["lat"]
    )  # Créé un point géographique pour Django
    pnt = GEOSGeometry(pnt)
    user.update(geom=pnt, last_name="mimoun")  # mets a jour sa position
    response_data = serialize("geojson", user)
    return HttpResponse(response_data, content_type="json")
