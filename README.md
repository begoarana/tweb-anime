# TWEB Anime Explorer

This project was developed for the **Web Technologies** course.

The idea of the project is to build a small web application that allows users to search anime titles stored in a database through a simple and clear web interface.

The focus of the project is not only on the user interface, but also on understanding how different web services can communicate with each other.

---

## General idea

The application is divided into different servers so that each part has a clear responsibility.

In this way:
- the data management is isolated from the user interface
- the architecture is easier to understand and extend

The servers communicate using HTTP requests.

---

## Project structure

Inside the `solution/` folder there are three main components.

---

### `solution/data-server-express/`

This folder contains the **data server**.

It is implemented using Express and connects to a local MongoDB database called `tweb_anime`.
This server is responsible only for accessing the data and returning JSON responses.

Main endpoints:

- `GET /animes`  
  Returns a list of anime titles.  
  It supports search by title, filtering by genre, sorting and pagination.

- `GET /genres`  
  Returns the list of distinct genres stored in the database.  
  This is used to populate the genre dropdown in the web interface.

- `GET /health`  
  Simple endpoint to check if the server is running.

- `POST /seed-demo`  
  Inserts a small demo dataset into the database for testing purposes.

---

### `solution/main-server-express/`

This folder contains the **main web server**.

It is built with Express and uses **Handlebars** to render HTML pages on the server side.
This server does not access the database directly.

Instead, it uses **Axios** to send HTTP requests to the Data Server:
- to retrieve the list of genres
- to request anime search results based on user input

The web interface allows the user to:
- search by anime title
- filter by genre
- choose a sorting option
- navigate through result pages

---

### `solution/spring-server/`

This folder contains a **Spring Boot server** connected to a PostgreSQL database.

This part follows the reference architecture proposed in the assignment.
At the moment, it exposes a basic `/health` endpoint that confirms the server is running correctly and connected to the database.

This server represents a more structured backend using a relational database.

---

## Requirements

To run the project locally, the following tools are required:

- Node.js and npm
- MongoDB
- Java 17
- Maven
- PostgreSQL

---

## How to run the project

The project requires multiple servers, so separate terminals are needed.

1. **Start MongoDB**

2. **Start the Data Server**
   ```bash
   cd solution/data-server-express
   npm install
   npm start
3. **Start the Data Server**
   cd solution/main-server-express
  npm install
  npm start
Open the browser at:
http://localhost:3000
4. **Start the SpringBoot server**
   cd solution/spring-server
  mvn spring-boot:run
And a comprobation that is working: http://localhost:8080/health


NOTE: Notes

The dataset used is based on real anime data, so some titles may look unusual.

**AUTHOR**
Begoña Arana Méndez de Vigo
