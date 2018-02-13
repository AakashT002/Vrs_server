const restify = require('restify');
const env = process.env.NODE_ENV || 'development';
const dotenv = require('dotenv');
const corsMiddleWare = require('restify-cors-middleware');
const userRouter = require('./routes/users');
const verificationsRouter = require('./routes/verifications');
const constants = require('./constants');
const models = require('./database/models');
if (env === 'development') {
	dotenv.config({ path: './.env.sample' });
} else {
	dotenv.config();
}

// Server creation
const port = normalizePort(process.env.PORT || 3000);
var server = restify.createServer({
	name: 'VRS Requestor Services'
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
	res.send(200, server.name);
	next();
});

userRouter.applyRoutes(server, constants.API_PREFIX);
verificationsRouter.applyRoutes(server, constants.API_PREFIX);

// Server start
server.listen(port, function () {
	console.log('Service API running at ' + port);
	models.users.hasMany(models.verifications);
	models.verifications.belongsTo(models.users);
	console.log('Model associations completed.');

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

