'use strict';

const env = process.env.NODE_ENV;
const dotenv = require('dotenv');
if (env) {
	dotenv.config();
} else {
	dotenv.config({ path: './.env.sample' });
}
var url = 'http://localhost:' + (process.env.PORT || 3000);

module.exports.url = url;
