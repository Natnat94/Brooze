from django.urls import path

from .views import (
    api,
    Home,
    voila,
)

urlpatterns = [
    path('', Home.as_view()),
    path('all', api, name='all_shops'),  # 6 bar en jaune proche de l'utilisateur
    path('<int:pk>/<item>/', voila),  # test
]
