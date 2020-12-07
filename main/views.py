import json

from django.contrib.gis.geos import GEOSGeometry, Point
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from rest_framework.response import Response

from authentification.models import User


def index(request):
    return render(request, "main/index.html")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request, query=""):
    """ this function return the users list when the user is
    authenticated.
    The keys needed are:  """
    # TODO: doit renvoyer un liste vide si 'query' est 'null'

    users_to_exclude = [
        o.id for o in User.objects.get(id=request.user.id).friends.all()
    ]
    users = (
        User.objects.all()
        .filter(
            username__icontains=query
        )  # TODO: doit pouvoir chercher aussi le num de tel
        .values(
            "username", "id", "phone"
        )  # TODO: renvoie aussi l'image de l'utilisateur
        .exclude(id=request.user.id)
        .exclude(id__in=users_to_exclude)
        .order_by("username")
    )
    return JsonResponse(list(users), safe=False)


# ----------------------------------------------------------
#               interaction avec l'utilisateur
# ----------------------------------------------------------


@api_view()
@permission_classes([IsAuthenticated])
def user_detail(request):
    """ this function return the authenticated user's details in
    GEOJSON format"""
    user = User.objects.filter(id=request.user.id)
    response_data = serialize(
        "geojson",
        user,
        fields=(
            "username",
            "first_name",
            "last_name",
            "image",
            "friends",
            "geom",
        ),
    )
    return HttpResponse(response_data, content_type="json")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_user_location(request):
    """ this function update the authenticated user's position in the DB
    and return the updated profile.
    The keys needed are: 'long', 'lat' """
    user = User.objects.filter(id=request.user.id)  # Selectionne l'utilisateur
    data = json.loads(request.body)  # charge le contenu JSON de POST
    pnt = Point(
        data["long"], data["lat"]
    )  # Créé un point géographique pour Django
    pnt = GEOSGeometry(pnt)
    user.update(geom=pnt, last_name="mimoun")  # mets a jour sa position
    response_data = serialize("geojson", user)
    return HttpResponse(response_data, content_type="json")


# ----------------------------------------------------------
#               interaction avec amis
# ----------------------------------------------------------


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_friends_list(request):
    """ The POST method remove a friend from the user's list
    from the JSON sent by the request.
    The keys needed are:  """
    if request.method == "POST":
        user = User.objects.get(id=request.user.id)
        for i in request.data:
            friend = User.objects.get(id=i["id"])
            user.friends.remove(friend)
        return Response(
            {"message": "friends list updated !"}, status=HTTP_200_OK
        )
    else:
        return Response(
            {"error": "Invalid request"}, status=HTTP_404_NOT_FOUND
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def friends_list(request):
    """ The POST method update the friends list of the user
    from the JSON sent by the request.
    The GET method return the friend list of the user that is
    authenticated.
    The keys needed are:  """
    if request.method == "POST":
        user = request.user
        # user.friends.clear()
        for i in request.data:
            friend = User.objects.get(id=i["id"])
            user.friends.add(friend)
        print(user.friends.all())
        return Response(
            {"message": "friends list updated !"}, status=HTTP_200_OK
        )
    else:
        user = request.user
        friends = (
            user.friends.all().values("username", "id").order_by("username")
        )
        return JsonResponse(list(friends), safe=False)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def friends_location(request):
    """ this function return the friend location of the user that is
    authenticated.
    The keys needed are:  """
    user = request.user
    friends = user.friends.all()
    response_data = serialize("geojson", friends)
    return HttpResponse(response_data, content_type="json")
