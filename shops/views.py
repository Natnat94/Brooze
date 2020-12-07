from django.core.serializers import serialize
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)

from authentification.models import User
from .engine import Matchmaker

from .models import Shops


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api(request):
    """ This function return the best match of the closest shop
    according to the authenticated user's and user's friends
    position.
    The keys needed are: '' """
    user = request.user
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
