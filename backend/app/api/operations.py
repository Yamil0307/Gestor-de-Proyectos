"""
Este archivo es un punto de entrada centralizado para todas las operaciones CRUD.
Importa y reexporta todas las funciones de los módulos de operaciones específicos.
"""

# Importar todas las operaciones
from .operations.employee_operations import *
from .operations.programmer_operations import *
from .operations.leader_operations import *
from .operations.team_operations import *
from .operations.project_operations import *
from .operations.utils import *

# Nota: Este archivo ahora solo sirve como agregador de todas las operaciones
# Para mantener la compatibilidad con el código existente que importa desde aquí


