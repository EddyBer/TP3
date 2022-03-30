const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const guard = require('express-jwt-permissions')({
  permissionsProperty: 'roles',
});
const { body, validationResult } = require('express-validator');

const adminRole = 'ADMIN';
const adminOrMemberRoles = [[adminRole], ['MEMBER']];

router.get('/', guard.check(adminOrMemberRoles), (req, res) => {
  res.send(userRepository.getUsers());
});

router.get('/:firstName', guard.check(adminOrMemberRoles), (req, res) => {
  const foundUser = userRepository.getUserByFirstName(req.params.firstName);

  if (!foundUser) {
    throw new Error('User not found');
  }

  res.send(foundUser);
});

router.post('/',body('firstName').isLength({ min: 1 }), body('password').isLength({ min: 8 }), guard.check(adminRole), (req, res) => {
  const existingUser = userRepository.getUserByFirstName(req.body.firstName);

  if (existingUser) {
    throw new Error('Unable to create the user');
  }

  userRepository.createUser(req.body);
  res.status(201).end();
});

router.put('/:id', guard.check(adminRole), (req, res) => {
  userRepository.updateUser(req.params.id, req.body);
  res.status(204).end();
});

router.delete('/:id', guard.check(adminRole), (req, res) => {
  userRepository.deleteUser(req.params.id);
  res.status(204).end();
});

exports.initializeRoutes = () => router;
