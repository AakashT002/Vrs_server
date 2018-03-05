const jwt = require('jsonwebtoken');

module.exports = {
	decodedToken: null,
	setToken: function(token) {
		var token = token.replace('Bearer ', '');
		decodedToken= jwt.decode(token);
	},
	getUserName: function() {
		return decodedToken.preferred_username;
	},
	getRoles: function() {
		return decodedToken.realm_access.roles;
	},
	isReturnSpecialist: function() {
	  var userRoles= this.getRoles();
		for(var role in userRoles) {
			if((userRoles[role]==='returnSpecialist')) {
				return true;
			}
		}
		return false;
	} 
};