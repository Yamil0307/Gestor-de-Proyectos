# Guía de Seguridad - Sistema de Gestión de Proyectos

## ⚠️ ANTES DE PONER EN PRODUCCIÓN

### 1. Variables de Entorno
```bash
# Crear archivo .env con valores seguros
cp .env.example .env

# Generar una SECRET_KEY segura:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Configuración de CORS
- Actualizar `app/main.py` línea 23-26 con los dominios de producción
- Nunca usar `allow_origins=["*"]` en producción

### 3. Base de Datos
- Para producción, cambiar de SQLite a PostgreSQL o MySQL
- Configurar backups automáticos
- Usar conexiones SSL

### 4. Headers de Seguridad
Considerar agregar middleware para headers de seguridad:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

### 5. Rate Limiting
Implementar limitación de velocidad para endpoints críticos:
- Login: 5 intentos por minuto
- API endpoints: 100 requests por minuto por IP

### 6. Logging
- Configurar logs de seguridad
- No registrar contraseñas o tokens
- Monitorear intentos de acceso fallidos

## ✅ Mejoras ya Implementadas

- [x] SECRET_KEY configurable
- [x] CORS restrictivo
- [x] Validaciones de entrada robustas
- [x] Ejemplo de configuración (.env.example)
- [x] .gitignore para archivos sensibles
