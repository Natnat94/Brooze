from django.urls import path

from .views import (
    api,
    Home,
    voila,
    shops_list,
)

urlpatterns = [
    path('', Home.as_view()),  # display the map
    path('all', shops_list, name='all_shops'),  # display all the shops of the DB
    path('<int:user_id>/match/', api, name='resultat'),  # display the best match
    path('<int:pk>/<item>/', voila),  # test
]
