const { users } = require('./db');
const uuid = require('uuid');
const { generateHashedPassword } = require('../security/crypto');

exports.getUsers = () => {
  return users;
};

exports.getUserByFirstName = (firstName) => {
  const foundUser = users.find((user) => user.firstName == firstName);

  return foundUser;
};

exports.createUser = (body) => {
  const hashedPassword = generateHashedPassword(body.password);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;
  user.roles = ['MEMBER'];

  users.push(user);
};

exports.updateUser = (id, data) => {
  const foundUser = users.find((user) => user.id == id);

  if (!foundUser) {
    throw new Error('User not found');
  }

  foundUser.firstName = data.firstName || foundUser.firstName;
  foundUser.lastName = data.lastName || foundUser.lastName;
  foundUser.password = data.password ? md5(data.password) : foundUser.password;
};

exports.deleteUser = (id) => {
  const userIndex = users.findIndex((user) => user.id == id);

  if (userIndex === -1) {
    throw new Error('User not foud');
  }

  users.splice(userIndex, 1);
}
