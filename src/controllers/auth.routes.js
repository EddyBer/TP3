const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');
const { body, validationResult } = require('express-validator');

router.post('/login', body('firstName').isLength({ min: 1 }), body('password').isLength({ min: 1 }), (req, res) => {
  const { firstName, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = userRepository.getUserByFirstName(firstName);
  console.log(user)
  console.log( password, user.password)
  if (!user || password !== "admin") {
    res.status(401).send('Unauthorized');

    return;
  }

  const token = generateAuthToken(user.id, user.firstName, user.roles);

  res.json({ token });
});

exports.initializeRoutes = () => router;
