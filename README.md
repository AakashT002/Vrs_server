# LP02 - Team M - Backend for Requestor

This will be the requestor backend for LP02 - Team M

The project uses [restify](http://restify.com/) framework as this is **STRICTLY** for services and doesn't serve any static content like Express framework. Please talk to us if there is any need to serve HTML content also.

## Contributing

Refer [here](https://github.com/CognizantStudio/lp02-team-m-requestor-server/blob/master/.github/CONTRIBUTING.md) to know more about the  commit comments, branching, naming, merging, pull requests, reviews etc.

## Getting started

Clone this repo into new project folder (e.g., `lp02-team-m-requestor-server-proj`).
```shell
git clone https://github.com/CognizantStudio/lp02-team-m-requestor-server.git requestor-backend
cd requestor-backend
```
### Install npm packages

> Check for npm and nvm version. Preferred to have node version >= 6.9.X

Install the npm packages described in the `package.json` and verify that it works:

```shell
npm install
npm start
```

### Testing

We would be following Test-driven-development (TDD) / Behaviour-driven-developement (BDD) for this project using Mocha & Chai.

The test scripts will be placed in **tests** folder. To execute the tests

```shell
npm run test
```

### Formatting and Linting

eslint is configured to check for any lint errors. Please check the `.eslintrc.json` file for lint rules.
Also we have configured Git pre-commit to run the lint checks before committing. This adds for some good level of check. Please refer [here](https://gist.github.com/ccPrathap/fcf85931bfca76fb84d44883d8cf5f62) for more details.

`editorconfig` has the settings for formatting the code.

You can also make sure to format the code while on save also. In your choice of IDE, you can go to preferences and enable `"editor.formatOnSave": true`

**TODO** - Prettier seems to be a good tool too. Not yet integrated it for this repo

## Keycloak Integration
Currently we are not using any keycloak library to check for tokens. API call is checked for `Bearer <<kcTokenFromUI>>` in the `Authorization` header. The Keycloak token is decoded and parsed to get the user details. Ideally we need to check with Keycloak connect `keycloak.protect` on each route/API. This is to be done later.


## Database

### PostgreSQL database setup

We are using postgres db 9.6 version. Make sure to append to the PATH variable the postgres bin folder. Eg: `C:\Program Files\PostgreSQL\9.6\bin`

We will be using the user `postgres` for creating the db. You can create new users as well. In that case, please modify the command `createdb:dev / createdb:test` in package.json to reflect the change in user.

If using user `postgres`, remember the password provided during the setup. You might be prompted for password when creating the database.

Create two databases. One for dev and test (optional)
 ```
 npm run createdb:dev
 npm run createdb:test (optional)
 ```
**Important** : Please make sure to provide the correct db name and credentials in database/config.js. Otherwise, the app will not be able to connect with the databases created with the above commands.

### Sequelize for ORM
Sequelize is used as the ORM library. Sequelize is quite popular and has active community support as compared to other libraries.

Learn more about sequelize

- [Sequelize](https://sequelize.readthedocs.io/en/v3/).
- [Sequelize CLI](http://docs.sequelizejs.com/)
- [Tutorial - Node, Postgres, Sequelize](http://mherman.org/blog/2015/10/22/node-postgres-sequelize/#.WUJoiVV97Z5)

Install squelize-cli globally to have access to all of the sequelize commands

```
npm install -g sequelize-cli
```

Refer to the [sequelize documentation](http://docs.sequelizejs.com/) for model creation, migration and seeds.

### Run db migrations
To create the tables and alters etc in the  database, run the below script

```npm run migrations```

### Seed the database
For Seeding run the below script

```npm run seeds```

### Heroku Database commands

Make sure the below environment variables are set in the herokup dashboard for the application.

- DATABASE_URL=<<url of postgres://......>>
- NODE_ENV=production

Migration : `heroku run sequelize db:migrate --env production -m --app lp02-team-m-requestor-server`

Seed : `heroku run sequelize db:seed:all --env production -m --app lp02-team-m-requestor-server`

_Take note : App has to be deployed first for the migration and seeds to be executed._

## API

Services are deployed in https://lp02-team-m-requestor-server.herokuapp.com

**API documentation**
TODO : Swagger to be used..

----

## Deployment
- To deploy:
  * First, set a git remote pointing at the appropriate Heroku git URL: `git remote add <remote name> <
Heroku Git URL>`
    * the Heroku Git URL can be found through the Heroku GUI under the Settings for an individual project.

### Staging
- The staging URL can be found **TODO**
- Deployment to staging happens automatically with a passing build on the master branch
- If needed, you can manually deploy from the command line using `git push <remote name> master`

### Production
- The production URL can be found **TODO**
- Production will need to be manually deployed. To deploy run: `git push <remote name> master` from the command line.

#### Caveats
- If the seeds or migrations files are updated, you will likely need to clear out the whole database and run the seeds or migration script again.
