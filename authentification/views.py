from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.gis.geos import GEOSGeometry, Point
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)

from authentification.models import User

from .forms import UserRegisterForm, UserUpdateForm

EMAIL_FROM = "misterx41@hotmail.com"


@api_view(["POST"])
@permission_classes((AllowAny,))
def register(request):
    """ This function register the user with the validated data sent
    and return a succes message with a auth token.
    the keys needed are: 'username', 'password1, 'password2'
    where 'username' is valid email format"""
    form = UserRegisterForm(request.data)
    if form.is_valid():
        position = request.data["position"]
        form.save()
        username = form.cleaned_data.get("username")
        user = User.objects.filter(username=username)
        # update the position
        pnt = Point(
            position["long"], position["lat"]
        )  # create a geopoint for Django
        pnt = GEOSGeometry(pnt)
        user.update(geom=pnt)
        user = User.objects.get(username=username)
        user.friends.clear()
        messages.success(request, f"Le compte est créé pour {username}.")
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": f"l'utilisateur est créé pour {username}",
                "token": token.key,
            },
            status=HTTP_201_CREATED,
        )
    else:
        return Response(
            form.errors.get_json_data(escape_html=False),
            status=HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    """ this function login the user into the system and return the
    user primay key, the username and the auth token.
    the keys needed are: 'username', 'password' """
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response(
            {"error": "Please provide both username and password"},
            status=HTTP_400_BAD_REQUEST,
        )
    user = authenticate(username=username, password=password)
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
    """ this function logout the logged user by removing
    the auth token attached to the user from the system and return a
    success message.
    the key needed is: 'Authorization' in the header with a value
    that is in this form: 'Token ~the token id~' """
    request.auth.delete()
    username = request.user.username
    return Response(
        {"message": f"{username} is logged out"}, status=HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def change_password(request):
    """ this function change the password of the authenticated user and
    return a success message with a new auth token.
    the keys needed are: 'old_password', 'new_password1',
    'new_password2' """
    form = PasswordChangeForm(request.user, request.data)
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
    """ The POST method update the profil of the authenticated
    user and return it.
    The key needed is: 'username'. (disabled)
    The optional keys are: 'first_name', 'last_name', 'gender', 'phone', 'image'(file !).
    The GET method return the authenticated user's profil """
    user = request.user
    if request.method == "POST":
        form = UserUpdateForm(request.data, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            data = {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "image": user.image.url,
            }
            return Response(data, status=HTTP_200_OK)
        else:
            return Response(
                form.errors.get_json_data(escape_html=False),
                status=HTTP_400_BAD_REQUEST,
            )

    else:
        friends = []
        for i in user.friends.all():
            friends.append(i.username)
        data = {
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "image": user.image.url,
            "friends": friends,
            "gender": user.gender,
            "phone": user.phone,
        }
        return Response(data, status=HTTP_200_OK)


@api_view()
@permission_classes((AllowAny,))
def confirmation_email(request, token=None):
    """ this function send a confirmation email
    to the user or confirm the user account.
    the keys needed are: '' """  # need improvement
    from django.http import HttpResponse
    from django.core.exceptions import ObjectDoesNotExist

    class AccountAlreadyConfirmed(Exception):
        pass

    if token is not None:
        try:
            user = Token.objects.get(key=token).user
            if user.is_confirmed is True:
                raise AccountAlreadyConfirmed
            user.is_confirmed = True
            user.save()
            print(user)
        except ObjectDoesNotExist:
            print("Invalid Token")
        except AccountAlreadyConfirmed:
            print("Account already confirmed")
    else:

        try:
            user = Token.objects.get(key=request.auth).user
            if user.is_confirmed is True:
                raise AccountAlreadyConfirmed

            context = {
                "username": request.user.username,
                "url": "http://127.0.0.1:8000/auth/confirm/"
                + str(request.auth)
                + "/",
            }
            html_message = render_to_string(
                "authentification/confirmation_email.html", context
            )
            plain_message = strip_tags(html_message)
            send_mail(
                "This is an account confirmation email",
                plain_message,
                EMAIL_FROM,
                [request.user.username],
                html_message=html_message,
                fail_silently=False,
            )
            print(user)

        except ObjectDoesNotExist:
            print("Invalid Token")

        except AccountAlreadyConfirmed:
            print("Account already confirmed")
    return HttpResponse(status=HTTP_200_OK)
