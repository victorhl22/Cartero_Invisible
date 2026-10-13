from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os


DATA_FILE = "cartas.json";

app = FastAPI()

def cargar_cartes():
    """Llegeix les cartes del fitxer. Si no existeix, torna una llista buida."""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def guardar_cartes(cartes):
    """Escriu les cartes al fitxer."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(cartes, f, indent=2, ensure_ascii=False)

#Modelo Pydantic
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str    # per a la IA (de moment pot ser opcional)

cartes = cargar_cartes();

#El get general.

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

#No es GET sino POST y lo que hace es entregar la carta en vez de obtener-las.
@app.post("/cartas")
def crear_carta(carta: Carta):
    nova_carta = carta.model_dump()          # converteix el model a diccionari
    nova_carta["id"] = len(cartes) + 1  # assigna un ID únic
    cartes.append(nova_carta)
    guardar_cartes(cartes)          #Guarda la lista actualizada de cartas en el archivo JSON.
    return nova_carta



@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0, personatge: str = None):
    if personatge:
        # Se usa c.get() para evitar un KeyError si el campo no existe en alguna carta
        cartesFiltrades = [c for c in cartes if c.get("personatge") == personatge]
    else:
        cartesFiltrades = cartes
    
    return cartesFiltrades[offset:offset + limit]

@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    global cartes
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}
    return {"error": "Carta no trobada"}, 404




