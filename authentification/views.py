from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from .forms import UserRegisterForm, UserUpdateForm
from django.contrib.auth.decorators import login_required


from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
)
from rest_framework.response import Response
from authentification.models import User


@api_view(["POST"])
@permission_classes((AllowAny,))
def register(request):
    form = UserRegisterForm(request.POST)
    if form.is_valid():
        form.save()
        username = form.cleaned_data.get("username")
        user = User.objects.get(username=username)
        messages.success(request, f"Le compte est créé pour {username}.")
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": f"l'utilisateur est créé pour {username}",
                "token": token.key,
            },
            status=HTTP_200_OK,
        )
    else:
        return Response(
            form.errors.get_json_data(escape_html=False),
            status=HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response(
            {"error": "Please provide both username and password"},
            status=HTTP_400_BAD_REQUEST,
        )
    user = authenticate(username=username, password=password)
    print(user)
    if not user:
        return Response(
            {"error": "Invalid Credentials"}, status=HTTP_404_NOT_FOUND
        )
    token, _ = Token.objects.get_or_create(user=user)
    user = User.objects.get(username=username)
    return Response(
        {"user_id": user.pk, "username": username, "token": token.key},
        status=HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def logout(request):
    request.auth.delete()
    username = request.user.username
    return Response({"message": f"{username} is logged out"})


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def change_password(request):
    form = PasswordChangeForm(request.user, request.POST)
    if form.is_valid():
        user = form.save()
        request.auth.delete()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "le mot de passe a était mis à jour",
                "token": token.key,
            },
            status=HTTP_200_OK,
        )
    else:
        return Response(
            form.errors.get_json_data(escape_html=False),
            status=HTTP_400_BAD_REQUEST,
        )


@api_view(["POST", "GET"])
@permission_classes((IsAuthenticated,))
def profil(request):
    user = request.user
    if request.method == "POST":
        form = UserUpdateForm(request.POST, request.FILES, instance=user)
        print(form)
        if form.is_valid():
            form.save()
            return Response({"message": "ok"}, status=HTTP_200_OK,)
        else:
            return Response(
                form.errors.get_json_data(escape_html=False),
                status=HTTP_400_BAD_REQUEST,
            )

    else:
        u_form = UserUpdateForm(
            initial={
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        )
        return Response({"message": "erreur"}, status=HTTP_200_OK,)
