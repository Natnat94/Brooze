from django.test import TestCase, Client
from authentification.models import User


class TestViews(TestCase):
    """ class that test the view of the 'authentification' app """

    def setUp(self):
        test_user1 = User.objects.create_user(username='rien@g.com', password='1X<ISRUkw+tuK')
        test_user1.save()

    def test_profil_view_logged(self):
        self.client.login(username='rien@g.com', password='1X<ISRUkw+tuK')
        resp = self.client.get('/profil/')

        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, 'authentification/profil.html')
    
    def test_profil_view_not_logged(self):
        resp = self.client.get('/profil/')

        self.assertEqual(resp.status_code, 302)
    
    def test_register(self):
        c = Client()
        response = c.post('/register/', {'username': 'rie47n@g.com', 'password1': '1X<ISRUkw+tuK', 'password2': '1X<ISRUkw+tuK'}, follow=True)
        user_login = self.client.login(username='rie47n@g.com', password='1X<ISRUkw+tuK')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(user_login)
    
    def test_profil(self):
        pass

    def test_change_password(self):
        pass