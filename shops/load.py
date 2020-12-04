import os
from django.contrib.gis.utils import LayerMapping

import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brooze.settings')

django.setup()
from .models import Shops

# Auto-generated `LayerMapping` dictionary for Shops model
shop_mapping = {
    "node_id": "id",
    "amenity": "amenity",
    "name": "name",
    "addrhousenumber": "addr:housenumber",
    "addrpostcode": "addr:postcode",
    "addrstreet": "addr:street",
    "addrcity": "addr:city",
    "geom": "POINT",
}


# world_shp = os.path.abspath(
#     os.path.join(os.path.dirname(__file__), "data", "export.geojson"),
# )

world_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "data", "test.geojson"),
)


def run(verbose=True):
    lm = LayerMapping(Shops, world_shp, shop_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
