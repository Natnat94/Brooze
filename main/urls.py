from django.urls import path
from djgeojson.views import GeoJSONLayerView
from authentification.models import User

from .views import (
    user_detail,
    update_user_location,
)


urlpatterns = [
    path('', user_detail),  # display the user details
    path('update/', update_user_location),  # update the user location in the DB
    path('friends_list/', GeoJSONLayerView.as_view(
        model=User,
        geometry_field='geom',
        properties=('id', 'username',)),
        name='data2'),  # tout les utilisateur de l'appli en bleu
]
