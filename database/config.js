module.exports = {
	development: {
		username: 'postgres',
		password: 'password',
		database: 'vrs-dev-db',
		host: '127.0.0.1',
		dialect: 'postgres',
		logging: true
	},
	test: {
		username: 'postgres',
		password: 'password-123',
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
