from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.gis.geos import GEOSGeometry, Point
import json
from authentification.models import User


def index(request):
    return render(request, 'main/index.html')


def user_detail(request, pk):
    if request.method == 'GET':
        user = User.objects.filter(pk=pk)
        response_data = serialize('geojson', user)
        return HttpResponse(response_data, content_type='json')
    else:
        return JsonResponse({'message': "erreur"})

@csrf_exempt
def update_user_location(request, pk):
    if request.method == 'POST':
        user = User.objects.filter(pk=pk)  # Selectionne l'utilisateur
        data = json.loads(request.body)  # charge le contenu JSON de POST
        print(data)
        pnt = Point(data['long'], data['lat'])  # Créé un point géographique pour Django
        pnt = GEOSGeometry(pnt)
        user.update(geom=pnt, last_name="mimoun")  # mets a jour sa position
        response_data = serialize('geojson', user)
        return HttpResponse(response_data, content_type='json')
    else:
        return JsonResponse({'message': "erreur"})
