# Shopping Website Documentation

Welcome to the documentation for WrapsJC, our shopping website! This guide provides an overview of the project, deployment instructions, and details about key features.

## Table of Contents
1. Introduction
2. Getting Started
3. Project Structure
4. Routes
5. Database Schema
6. Views and Templates
7. Deployment

## Introduction
Our website is built using Node.js, Express, and MongoDB. It allows users to create accounts, browse products, add items to their cart, and complete orders. The project leverages various middleware, including MongoDB for data storage and express-session for server-sided session tracking.

## Getting Started
To set up the project locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Configure environment variables (e.g., database connection, secret keys)
4. Run the server: `npm start`

## Project Structure
The project follows this directory structure:
* /.idea (optional - run configuration)
* /node_modules (optional - node modules)
* /src
  - /controllers
  - /models
  - /routes
  - /views
    + /layouts
  - app.js
  - www
* /public
  - /css
  - /image
* Dockerfile (optional - deploying on web sever)
* package.json (dependencies)
* package-lock.json (optional - dependency versions)
## Routes
Our application has the following main routes:

- `/`: Home page
- `/about`: About us page
- `/products`: View all products
- `/item?prod=id`: View details of a specific product
- `/contacts`: Contact us page
- `/account`: Log in page
- `/createAccount`: Sign up page
- `/shopping_cart`: View and manage the shopping cart
- `/shoppingcartcheckout`: Complete the order
- `/storeOrder/:id`: Order summary for completed order

## Database Schema
We use MongoDB to store product data. The schema includes collections for products, users, orders, shipping info, and billing info.

## Views and Templates
We use EJS templates for rendering views. The `views` folder contains code for individual pages. The `views/layouts` folder contains templates used on multiple pages.

## Deployment
For deployment, set up environment variables for production.
