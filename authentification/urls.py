from django.urls import path
from django.contrib.auth.views import (
    LoginView,
    LogoutView,
)
from .views import (
    register,
    profil,
    change_password,
)


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(
        template_name='authentification/login.html'), name='login'),
    path('profil/', profil, name='profil'),
    path('profil/password/', change_password, name='change_password'),
    path('logout/', LogoutView.as_view(
        template_name='authentification/logout.html'), name='logout'),
]
