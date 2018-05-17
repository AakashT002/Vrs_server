const faye = require('faye');
var bayeaux = new faye.NodeAdapter({mount: '/faye', timeout:45});

module.exports = {
	bayeaux: async function (serverObj) {
		bayeaux.attach(serverObj);
		return bayeaux;
	}
};