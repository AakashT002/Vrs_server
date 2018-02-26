'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('products', [
			{
				responderId: 'Incyte',
				gtin: '10350881006602',
				productName: 'Jakafi 60 ct bottle'
			},
			{
				responderId: 'Walgreens',
				gtin: '10505801235015',
				productName: 'Tyelnol 160 mg/5mL'
			},
			{
				responderId: 'pfizer',
				gtin: '30367534281200',
				productName: 'Viagra 100mg'
			},
			{
				responderId: 'Bayer',
				gtin: '40311122334565',
				productName: 'Asprin 500mg'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('products', null, {});
	}
};
