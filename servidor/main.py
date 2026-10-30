from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],  # el port del teu client
    allow_credentials=True,
    allow_methods=["*"],      # GET, POST, PUT, DELETE…
    allow_headers=["*"],
)

DATA_FILE = "cartas.json";



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

cartes = cargar_cartes();

#El get general.

@app.get("/")
def root():
    return {"missatge": "Hola, món!"}

@app.get("/cartas/{id}", status_code=status.HTTP_200_OK)
def obtenir_carta(id: int):
    # Dades simulades (més endavant es llegiran de fitxer)
    ##cartes = [
    #    {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
    #    {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
    #   {"id": 3, "remitent": "Javier", "contingut": "JAvier ibarra el mejor de españa."},
    #    {"id": 4, "remitent": "Ali", "contingut": "Tiene como muchos amegos y mobiles."},
    #    {"id": 5, "remitent": "Sara", "contingut": "La neo exnovia de auonplay."},
    #    {"id": 6, "remitent": "Iker", "contingut": "El mejor portero del real madrid."},
    #]
    for c in cartes:
        if c["id"] == id:
            return c
    raise HTTPException(
        status_code=404,
        detail="Carta no trobada")

#No es GET sino POST y lo que hace es entregar la carta en vez de obtener-las.
@app.post("/cartas", status_code=status.HTTP_201_CREATED)
def crear_carta(carta: Carta):
    nova_carta = carta.model_dump()          # converteix el model a diccionari
    nova_carta["id"] = len(cartes) + 1  # assigna un ID únic
    cartes.append(nova_carta)
    guardar_cartes(cartes)          #Guarda la lista actualizada de cartas en el archivo JSON.
    return nova_carta



@app.get("/cartas", status_code=status.HTTP_200_OK)
def llistar_cartes(limit: int = None, offset: int = 0, personatge: str = None):
    if personatge:
        cartesFiltrades = [c for c in cartes if c.get("personatge") == personatge]
    else:
        cartesFiltrades = cartes
    
    # Si se pasa un límite específico se aplica el recorte, si no, devuelve la lista completa
    if limit is not None:
        return cartesFiltrades[offset:offset + limit]
    
    return cartesFiltrades[offset:]

@app.delete("/cartas/{id}", status_code=status.HTTP_200_OK)
def eliminar_carta(id: int):
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)          # ⭐ persisteix al fitxer
            return {"missatge": "Carta eliminada"}
    raise HTTPException(status_code=404, detail="Carta no trobada")

@app.put("/cartas/{id}", status_code=status.HTTP_200_OK)
def actualitzar_carta(id: int, carta: Carta):
    for i, c in enumerate(cartes):
        if c["id"] == id:
            # Actualitza totes les dades excepte l'ID
            cartes[i] = {
                "id": id,
                "remitent": carta.remitent,
                "destinatari": carta.destinatari,
                "contingut": carta.contingut,
            }
            guardar_cartes(cartes)          # ⭐ persisteix al fitxer
            return cartes[i]
    raise HTTPException(status_code=404, detail="Carta no trobada")

@app.get("/config",  status_code=status.HTTP_200_OK)
def config():
    return {
        "debug": DEBUG,
        "ia_configurada": GEMINI_API_KEY is not None and GEMINI_API_KEY != ""
    }
