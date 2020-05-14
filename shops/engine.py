from django.contrib.gis.db.models.functions import Distance

from authentification.models import User

from .models import Shops


class Matchmaker:
    def __init__(self):
        pass

    def run_query(self, user_id):
        """ run the query to the DB for the 6 clostest
        shop from the user """
        user_location = User.objects.get(pk=user_id)
        return Shops.objects.annotate(
            distance=Distance('geom', user_location.geom)
            ).order_by('distance')[0:6]

    def ranked_list(self, user_id):
        """ return a ranked list of the 6 shops, the closer shop get
        the higher rank """
        query = self.run_query(user_id)
        ranked_list = []
        rank = query.count()
        for i in query:
            shop = {'id': i.id,
                    'name': i.name,
                    'distance': i.distance.m,
                    'rank': rank}
            rank -= 1
            ranked_list.append(shop)
        return ranked_list

    def find_shop(self, id):
        """ sum the overall score of the shops listed and print return
        the shop with the higher score """
        current_user = User.objects.get(pk=id)

        users = [id,]
        final_dict = {}
        temp_list = []

        for i in current_user.friends.all():
            users.append(i.id)

        for user in users:
            user = self.ranked_list(user)  # Frienddealer(1).friends_list
            for i in user:
                final_dict[i['id']] = 0
                temp_list.append({i['id']: i['rank']})
                
        for i in temp_list:
            for key, value in i.items():
                final_dict[key] = final_dict[key] + value
        # print(final_dict)
        x_key = max(final_dict, key=final_dict.get)
        return x_key


match_maker = Matchmaker()

class Frienddealer:
    pass
    # methode qui retourne une liste des amis de la personne
    # methode qui retourne une liste des amis disponible pour un verre (décorateur de la methode precedente)
    # methode qui permet d'ajouter un ami dans la liste d'ami
    # methode qui permet de retirer un ami dans la liste d'ami
