'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('temp_products', [
			{
				gtin: '10350881006602',
				srn: '12345678904321',
				lot: 'ABC1234',
				expDate: '20190321'
			},
			{
				gtin: '10350881006602',
				srn: '13268255316404',
				lot: 'ABC1234',
				expDate: '20190321'
			},
			{
				gtin: '10505801235015',
				srn: '25232489721847',
				lot: 'FSCNPPF',
				expDate: '20220131'
			},
			{
				gtin: '10350881006602',
				srn: '85914347768557',
				lot: 'ABC1234',
				expDate: '20190321'
			},
			{
				gtin: '30367534281200',
				srn: '54804001677517',
				lot: 'O076TK2',
				expDate: '20170415'
			},
			{
				gtin: '40311122334565',
				srn: '3796912855039',
				lot: 'O076TK2',
				expDate: '20180629'
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('temp_products', null, {});
	}
};
