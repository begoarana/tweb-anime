# TWEB Anime Explorer

This project was developed for the **Web Technologies** course.  
The main idea is to create a small web application that allows users to **search anime titles** stored in a MongoDB database, using a simple web interface.

The application is split into two different servers, so that the logic and the interface are separated.

---

## General idea of the project

The project is composed of:

- a **Data Server**, which manages the database and returns data
- a **Main Server**, which shows the web page and interacts with the user

The two servers communicate with each other using HTTP requests.

---

## Project structure

Inside the `solution/` folder there are two main directories.

### `solution/data-server-express/`

This folder contains the **data server**.

It is built with Express and connects to a local MongoDB database called `tweb_anime`.  
Its role is to handle all the operations related to data.

Main endpoints:

- `GET /animes`  
  Returns a list of animes. It supports search by title, filtering by genre, sorting and pagination.

- `GET /genres`  
  Returns the list of all distinct genres found in the database.  
  This is used to fill the genre dropdown in the web interface.

- `GET /health`  
  Simple endpoint to check if the server is running correctly.

- `POST /seed-demo`  
  Inserts some demo anime data into the database, useful for testing.

---

### `solution/main-server-express/`

This folder contains the **main web server**.

It is also built with Express, but it uses **Handlebars** to render HTML pages.  
This server does not access MongoDB directly.

Instead, it uses **Axios** to send requests to the Data Server:
- first to get the list of genres
- then to retrieve the search results based on user input

The page allows the user to:
- type a title
- select a genre
- choose a sorting option
- navigate through pages of results

---

## Requirements

To run the project locally, the following are needed:

- Node.js and npm
- MongoDB running locally

---

## How to run the project

The project requires **two terminals**, because there are two servers.

1. **Start MongoDB**  
   MongoDB must be running before starting the servers.

2. **Start the Data Server**  
   From the `data-server-express` folder:
3. **Start the Main server**
   From the `main-server-express` folder:
