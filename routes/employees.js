const Router = require('restify-router').Router;
const EmployeesRouter = new Router('companies');
const constants = require('../constants');
const models = require('../database/models');
const sequelize = require('../database/models/index').sequelize;

// Route definition
EmployeesRouter.get('/employees', getAllEmployees);
EmployeesRouter.post('/create/employee', createEmployee);
EmployeesRouter.put('/update/employee/:employeeId/company/:companyId', UpdateEmployee);
EmployeesRouter.del('/delete/employee/:employeeId/company/:companyId', deleteEmployee);

// Route implementation
function createEmployee(req, res) {
  console.log("body ", req.body);
  console.log(req.body.id);
  models.employees
    .create({
      companyId: req.body.companyId,
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    })
    .then(function (employee, err) {
      if (err) {
        res.send(400, { error: 'Unable to create emplyee' })
      }
      else {
        var data = {
          error: "false",
          message: "New employee created successfully",
          data: employee
        };

        res.send(data);
      }
    });
}

function UpdateEmployee(req, res) {
  console.log("body ",req.body)
  models.employees
    .find({
      where:
      {
        id: req.params.employeeId,
        companyId: req.params.companyId
      }
    }
    )
    .then(function (employee) {
      if (employee) {
      employee.update({
          // companyId: req.body.companyId,
          // id: req.body.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        })
          .then(function (employee, err) {
            if (err) {
              res.send(400, { error: 'Unable to update employee' })
            }
            else {
              var data = {
                error: "false",
                message: "employee updated successfully",
                data: employee
              };
              res.send(data);
            }
          });
      }
      else {
        res.send(404, {message: 'employee not found'});
      }
    })
}

function deleteEmployee(req,res){
  models.employees.destroy({
      where: {
          id: req.params.employeeId,
          companyId: req.params.companyId
      }
  }).then(function(employee) {
      var data = {
          error: "false",
          message: "Deleted employee successfully",
          data: employee
      };
      res.send(data);
  });
}

function getAllEmployees(req, res) {
  models.employees.findAll({
    // where: {
    //   companyId: {
    //     [sequelize.Op.or]: [1, 2]
    //   }
    // }
    // include:
    //   [
    //     {
    //       model: models.employees,
    //     }
    //   ]
    // order: [
    // 	[{ model: models.events }, 'eventTime', 'DESC'], ['requestSentTime', 'DESC']
    // ]
  }).then(function (empolyees, err) {
    if (err) {
      res.send(400, { error: 'Unable to find empolyees' });
    }
    if (empolyees != null) {
      res.json({ result: empolyees });
    } else {
      res.send(400, { error: 'Unable to find empolyees' });
    }
  });
}

module.exports = EmployeesRouter;