# LP02 - Team M - VRS - Server 

This will be the server for LP02 - Team M

The project uses [restify](http://restify.com/) framework as this is **STRICTLY** for services and doesn't serve any static content like Express framework. Please talk to us if there is any need to serve HTML content also.

## Contributing

Refer [here](https://github.com/CognizantStudio/lp02-team-m-vrs-server/blob/master/.github/CONTRIBUTING.md) to know more about the  commit comments, branching, naming, merging, pull requests, reviews etc.

## Getting started

Clone this repo into new project folder (e.g., `lp02-team-m-vrs-server-proj`).
```shell
git clone https://github.com/CognizantStudio/lp02-team-m-vrs-server.git vrs-backend
cd vrs-backend
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

## Lookup Directory / Blockchain functionality

Before you interact with any of the functions in the Lookup Directory, you'll need to create a `new` instance of the LookupDirectory class and provide it with a contract address. E.g.: 
`const ld = new LookupDirectory(contractAddress);`

### Current Contract Addresses
If you deploy a new contract for any environment - please make sure you update the new address here!!
Dev:
Staging: `0x45002b939f5e1cf874ff2fa316c3461f06c1fbe2`
Production:

**Note**: The admin account is the `Owner` of the smart contract, and it's currently set as the primary account on our [AWS-hosted node](https://github.com/CognizantStudio/ethereum-testnet-node). Only one `Owner` is allowed. It can be transferred either by interacting with the `Ownable` contract or, maybe more simply, by redeploying the LD contract (keep in mind this will not fork the contract's state, but create an entirely new instance).

The admin is responsible for maintaining the list of `authorizedAddresses`, which is used to authorize requests to access the LD.

Since the `Owner` account is associated with the node that will facilitate both our Responder app and our VRS(es), this functionality can be accessed from either; it will need more thought post-MVP, though.

### The following functions are implemented here for interacting with the Lookup Directory's smart contract:

* **queryLookup**:
  * Parameters: GTIN (integer)
  * Context: This function will be called by VRSes when they need to route a verification request.
  * Example: `LookupDirectory.queryLookup(11111)`

* **addValidAddress**:
  * Parameters: Address (hex string)
  * Context: An admin can use this to authorize an Ethereum account to interact with the LD.
  * Example: `LookupDirectory.addValidAddress("0x0")`
  
* **removeValidAddress**:
  * Parameters: Address (hex string)
  * Context: An admin can use this to deauthorize an Ethereum account and block their access to the LD.
  * Example: `LookupDirectory.removeValidAddress("0x0")`


### To deploy a new contract to the blockchain 
- must deploy to the Rinkeby test network to work with the AWS node
- contract must be the same as is in the `contracts` folder!!!
  - If you change the contract you deploy - be sure to also change the abi

1. Must have metamask installed and set up with a `Rinkeby` account and test ether
2. Go to the Remix editor @ `remix.ethereum.org`
3. Copy and paste `contracts/LookupDirectory.sol` and `contracts/Ownable.sol` into separate windows in the Remix editor
4. In the `Compile` tab on the right - make sure there are no compiler errors
5. Click the `Run` tab on the right and make sure that `LookupDirectory` is selected in the dropdown
6. Click `Create`
7. Click `Submit` in the Metamask window that should pop up
8. Wait for transaction to be mined (~30seconds) and grab the contract address
