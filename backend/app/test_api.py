import pytest
from fastapi.testclient import TestClient
from app.main import app
import random
import string

client = TestClient(app)

def generate_unique_id():
    """Genera un ID único para evitar conflictos en tests"""
    return ''.join(random.choices(string.digits, k=8))

# --- AUTH ---
def test_register_and_login():
    # Registro
    unique_suffix = generate_unique_id()
    user = {
        "username": f"testuser{unique_suffix}",
        "email": f"testuser{unique_suffix}@example.com",
        "password": "testpass123"
    }
    r = client.post("/auth/register", json=user)
    assert r.status_code in (200, 400)  # Puede fallar si ya existe
    # Login
    login = {"username": user["username"], "password": user["password"]}
    r = client.post("/auth/login", json=login)
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}
    # Info usuario actual
    r = client.get("/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["username"] == user["username"]

# --- EMPLOYEES ---
def test_employee_crud():
    # Crear
    emp = {
        "identity_card": generate_unique_id(),
        "name": "Empleado Test",
        "age": 30,
        "sex": "M",
        "base_salary": 1000.0,
        "type": "programmer"  # Valor permitido según el modelo
    }
    r = client.post("/employees/", json=emp)
    assert r.status_code == 200
    emp_id = r.json()["id"]
    # Obtener
    r = client.get(f"/employees/{emp_id}")
    assert r.status_code == 200
    # Actualizar
    r = client.put(f"/employees/{emp_id}", json={"name": "Empleado Modificado"})
    assert r.status_code == 200
    # Listar
    r = client.get("/employees/")
    assert r.status_code == 200
    # Salario
    r = client.get(f"/employees/{emp_id}/salary")
    assert r.status_code == 200
    # Eliminar
    r = client.delete(f"/employees/{emp_id}")
    assert r.status_code == 200

# Puedes seguir este patrón para leaders, programmers, projects, teams...
# Si quieres que los agregue todos, avísame.
