# TWEB Anime Explorer

This project was developed for the **Web Technologies** course.
The goal is to create a small web application that allows users to search anime titles stored in a MongoDB database through a simple web interface.

The application is split into two different servers so that the application logic and the user interface are clearly separated.

---

## General idea of the project

The project is composed of two main parts:

* a **Data Server**, responsible for managing the database and returning data
* a **Main Server**, responsible for showing the web pages and interacting with the user

The two servers communicate with each other using HTTP requests.

---

## Project structure

Inside the `solution/` folder there are two main directories.

### `solution/data-server-express/`

This folder contains the **data server**.

It is built with Express and connects to a local MongoDB database called `tweb_anime`.
Its role is to handle all operations related to data access.

Main endpoints:

* `GET /animes`
  Returns a list of anime titles. It supports search by title, filtering by genre, sorting and pagination.

* `GET /genres`
  Returns the list of all distinct genres stored in the database.
  This endpoint is used to populate the genre selection menu in the web interface.

* `GET /health`
  Simple endpoint used to check if the server is running correctly.

* `POST /seed-demo`
  Inserts some demo anime data into the database, useful for testing the application.

---

### `solution/main-server-express/`

This folder contains the **main web server**.

It is also built with Express, and it uses **Handlebars** to render HTML pages.
This server does not access MongoDB directly.

Instead, it uses **Axios** to send HTTP requests to the Data Server:

* first to retrieve the list of available genres
* then to request anime search results based on user input

The web page allows the user to:

* enter an anime title
* select a genre
* choose a sorting option
* navigate through multiple pages of results

---

## Requirements

To run the project locally, the following tools are required:

* Node.js and npm
* MongoDB running locally
* Java 17
* Maven
* PostgreSQL

---

## How to run the project

The project requires **two separate terminals**, since there are two servers.

1. **Start MongoDB**
   Make sure MongoDB is running before starting the servers.

2. **Start the Data Server**
   From the `solution/data-server-express` folder:

   ```bash
   npm install
   npm start
   ```

3. **Start the Main Server**
   From the `solution/main-server-express` folder:

   ```bash
   npm install
   npm start
   ```

Once both servers are running, open your browser and access the main server to use the application.
---

### `solution/spring-server/`

This folder contains a **Spring Boot server** connected to a PostgreSQL database.

Its role is to manage more static and structured data, following the reference architecture provided in the assignment.

The server exposes REST endpoints that can be accessed by the Main Server via HTTP requests.


## Academic context

This project was created as part of the **Web Technologies** course and is intended for educational purposes only.

---

## Author

Begoña Arana

---

## Project status

The project is currently under development.
