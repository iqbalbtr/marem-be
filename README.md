## Getting started

This project is built using the latest version of NestJS.
The setup was created by [@iqbalbtr](https://github.com/iqbalbtr).

By default, this project runs using npm.
If you want to use pnpm or any other package manager, you can update the scripts accordingly. 🚀

you can read api docs [here](/docs/response-spec.md)

## Project setup

```bash
$ npm install
```

>[!NOTE]
> Don't forget to set up your .env

## Database Comands

```bash
# Create a migration
npm run db:migrate  

# Generate Prisma Client
npm run db:generate  

# Drop all tables and seed the database
npm run db:fresh  

# Reset the database
npm run db:reset  

# Seed the database
npm run db:seed  

```

## Compile and run the project

```bash
# Development mode
npm run start  

# Watch mode (auto-restart on changes)
npm run start:dev  

# Production mode
npm run start:prod  
```

## Run tests

```bash
# Unit tests
npm run test  

# End-to-end (E2E) tests
npm run test:e2e  

# Test coverage report
npm run test:cov  
```
> Just open your browser [localhost](http://localhost:3000)