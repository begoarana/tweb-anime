# proyecto anime tweb

trabajo para la asignatura de tecnologias web

## que es esto

un sistema para buscar animes con datos de usuarios, personajes y eso

tengo que usar 3 servidores que se comunican entre ellos con axios

## servidores

- servidor principal en express (puerto 3001)
- servidor de mongodb para ratings y usuarios (puerto 3002)  
- servidor spring boot para los datos de anime (puerto 8080)

## estado

de momento solo tengo el servidor principal


## como ejecutar

npm install en main-server
npm start

---

todavia falta mucho por hacer
```

**Commit message:** 
```
feat: setup inicial con servidor principal

he creado el servidor main en express que va a coordinar los otros
por ahora solo tiene rutas basicas y axios configurado
falta conectarlo con los otros servidores
```
