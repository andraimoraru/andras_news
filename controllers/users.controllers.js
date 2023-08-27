const {readAllUsers} = require('../models/users.models')

const getAllUsers = (request, response, next) => {
      const query = request.query;
      readAllUsers()
      .then((users) => {
        return  response.status(200).send({users});
      })
      .catch((err) => {
        next(err);
      });
}

module.exports = {getAllUsers};