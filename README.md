# Northcoders-KNEWS

This project is a news website, allowing users to retrieve, post, delete and edit news articles.

## Getting Started

Follow the instructions stated below in order to access a copy of the project on your local machine.

### Prerequisites

You will require node.js in order to access this project fully.

## Installing

1. Fork and clone the project. In order to clone, you will need to run the following in the command line:

```
git clone <Insert Github Repo Link>
```

note: make sure that you change directory to the repo file.

2. For deployment/production, install the following by running 'npm install', followed by the name of the module, in the command line:

```
npm install
```

```
express: ^4.16.4
knex: ^0.15.2
body-parser: ^1.18.3
pg: ^7.8.0
```

4. For testing purposes, install the following:

```
chai: ^4.2.0
mocha: ^5.2.0
supertest: ^3.4.2
nodemon: ^1.18.10

```

## Setting up The Database

1. In the root directory, create a config file and name it:

```
knexfile.js
```

2. Seed and migrate the database. The way in which this is done depends on the environment, see below for more detail.

```js
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: { directory: "./db/seed" }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news"
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...baseConfig, ...customConfig[ENV] };
```

3. To setup and seed the database, run the following:

```
npm run setup-db
npm run migrate:rollback
npm run migrate:latest
npm run see-db
```

## Testing

Running the following command will run the entire test suite.

```
npm run test
```

## Built With

- [Node.js]
- [Knex]
- [Express]
- [PostgreSQL]
- [Heroku]

## Authors

_Author_: **[Elizabeth Codd](https://github.com/Coddzilla)**

_Initial repo_: **[NorthCoders](https://github.com/northcoders)**
