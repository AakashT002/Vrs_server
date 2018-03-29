const flatten = require('flat');

module.exports = {
	getResolvedString: function (str, obj) {
		try {
			const flatObj = flatten(obj);
			const regex = str.match(/(\{.+?\})/g);
			for (var i = 0, len = regex.length; i < len; i++) {
				var prop = regex[i].replace(/\{(.+)\}/, '$1');
				if (flatObj[prop]) {
					str = str.replace(regex[i], flatObj[prop]);
				}
			}
			return str;
		} catch (err) {
			return str;
		}
	}
};
