from django.contrib.gis.db import models


class Shops(models.Model):
    name = models.CharField(max_length=50, blank=True)
    amenity = models.CharField(max_length=15, blank=True)
    addrhousenumber = models.CharField(max_length=5, blank=True)
    addrstreet = models.CharField(max_length=255, blank=True)
    addrcity = models.CharField(max_length=25, blank=True)
    addrpostcode = models.CharField(max_length=5, blank=True)
    geom = models.PointField()