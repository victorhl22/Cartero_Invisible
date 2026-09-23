from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartas/{id}")
def obtenir_carta(id: int):
    # Dades simulades (més endavant es llegiran de fitxer)
    cartes = [
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
        {"id": 3, "remitent": "Javier", "contingut": "JAvier ibarra el mejor de españa."},
        {"id": 4, "remitent": "Ali", "contingut": "Tiene como muchos amegos y mobiles."},
        {"id": 5, "remitent": "Sara", "contingut": "La neo exnovia de auonplay."},
        {"id": 6, "remitent": "Iker", "contingut": "El mejor portero del real madrid."},
    ]
    for c in cartes:
        if c["id"] == id:
            return c
    return {"error": "Carta no trobada"}, 404

@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0):
    cartes = [
        {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
        {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
        {"id": 3, "remitent": "Javier", "contingut": "JAvier ibarra el mejor de españa."},
        {"id": 4, "remitent": "Ali", "contingut": "Tiene como muchos amegos y mobiles."},
        {"id": 5, "remitent": "Sara", "contingut": "La neo exnovia de auonplay."},
        {"id": 6, "remitent": "Iker", "contingut": "El mejor portero del real madrid."},
        # Afegeix més dades de prova si vols
    ]
    return cartes[offset:offset+limit]
