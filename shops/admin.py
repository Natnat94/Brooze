from django.contrib.gis import admin
from .models import Shops

class Shop(admin.OSMGeoAdmin):
    default_zoom = 16
    list_display = ('name', 'addrpostcode')
    fields = [('name', 'addrcity'), ('addrhousenumber','addrstreet', 'addrpostcode'), 'geom']
    ordering = ['name', 'addrpostcode']
    modifiable = False
admin.site.register(Shops, Shop)