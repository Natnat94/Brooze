from django.contrib.gis import admin
from django.contrib.auth.models import Group


from .models import User


class rien(admin.OSMGeoAdmin):
    default_zoom = 15
    default_lat = 6250868.90147960
    default_lon = 255422.57162517
    # modifiable = False
    list_display = ("username", "is_staff", "is_confirmed")
    fields = [
        ("username", "gender"),
        ("first_name", "last_name", "phone"),
        ("geom", "friends"),
    ]


admin.site.register(User, rien)
admin.site.unregister(Group)
