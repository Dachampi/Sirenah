# tienda-ropa-sirenah
Proyecto de una tienda de ropa femenina - E-commerce

## Comandos Git para la gestión de ramas


### 0. Clonar el repositorio
git clone https://github.com/usuario/tienda-ropa-sirenah.git

### 0. Traer los cambios del repositorio remoto
git pull origin nombre-de-la-rama

### 1 Subir nuestro repo local al remoto(github)
git status (ver los estados)
git add nombre-del-archivo.extension (Estado de comprobacion)
git commit -m "mensaje descriptivo" (Listo para ser subido al repo remoto)
git push -u origin nombre-de-la-rama (Ubicarse en la rama que sera cambiada)


### 2. Verificar en que rama te encuentras
git branch

### 3. Crear nueva rama
git checkout nombre-de-la-rama

### 4. Cambiar de rama
git checkout nombre-de-la-rama

### 5. Cambiar el nombre de la rama
git branch -m nombre-de-la-rama nombre-nuevo

### 6. Eliminar una rama
git branch -d nombre-de-la-rama

### 7. Crear archivos exclusivos a la rama -archivos exclusivos a la rama
touch "nombre-del-archivo.extension"

### 8. Agregar archivos exclusivos a la rama - ubicarse en la rama(add y commit)
git add . (o nombre-del-archivo.extension)
git commit -m "Mensaje"

### 9. Ver diferencias de las ramas
git diff nombre-de-la-rama1 nombre-de-la-rama2

### 10. Combinar ramas
git merge rama-origen(La que recibira los cambios) rama-destino -m "Merge branch 'develop'"

### 13. Abortar un merge (cuando hay conflictos y quieres cancelarlo)
git merge --abort
# Útil si estás en medio de una fusión y quieres deshacerla completamente.

### 15. Resetear el estado del proyecto (⚠️ cuidado: borra cambios locales)
git reset --hard HEAD
# Vuelve al último commit, descartando todos los cambios no confirmados.

### 16. Eliminar una rama remota
git push origin --delete nombre-de-la-rama
# Borra una rama del repositorio remoto (GitHub).