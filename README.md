## School Admin System

## Prerequisites

```bash
$ Node
$ Mysql
```

## Setup

## Pre-Installation steps

1. Ensure that the MySQL Database, for example, 'school_admin,' has been created
2. Modify the `.env` file to align with your system configuratio

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

Running `npm start` should generate all tables, given that the synchronization is set to true in the TypeORM configuration

### Unit Testing

After completing the installation, execute npm run `test:e2e` to verify the functionality of all APIs.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:coverage
```

## API Documents

With OpenAPI-Swagger integration in the application, you can access the API documentation through the following URL.

`http://localhost:3001/api-doc`
