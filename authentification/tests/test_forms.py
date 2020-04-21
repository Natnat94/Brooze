from django.test import TestCase
from io import BytesIO
from ..forms import UserRegisterForm, UserUpdateForm
from authentification.models import User

class TestForms(TestCase):
    def setUp(self):
        test_user1 = User.objects.create_user(username='rien42@g.com', password='1X<ISRUkw+tuK')
        test_user1.save()

    def test_userregisterform_success(self):
        form_data = {'username': 'rien@g.com', 'password1': '1X<ISRUkw+tuK', 'password2': '1X<ISRUkw+tuK'}
        form = UserRegisterForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_userregisterform_failed(self):
        form_data = {'username': 'rien@g.com', 'password1': '1X<ISRUkw+tuK', 'password2': '1X<+tuK'}
        form = UserRegisterForm(data=form_data)
        self.assertFalse(form.is_valid())

        form_data = {'username': 'rien', 'password1': '1X<ISRUkw+tuK', 'password2': '1X<ISRUkw+tuK'}
        form = UserRegisterForm(data=form_data)
        self.assertFalse(form.is_valid())
    
    # def test_userupdateform_success(self):

    #     form_data = {'username': 'rien42@g.com', 'first_name': 'nathan', 'last_name': 'mim'}
    #     form = UserUpdateForm(data=form_data)
    #     self.assertTrue(form.is_valid())