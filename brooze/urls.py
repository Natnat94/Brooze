"""brooze URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.gis import admin
from django.urls import path, include
from main import views as main
from djgeojson.views import GeoJSONLayerView
from authentification.models import User

urlpatterns = [
    path('', main.index, name='home'),
    path('admin/', admin.site.urls),
    path('auth/', include('authentification.urls')),
    path('map/', include('shops.urls')),
    path('data.geojson2', GeoJSONLayerView.as_view(
        model=User,
        geometry_field='geom',
        properties=('id')), name='data2'),  # tout les utilisateur de l'appli en bleu
    # user/<int:pk>
    # user/<int:pk>/update
    # shop/all
    # shop/<int:user_id>/match
]
