from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

#Llista global de cartes buides.
cartes = []

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
    raise HTTPException(
        status_code=404,
        detail="Carta no trobada")


@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0):
  
    return cartes[offset:offset+limit]

class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str    # per a la IA (de moment pot ser opcional)



#No es GET sino POST y lo que hace es entregar la carta en vez de obtener-las.
@app.post("/cartas")
def crear_carta(carta: Carta):
    nova_carta = carta.dict()          # converteix el model a diccionari
    nova_carta["id"] = len(cartes) + 1  # assigna un ID únic
    cartes.append(nova_carta)
    return nova_carta
