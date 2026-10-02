import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        assert response.json() == {"missatge": "Hola, món!"}

@pytest.mark.asyncio
async def test_get_carta_by_id():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/cartas/1")
        assert response.status_code == 200
        assert response.json()["id"] == 1

        response = await ac.get("/cartas/999")
        assert response.status_code == 404

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
        assert response.status_code == 200   # o 201 si l'has configurat
        assert response.json()["id"] is not None
        assert response.json()["remitent"] == "Pau"

@pytest.mark.asyncio
async def test_create_carta_invalid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Pau"}   # falten camps obligatoris
        response = await ac.post("/cartas", json=payload)
        assert response.status_code == 422