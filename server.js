const restify = require('restify');
const env = process.env.NODE_ENV || 'development';
const amqplib = require('amqplib');
const dotenv = require('dotenv');
const corsMiddleWare = require('restify-cors-middleware');
const assetRouter = require('./routes/asset');
const userRouter = require('./routes/users');
const productRouter = require('./routes/products');
const verificationsRouter = require('./routes/verifications');
const constants = require('./constants');
const models = require('./database/models');
const tokenHandler = require('./utils/tokenHandler');
const LookupService = require('./services/LookupService');

if (env === 'development') {
	dotenv.config({ path: './.env.sample' });
} else {
	dotenv.config();
}

let open = amqplib.connect(process.env.CLOUDAMQP_URL);

// Server creation
const port = normalizePort(process.env.PORT || 3000);
var server = restify.createServer({
	name: 'VRS Requestor Services'
});

server.use(function(req, res, next) {
	req.serverObj = server;
	req.port = port;
	next();
});

const cors = corsMiddleWare({
	allowHeaders: ['Authorization'],
	exposeHeaders: ['Authorization']
});

/**
 * Common Middle functions
 * Checks for Authorization header for protected urls.
 * Checks for db connection.
 */
server.use(function (req, res, next) {
	if (req.headers.authorization === undefined || !req.headers.authorization.startsWith('Bearer ')) {
		return next(new restify.errors.UnauthorizedError('Failed to authenticate/authorize'));
	} else {
		tokenHandler.setToken(req.headers.authorization);
		models.sequelize.authenticate()
			.then(res => {
				next();
			})
			.catch(err => {
				console.error('Unable to connect to the database :', err);
				next(new restify.errors.InternalError('Unable to connect to the database'));
			});
	}
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

// Routes
server.get('/', function (req, res, next) {
	console.log('before pubsub');		
 	bayeaux.attach(server);		
 	bayeaux.getClient().publish('/messages', {		
 		text: 'Hello world on heroku'		
 	});		
 	server.listen(port);		
 	console.log('after pubsub');	
	res.send(200, server.name);
	next();
});

assetRouter.applyRoutes(server, constants.API_PREFIX);
userRouter.applyRoutes(server, constants.API_PREFIX);
verificationsRouter.applyRoutes(server, constants.API_PREFIX);

// Server start
server.listen(port, async function () {
	console.log('Service API running at ' + port);
	models.users.hasMany(models.verifications);
	models.verifications.belongsTo(models.users);
	models.verifications.hasMany(models.events);
	models.events.belongsTo(models.verifications);
	console.log('Model associations completed.');	
	
	var queue = process.env.LD_QUEUE;
	open.then(function (conn) {
		var ok = conn.createChannel();
		ok = ok.then(function (ch) {
			ch.assertQueue(queue);
			ch.consume(queue, async function (msg) {
				if (msg !== null) {
					var msgObj = JSON.parse(msg.content.toString());
					var gtin = msgObj.gtin;
					if (msgObj.changeType === constants.ADD) {
						var ciFromQueue = {
							endpoint: msgObj.endPoint,
							requestType: constants.CI_TYPE_REST_ENDPOINT,
							entityType: constants.ENTITY_TYPE_MANUFACTURER,
							entityId: msgObj.responderId
						};
						var ciForOtherVRS = {
							endpoint: process.env.VRS_ENDPOINT,
							requestType: constants.CI_TYPE_REST_ENDPOINT,
							entityType: constants.ENTITY_TYPE_VRS_PROVIDER,
							entityId: process.env.VRS_PROVIDER_ID
						};
						try {
							await LookupService.setLookup(`${gtin}::${process.env.VRS_PROVIDER_ID}`, ciFromQueue);
							await LookupService.setLookup(`${gtin}::${process.env.OTHER_VRS_PROVIDER}`, ciForOtherVRS);
						} catch (err) {
						}
					} else if (msgObj.changeType === constants.DELETE) {
						try {
							await LookupService.removeLookup(`${gtin}::CognizantVRS`);
							await LookupService.removeLookup(`${gtin}::OtherVRS`);
						} catch (err) {
						}
					}
					ch.ack(msg);
				}
			});
		});
		return ok;
	}).then(null, console.warn);
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	if (error.code === 'EACCES') {
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
	} else if (error.code === 'EADDRINUSE') {
		console.error(bind + ' is already in use');
		process.exit(1);
	} else {
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	console.log('Listening on ' + bind);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}

