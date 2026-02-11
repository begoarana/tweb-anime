# Comandos para Subir a GitHub

## 📋 Pasos Rápidos

Abre PowerShell o Git Bash en la carpeta del proyecto y ejecuta estos comandos en orden:

### 1. Ver qué archivos cambiaron
```bash
git status
```

### 2. Agregar todos los archivos modificados
```bash
git add .
```

### 3. Hacer commit (guardar los cambios)
```bash
git commit -m "Fix: Corregir configuración y agregar documentación

- Cambiar contraseña hardcodeada de PostgreSQL a variables de entorno
- Agregar comunicación del main server con Spring Boot
- Corregir errores en README
- Agregar scripts de inicio (start-all.ps1 y start-all.sh)
- Agregar documentación detallada (SETUP.md, CHECKLIST.md)
- Comentar todo el código en español
- Mejorar estructura del proyecto para ejecución en ordenador del profesor"
```

### 4. Subir a GitHub
```bash
git push
```

---

## 🔍 Si es la Primera Vez

Si nunca has subido este proyecto a GitHub antes:

### 1. Crear el repositorio en GitHub
1. Ve a https://github.com
2. Click en el botón "+" (arriba a la derecha)
3. Click en "New repository"
4. Ponle un nombre (ej: `tweb-anime`)
5. **Marca como PRIVADO** (Private)
6. **NO marques** "Initialize with README"
7. Click en "Create repository"

### 2. Conectar tu proyecto local con GitHub

GitHub te dará comandos, pero básicamente es:

```bash
# Si el repositorio está vacío (primera vez)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## ⚠️ Si Te Pide Autenticación

Si Git te pide usuario y contraseña:

1. **Usuario:** Tu nombre de usuario de GitHub
2. **Contraseña:** Necesitas un **Personal Access Token** (no tu contraseña normal)

### Crear Personal Access Token:
1. Ve a GitHub → Settings (tu foto arriba a la derecha)
2. Click en "Developer settings" (abajo a la izquierda)
3. Click en "Personal access tokens" → "Tokens (classic)"
4. Click en "Generate new token" → "Generate new token (classic)"
5. Ponle un nombre (ej: "tweb-anime-project")
6. Selecciona el scope `repo` (marca la casilla)
7. Click en "Generate token"
8. **COPIA EL TOKEN** (solo se muestra una vez)
9. Úsalo como contraseña cuando Git te la pida

---

## 📝 Comandos Útiles

### Ver el historial de commits
```bash
git log --oneline
```

### Ver qué archivos cambiaron
```bash
git diff
```

### Ver el estado actual
```bash
git status
```

### Deshacer cambios (si te equivocaste)
```bash
# Deshacer cambios en un archivo específico
git checkout -- nombre-del-archivo.js

# Deshacer el último commit (pero mantener los cambios)
git reset --soft HEAD~1
```

---

## ✅ Checklist Antes de Hacer Push

- [ ] He revisado los cambios con `git status`
- [ ] He agregado los archivos con `git add .`
- [ ] He hecho commit con un mensaje descriptivo
- [ ] No hay contraseñas o datos sensibles en el código
- [ ] El repositorio es **PRIVADO**
- [ ] He compartido el repositorio con los profesores:
  - Fabcira, LuisBarrios03 en Github
  - Ciravegna, Luis Andre' Barrios Luna Victoria en GitLab

---

## 🎯 Comandos en Una Línea (Copia y Pega)

```bash
git add . && git commit -m "Fix: Corregir configuración y agregar documentación" && git push
```

---

## 🆘 Si Algo Sale Mal

### Error: "fatal: not a git repository"
**Solución:** Estás en el directorio equivocado. Ve a la carpeta del proyecto.

### Error: "Updates were rejected"
**Solución:** 
```bash
git pull origin main
# Resolver conflictos si los hay
git push
```

### Error: "Permission denied"
**Solución:** 
- Verifica que tienes acceso al repositorio
- Usa un Personal Access Token en lugar de tu contraseña

---

**¿Necesitas más ayuda?** Revisa el archivo `GITHUB_GUIDE.md` para más detalles.
