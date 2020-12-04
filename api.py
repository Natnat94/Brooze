####################################################################################
#                                                                                  #
#                                   Overpass API                                   #
#                                                                                  #
####################################################################################
# https://wiki.openstreetmap.org/wiki/Overpass_API
# https://overpass-turbo.eu/

###################
#   Avec Overpy   #
###################
# https://github.com/DinoTools/python-overpy

import overpy
import json
api = overpy.Overpass()
result = api.query(
    """
    node
        ["amenity"="bar"]
        (48.85244671702121,2.3528552055358887,48.85892699104536,2.3641741275787354);
    out;
    """
)
final_data = []

for node in result.nodes:
    rien = node.tags
    rien["id"] = node.id

    data = {
        "type": "Feature",
        "properties": rien,
        "geometry": {"type": "Point", "coordinates": [float(node.lon), float(node.lat)]},
    }
    final_data.append(data)
voila = {
    "type": "FeatureCollection",
    "features": final_data
}
with open("test.geojson",mode="w") as f:
    json.dump(voila,f)


#####################
#   Avec Overpass   #
#####################
# https://github.com/mvexel/overpass-api-python-wrapper

# import overpass
# import json 

# api = overpass.API()
# response = api.get('node["amenity"="bar"](48.85244671702121,2.3528552055358887,48.85892699104536,2.3641741275787354)')
# with open('data.geojson', mode='w') as f:
#     json.dump(response, f)
