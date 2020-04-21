from django.contrib.gis.db import models


class Shops(models.Model):
    name = models.CharField(max_length=50)
    amenity = models.CharField(max_length=15, null=True)
    addrhousenumber = models.CharField(max_length=5)
    addrstreet = models.CharField(max_length=255)
    addrcity = models.CharField(max_length=25, null=True)
    addrpostcode = models.CharField(max_length=5)
    geom = models.PointField()