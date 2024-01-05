# Andra's News Back End API

**Description**

A 'News API' built with Node.js, an Express.js server and a PostgreSQL database.

All endpoints can be found in the endpoints.json file or visting https://andrasnews.onrender.com/api/ 

There is a **Front End** app available for this API, which will allow you to interact with it, available at: https://andrasnews.netlify.app

# Setup Instructions

**Installation requirements:**

Node.js 17.x
Postgres 14.x

**Cloning the repository:**
In your teminal CLI: $ git clone https://github.com/andraimoraru/nc_news.git

**Installing dependencies:**

In your teminal CLI: $ npm install

**Environment setup:**

In order to successfully connect to the two databases locally you will need to create 2 environment variables files (one for dev and one for testing):

.env.development
.env.test

Each file should contain: 

PGDATABASE=database_name_here   (with the relevant database names, found in setup.sql). 

**Database set-up and seeding:**

Before using or testing the application, you will need to set the database up, and then seed it with the data:

$ npm run setup-dbs
$ npm run seed



