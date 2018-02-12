const flatten = require('flat');

module.exports = {
	isEmpty: function (field) {
		if (field != null && field.length > 0) {
			return false;
		}
		return true;
	}
};
