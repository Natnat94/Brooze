from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from .forms import UserRegisterForm, UserUpdateForm
from django.contrib.auth.decorators import login_required


# Create your views here.
def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Le compte est créé pour {username}.')
            return redirect('home')
    else:
        form = UserRegisterForm()
    return render(request, 'authentification/register.html', {'form': form})


@login_required(login_url='login')
def profil(request):
    user = request.user
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, request.FILES, instance=user)
        if u_form.is_valid():
            u_form.save()
    else:
        u_form = UserUpdateForm(initial={
                            'username': user.username,
                            'first_name': user.first_name,
                            'last_name': user.last_name
                            })
    return render(request, 'authentification/profil.html', {'user': user, 'title': 'Mon profil', 'form': u_form})

@login_required(login_url='login')
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Le nouveau mot de passe est enregistré')
        else:
            messages.error(request, "Veuillez corriger l'erreur.")
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'authentification/password.html', {'user': request.user, 'title': 'Mon profil', 'form': form})