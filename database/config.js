module.exports = {
	development: {
		username: 'postgres',
		password: 'password',
		database: 'vrs-dev-db',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: false
	},
	test: {
		username: 'postgres',
		password: 'password',
		database: 'vrs-test-db',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: false
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		logging: false
	}
};
