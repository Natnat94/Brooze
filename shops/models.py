from django.contrib.gis.db import models


class Shops(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    amenity = models.CharField(max_length=15, blank=True, null=True)
    addrhousenumber = models.CharField(max_length=5, blank=True, null=True)
    addrstreet = models.CharField(max_length=255, blank=True, null=True)
    addrcity = models.CharField(max_length=25, blank=True, null=True)
    addrpostcode = models.CharField(max_length=5, blank=True, null=True)
    geom = models.PointField()
