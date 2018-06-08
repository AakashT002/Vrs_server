const Router = require('restify-router').Router;
const CompaniesRouter = new Router('companies');
const constants = require('../constants');
const models = require('../database/models');
const sequelize = require('../database/models/index').sequelize;

// Route definition
CompaniesRouter.get('/companies', getAllCompanies);
CompaniesRouter.post('/create/company', createCompany);
CompaniesRouter.put('/update/company/:companyId', UpdateCompany);
CompaniesRouter.del('/delete/company/:companyId', deleteCompany);

// Route implementation
function createCompany(req, res) {
  console.log("body ", req.body);
  console.log(req.body.id);
  models.companies
    .create({
      id: req.body.id,
      Name: req.body.Name,
      City: req.body.City,
      State: req.body.State
    })
    .then(function (company, err) {
      if (err) {
        res.send(400, { error: 'Unable to create company' })
      }
      else {
        var data = {
          error: "false",
          message: "New company created successfully",
          data: company
        };

        res.send(data);
      }
    });
}

function deleteCompany(req,res){
  console.log(req.params.companyId)
  models.companies.destroy({
      where: {
          id: req.params.companyId,
      }
  }).then(function(company) {
      var data = {
          error: "false",
          message: "Deleted company successfully",
          data: company
      };
      res.send(data);
  });
}

function UpdateCompany(req, res) {
  console.log("params ",req.params.companyId)
  models.companies
    .find({
      where:
      {
        id: req.params.companyId
      }
    }
    )
    .then(function (company) {
      console.log(req.body)
      if (company) {
        company.update({
          // companyId: req.body.companyId,
          Name: req.body.Name,
          City: req.body.City,
          State: req.body.State
        })
          .then(function (company, err) {
            if (err) {
              res.send(400, { error: 'Unable to update company' })
            }
            else {
              var data = {
                error: "false",
                message: "company updated successfully",
                data: company
              };
              res.send(data);
            }
          });
      }
      else {
        res.send(404, { message: 'company not found' });
      }
    })
}

function getAllCompanies(req, res) {
  models.companies.findAll({
    // where: {
    //   Name: {
    //     [sequelize.Op.like]: 'C%i'
    //   }
    // City:{
    //   [sequelize.Op.like]: 'P%'
    // } 
    // },
    include:
      [
        {
          model: models.employees,
        }
      ]
    // order: [
    // 	[{ model: models.events }, 'eventTime', 'DESC'], ['requestSentTime', 'DESC']
    // ]
  }).then(function (companies, err) {
    if (err) {
      res.send(400, { error: 'Unable to find companies' });
    }
    if (companies != null) {
      res.json({ result: companies });
    } else {
      res.send(400, { error: 'Unable to find companies' });
    }
  });
}

module.exports = CompaniesRouter;