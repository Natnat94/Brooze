from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry, fromstr, Point
from django.shortcuts import render
from django.views import generic
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from authentification.models import User
import json
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from .models import Shops
from .engine import Matchmaker


class Home(generic.ListView):
    context_object_name = 'shops'
    template_name = 'shops/index.html'

    def get_queryset(self):
        user_location = User.objects.get(pk=1)
        # print(GEOSGeometry(user_location.location))
        return Shops.objects.annotate(
            distance=Distance('geom', user_location.geom)
        ).order_by('distance')[0:6]

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        best_match = Matchmaker().find_shop(id=1)
        data['result'] = Shops.objects.get(pk=best_match)
        print(data['result'])
        return data

@csrf_exempt
def api(request, user_id):
    if request.method == 'POST':
        user_location = User.objects.filter(pk=1)  # Selectionne l'utilisateur
        data = json.loads(request.body)  # charge le contenu JSON de POST
        print(data)
        pnt = Point(data['long'], data['lat'])  # Créé un point géographique pour Django
        pnt = GEOSGeometry(pnt)
        user_location.update(geom=pnt, last_name="mimoun")  # mets a jour sa position

        best_match = Matchmaker().find_shop(id=1)
        best_shop = Shops.objects.filter(pk=best_match)
        response_data = serialize('geojson', best_shop)
        return HttpResponse(response_data, content_type='json')

    else:
        best_match = Matchmaker().find_shop(id=int(user_id))
        best_shop = Shops.objects.filter(pk=best_match)
        response_data = serialize('geojson', best_shop)
        return HttpResponse(response_data, content_type='json')

def shops_list(request):
    if request.method == "GET":
        data = Shops.objects.all()
        shops_list = serialize('geojson', data)
        return HttpResponse(shops_list, content_type='json')
    else:
        return JsonResponse({'message': 'erreur'})

def voila(request, pk, *args, **kwargs):
    print(args, kwargs)
    data ={
        "pk": pk
    }
    return JsonResponse(data)