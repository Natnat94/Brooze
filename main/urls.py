from django.urls import path
from djgeojson.views import GeoJSONLayerView
from authentification.models import User

from .views import (
    user_detail,
    update_user_location,
    friends_list,
    friends_location,
    users_list
)


urlpatterns = [
    path('', user_detail),  # display the user details
    path('update/', update_user_location),  # update the user location in the DB
    path('friends_list/', friends_list),  # display the user's friends list
    path('friends_location/', friends_location),  # display the user's friends location
    path('users_list/', users_list),  # display the users list
]
