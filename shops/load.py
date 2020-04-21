import os
from django.contrib.gis.utils import LayerMapping
from .models import Shops


# Auto-generated `LayerMapping` dictionary for Shops model
shop_mapping = {
    'amenity': 'amenity',
    'name': 'name',
    'addrhousenumber': 'addr:housenumber',
    'addrpostcode': 'addr:postcode',
    'addrstreet': 'addr:street',
    'addrcity': 'addr:city',
    'geom': 'POINT',
}


world_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'export.geojson'),
)

def run(verbose=True):
    lm = LayerMapping(Shops, world_shp, shop_mapping, transform=False)
    lm.save(strict=False, verbose=verbose)