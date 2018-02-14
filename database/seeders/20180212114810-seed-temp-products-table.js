'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('temp_products', [
			{
				responderId: 'pfizer',
				gtin: '10350881006602',
				srn: '12345678904321',
				lot: 'ABC1234',
				expDate: '20190321',
				productName: 'Jakafi 60 ct bottle'
			},
			{
				responderId: 'pfizer',
				gtin: '10350881006602',
				srn: '13268255316404',
				lot: 'ABC1234',
				expDate: '20190321',
				productName: 'Jakafi 60 ct bottle'
			},
			{
				responderId: 'pfizer',
				gtin: '10505801235015',
				srn: '25232489721847',
				lot: 'FSCNPPF',
				expDate: '20220131',
				productName: 'Tyelnol 160 mg/5mL'
			},
			{
				responderId: 'pfizer',
				gtin: '10350881006602',
				srn: '85914347768557',
				lot: 'ABC1234',
				expDate: '20190321',
				productName: 'Tyelnol 160 mg/5mL'
			},
			{
				responderId: 'pfizer',
				gtin: '30367534281200',
				srn: '54804001677517',
				lot: 'O076TK2',
				expDate: '20170415',
				productName: 'Viagra 100mg'
			},
			{
				responderId: 'pfizer',
				gtin: '40311122334565',
				srn: '3796912855039',
				lot: 'O076TK2',
				expDate: '20180629',
				productName: 'Asprin 500mg'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('temp_products', null, {});
	}
};
