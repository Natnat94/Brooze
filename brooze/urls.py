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
from django.contrib.auth import views as auth_views
from django.urls import path
from main import views as main
from authentification import views as auth
from shops import views
from django.conf.urls import url
from djgeojson.views import GeoJSONLayerView
from authentification.models import User

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main.index, name='home'),
    path('register/', auth.register, name='register'),
    path('login/', auth_views.LoginView.as_view(
        template_name='authentification/login.html'), name='login'),
    path('profil/', auth.profil, name='profil'),
    path('profil/password/', auth.change_password, name='change_password'),
    path('login/', auth_views.LoginView.as_view(
        template_name='authentification/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(
        template_name='authentification/logout.html'), name='logout'),
    path('test/', views.Home.as_view()),
    url(r'^data.geojson$', views.geolala, name='data'),
    url(r'^data.geojson2$', GeoJSONLayerView.as_view(
        model=User,
        geometry_field='location',
        properties=('id')), name='data2'),
]
