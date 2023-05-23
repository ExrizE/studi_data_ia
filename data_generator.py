import random
from datetime import datetime, timedelta
import psycopg2
import json

DB_NAME = 'production'
DB_USER = 'production'
DB_PASS = 'iOpwTis8OeFUgE642WmKYm'
DB_HOST = 'wxxbovqwekyygvqeveqx.retooldb.com'
DB_PORT = '5432'

sp_categories = ['Employé', 'Ouvrier', 'Profession intermédiaire', 'Indépendant', 'Cadre', 'Retraité', 'Sans activité']
categories = ['alimentaire', 'multimedia', 'épicerie', 'surgelé', 'boulangerie', 'boucherie', 'légumes', 'fruits', 'boissons', 'produits laitiers', 'hygiène', 'beauté', 'jouets', 'vêtements', 'chaussures', 'jardin', 'bricolage']
sp_category_limits = {'Employé': 8, 'Ouvrier': 6, 'Profession intermédiaire': 7, 'Indépendant': 9, 'Cadre': 12, 'Retraité': 7, 'Sans activité': 4}
sp_category_minimums = {'Employé': 45, 'Ouvrier': 40, 'Profession intermédiaire': 50, 'Indépendant': 60, 'Cadre': 70, 'Retraité': 30, 'Sans activité': 15}

def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())))

def generate_client(id):
    return {"id": id, "child_nb": random.randint(0, 6), "sp_category": random.choice(sp_categories)}

def generate_basket(client_id, sp_category, date):
    total_basket = max(sp_category_minimums[sp_category], random.uniform(15, 450))
    limit = sp_category_limits[sp_category]
    chosen_categories = random.sample(categories, random.randint(4, limit))

    details = dict(zip(categories, [0] * len(categories)))

    remaining_total = total_basket - 1.15 * len(chosen_categories)
    if remaining_total < 0:
        raise ValueError('Total basket is too small for the number of categories')

    distribution = [random.random() for _ in range(len(chosen_categories))]
    distribution_sum = sum(distribution)
    distribution = [d / distribution_sum * remaining_total for d in distribution]
    prices = [1.15 + d for d in distribution]

    for cat, price in zip(chosen_categories, prices):
        details[cat] = round(price, 2)

    basket = {
        "client_id": client_id, 
        "total_basket": round(total_basket, 2), 
        "date": date, 
        "details": json.dumps(details)
    }

    return basket

def generate_data(n_clients, start_date, end_date):
    clients = [generate_client(i+1) for i in range(n_clients)]
    baskets = []
    for client in clients:
        n_baskets = random.randint(10, 30)
        for _ in range(n_baskets):
            date = random_date(start_date, end_date)
            basket = generate_basket(client["id"], client["sp_category"], date)
            baskets.append(basket)
    return clients, baskets

def print_data(clients, baskets):
    print("Clients :")
    for client in clients:
        print(client)
    
    print("\nBaskets :")
    for basket in baskets:
        print(basket)

def insert_data_to_db(clients, baskets):
    conn = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)

    cur = conn.cursor()

    client_id_map = {}  
    for client in clients:
        insert_client_query = """
            INSERT INTO Client (child_nb, sp_category)
            VALUES (%s, %s)
            RETURNING id;
        """
        cur.execute(insert_client_query, (client['child_nb'], client['sp_category']))
        generated_id = cur.fetchone()[0]  
        client_id_map[client['id']] = generated_id  

    total_baskets = len(baskets)
    for i, basket in enumerate(baskets, start=1):
        client_id = client_id_map[basket['client_id']]  
        insert_basket_query = """
            INSERT INTO Collecte (client_id, total_basket, date, details)
            VALUES (%s, %s, %s, %s)
            RETURNING *;
        """
        cur.execute(insert_basket_query, (client_id, basket['total_basket'], basket['date'], basket['details']))

        print(f"Progress: {i/total_baskets*100:.2f}%", end="\r")

    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2023, 3, 1)

    clients, baskets = generate_data(100, start_date, end_date)
    print_data(clients, baskets)
    insert_data_to_db(clients, baskets)