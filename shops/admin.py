from django.contrib.gis import admin

from .models import Shops


class Shop(admin.OSMGeoAdmin):
    default_zoom = 16
    list_display = ("name", "addrpostcode")
    fields = [
        ("name", "addrcity"),
        ("addrhousenumber", "addrstreet", "addrpostcode"),
        "geom",
    ]
    ordering = ["name", "addrpostcode"]
    modifiable = False
    def save_model(self, request, obj, form, change):
        #Return nothing to make sure user can't update any data
        pass

admin.site.register(Shops, Shop)
