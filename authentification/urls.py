from django.urls import path

from .views import (
    register,
    profil,
    change_password,
    login,
    logout,
)


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('password/', change_password, name='change_password'),
    path('logout/', logout, name='logout'),
    # path('profil/', profil, name='profil'),  # a modifier !!
]
