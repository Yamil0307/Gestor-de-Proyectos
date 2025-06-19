from app.database.database import engine
from app.models.models import Base

def test_connection():
    try:
        # Intentar conectar a la base de datos
        connection = engine.connect()
        print("✅ Conexión a la base de datos exitosa!")
        
        # Crear las tablas
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas creadas exitosamente!")
        
        connection.close()
        return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

if __name__ == "__main__":
    test_connection()