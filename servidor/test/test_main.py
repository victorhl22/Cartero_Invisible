import pytest
from httpx import ASGITransport, AsyncClient
from main import app
import json
import main


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        assert response.json() == {"missatge": "Hola, món!"}

@pytest.mark.asyncio
async def test_get_carta_by_id():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Crear primero la carta para garantizar que exista
        payload = {"remitent": "Test", "destinatari": "Test", "contingut": "Test"}
        res_post = await ac.post("/cartas", json=payload)
        carta_id = res_post.json()["id"]

        # 2. Consultar la carta creada usando su ID real
        response = await ac.get(f"/cartas/{carta_id}")
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_cartes_paginades():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas?limit=1&offset=0")
        assert response.status_code == 200
        assert len(response.json()) == 1

@pytest.mark.asyncio
async def test_create_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Pau", "destinatari": "Anna", "contingut": "Hola Anna!", "personatge": "Einstein"}
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 201   # o 201 si l'has configurat
        assert response.json()["id"] is not None
        assert response.json()["remitent"] == "Pau"

@pytest.mark.asyncio
async def test_create_carta_invalid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Pau"}   # falten camps obligatoris
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 422

@pytest.mark.asyncio
async def test_persistencia_post():
    with open("cartas.json", "r") as f:
        dades_abans = json.load(f)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Test", "destinatari": "Test", "contingut": "Test", "personatge": "Test"}
        await ac.post("/cartas", json=payload)

    with open("cartas.json", "r") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1

@pytest.mark.asyncio
async def test_delete_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete("/cartas/1")
        assert response.status_code == 200

    with open("cartas.json", "r") as f:
        dades = json.load(f)
    assert not any(c["id"] == 1 for c in dades)

@pytest.mark.asyncio
async def test_delete_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Crear primero la carta a eliminar
        payload = {"remitent": "Test", "destinatari": "Test", "contingut": "Test"}
        res_post = await ac.post("/cartas", json=payload)
        carta_id = res_post.json()["id"]

        # 2. Eliminar la carta creada
        response = await ac.delete(f"/cartas/{carta_id}")
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_cors_headers():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas", headers={"Origin": "http://127.0.0.1:5500"})
        assert "access-control-allow-origin" in response.headers

@pytest.mark.asyncio
async def test_get_cartes():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_update_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Crear la carta que se va a actualizar
        payload_inicial = {"remitent": "Original", "destinatari": "Original", "contingut": "Original"}
        res_post = await ac.post("/cartas", json=payload_inicial)
        carta_id = res_post.json()["id"]

        # 2. Actualizar utilizando su ID asignado
        payload_update = {"remitent": "Nou", "destinatari": "Nou", "contingut": "Nou"}
        response = await ac.put(f"/cartas/{carta_id}", json=payload_update)
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_update_carta_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "X", "destinatari": "X", "contingut": "X" }
        response = await ac.put("/cartas/999", json=payload)
        assert response.status_code == 404


@pytest.mark.asyncio
async def test_config_no_exposa_la_clau(monkeypatch):
    # Simulem una clau configurada, sense dependre del teu .env real
    monkeypatch.setattr(main, "GEMINI_API_KEY", "clau_secreta_de_prova")
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/config")
        assert response.status_code == 200
        assert response.json()["ia_configurada"] is True
        # La clau MAI ha d'aparèixer a la resposta
        assert "clau_secreta_de_prova" not in response.text


@pytest.mark.asyncio
async def test_config_sense_clau(monkeypatch):
    monkeypatch.setattr(main, "GEMINI_API_KEY", None)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/config")
        assert response.json()["ia_configurada"] is False
