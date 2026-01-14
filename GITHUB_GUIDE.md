# Guía para Actualizar el Proyecto en GitHub

Esta guía te explica paso a paso cómo subir los cambios a GitHub.

## 📋 Antes de Empezar

1. **Asegúrate de tener Git instalado**
   ```bash
   git --version
   ```

2. **Verifica que estás en el directorio correcto**
   ```bash
   cd "C:\Users\begoa\OneDrive\Escritorio\UNITO\TECNOLOGIAS WEB\tweb-anime"
   ```

## 🔍 Paso 1: Verificar el Estado Actual

Primero, veamos qué archivos han cambiado:

```bash
git status
```

Esto te mostrará:
- Archivos modificados (en rojo)
- Archivos nuevos (en rojo)
- Archivos que ya están en staging (en verde)

## 📝 Paso 2: Ver los Cambios

Si quieres ver qué cambió en un archivo específico:

```bash
git diff README.md
```

O ver todos los cambios:
```bash
git diff
```

## ➕ Paso 3: Agregar Archivos al Staging

Tienes dos opciones:

### Opción A: Agregar todos los archivos modificados
```bash
git add .
```

### Opción B: Agregar archivos específicos (más seguro)
```bash
# Agregar archivos modificados
git add README.md
git add solution/spring-server/src/main/resources/application.properties
git add solution/main-server-express/app.js

# Agregar archivos nuevos
git add solution/start-all.ps1
git add solution/start-all.sh
git add solution/SETUP.md
git add solution/CHECKLIST.md
git add GITHUB_GUIDE.md
```

**Recomendación:** Usa la Opción B para tener más control.

## ✅ Paso 4: Verificar lo que vas a subir

Antes de hacer commit, verifica qué archivos están en staging:

```bash
git status
```

Los archivos en verde son los que se subirán.

## 💾 Paso 5: Hacer Commit (Guardar los Cambios)

Crea un commit con un mensaje descriptivo:

```bash
git commit -m "Fix: Corregir configuración y agregar documentación

- Cambiar contraseña hardcodeada de PostgreSQL a variables de entorno
- Agregar comunicación del main server con Spring Boot
- Corregir errores en README
- Agregar scripts de inicio (start-all.ps1 y start-all.sh)
- Agregar documentación detallada (SETUP.md, CHECKLIST.md)
- Mejorar estructura del proyecto para ejecución en ordenador del profesor"
```

**Consejo:** Usa mensajes de commit claros y descriptivos. El formato es:
- Primera línea: resumen corto (máximo 50 caracteres)
- Línea en blanco
- Líneas siguientes: descripción detallada

## 🚀 Paso 6: Subir a GitHub (Push)

### Si es la primera vez que subes a este repositorio:

```bash
# Verificar el remote (debe apuntar a tu repositorio)
git remote -v

# Si no hay remote, agregarlo:
# git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Subir los cambios
git push -u origin main
```

### Si ya tienes el repositorio configurado:

```bash
git push
```

**Nota:** Si usas `master` en lugar de `main`:
```bash
git push -u origin master
```

## 🔄 Si hay conflictos o el repositorio está desactualizado

Si GitHub tiene cambios que no tienes localmente:

```bash
# 1. Primero, traer los cambios de GitHub
git pull origin main

# 2. Si hay conflictos, resolverlos manualmente
# 3. Luego hacer commit y push
git add .
git commit -m "Resolve merge conflicts"
git push
```

## 📊 Ver el Historial de Commits

Para ver todos los commits:

```bash
git log --oneline
```

Para ver un commit específico:
```bash
git show HEAD
```

## 🎯 Comandos Rápidos (Resumen)

```bash
# 1. Ver estado
git status

# 2. Agregar cambios
git add .

# 3. Hacer commit
git commit -m "Descripción de los cambios"

# 4. Subir a GitHub
git push
```

## ⚠️ Errores Comunes y Soluciones

### Error: "fatal: not a git repository"
**Solución:** Estás en el directorio equivocado. Ve al directorio del proyecto.

### Error: "fatal: remote origin already exists"
**Solución:** El remote ya está configurado. Solo haz `git push`.

### Error: "Updates were rejected because the remote contains work"
**Solución:** 
```bash
git pull origin main
# Resolver conflictos si los hay
git push
```

### Error: "Permission denied"
**Solución:** 
- Verifica que tienes acceso al repositorio
- Asegúrate de estar autenticado en GitHub (puede requerir token de acceso personal)

## 🔐 Autenticación en GitHub

Si GitHub te pide autenticación:

1. **Usar Personal Access Token (recomendado)**
   - Ve a GitHub → Settings → Developer settings → Personal access tokens
   - Crea un nuevo token con permisos `repo`
   - Úsalo como contraseña cuando Git te la pida

2. **O usar GitHub CLI**
   ```bash
   gh auth login
   ```

## 📝 Checklist Antes de Hacer Push

- [ ] He revisado los cambios con `git status`
- [ ] He agregado los archivos correctos con `git add`
- [ ] He hecho commit con un mensaje descriptivo
- [ ] He verificado que no hay archivos sensibles (contraseñas, tokens)
- [ ] He verificado que `node_modules/` y `target/` NO están incluidos
- [ ] El repositorio es privado y está compartido con los profesores

## 🎓 Para el Assignment

Según el assignment, debes:

1. **Hacer commits regularmente** (no solo al final)
2. **Cada miembro debe hacer commits** (no delegar a una sola persona)
3. **Commits intermedios** (no solo cuando el código está completo)
4. **Usar tu nombre real** en los commits (no alias)

Para configurar tu nombre en Git:
```bash
git config user.name "Begoña Arana Méndez de Vigo"
git config user.email "tu-email@ejemplo.com"
```

## 📚 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**¿Necesitas ayuda?** Si tienes algún error, copia el mensaje completo y busca la solución en la documentación de Git o pregunta a tu profesor.
