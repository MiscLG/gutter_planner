# gutter_planner
This is the repository for an experimental web app for a small raingutter repair business.

React.js web front end in /src/frontend

Django backend in /src/backend

unimplemented React Native frontend in /src/app-frontend

## Gutter Planner
A web application for optimizing a rain gutter businesss written in Python and JSX. 

## Incomplete: In Progress

#### Example:

This project is currently in development. Users can log in and schedule estimate. The 
UX for this process has not been completed and as of yet the data is not visible. 

## Project Screen Shot(s)

#### Example:   

[ PRETEND SCREEN SHOT IS HERE ]

[ PRETEND OTHER SCREEN SHOT IS HERE ]

## Installation and Setup Instructions

Clone down this repository. For the backend you will need to have `python3` installed globally in your machine
and also Django. For the front end you will need `node` and `yarn` installed globally on your machine as well as
React.js. Additionally, the backend requires that a Neo4J database be setup for the project.

Installation:

(It is recommended that one works in a virtual env: `python3 -m venv [env-name] && source [env-name]/bin/activate`)


Add API Keys in the .env. 

###Backend:
`pip3 install -r requirements.txt` will install the required packages for the app. 

`python3 -m pip install Django` will install Django. 

Note: since this is a private project, I have not changed the Django settings secret key. But generally, to clone a project
a user would need to generate or request this key. 

`python3 manage.py createsuperuser` will create a superuser account for Django's built-in administration tools

`python manage.py makemigrations` will create Django migrations for the project's database models

`python3 manage.py migrate` will migrate the database objects to the runnable app

`python3 manage.py runserver` will start the app

To visit app (only API and admin is implemented):

`localhost:8000/[admin or graphql]`


###Frontend:

`yarn install`  


To Start Server:

`yarn start`  

To Visit App:

`localhost:3000/`  

Database: A user will need to install Neo4j using the installation instructions found on their website: https://neo4j.com/docs/operations-manual/current/installation/ 
Once installed, a database should be added and a password set for the database. 

Additionally, one must, add API and Database Keys to the .env files of the Django project and the React project. 

For Django: 

`GOOGLE_CLIENT_ID = ""`

`GOOGLE_SECRET = ""`

`NEO4J_USERNAME= ""`

`NEO4J_PASSWORD = ""`

For React: 

`REACT_APP_BACKEND_ADDRESS="http://localhost:8000/"`

`REACT_APP_GOOGLE_CLIENT=""`
