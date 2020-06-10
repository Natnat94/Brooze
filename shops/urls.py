from django.urls import path

from .views import (
    api,
    shops_list,
)

urlpatterns = [
    path(
        "all", shops_list, name="all_shops"
    ),  # display all the shops of the DB
    path("match/", api, name="resultat"),  # display the best match
]
