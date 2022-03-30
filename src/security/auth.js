const { sign } = require('jsonwebtoken');

exports.generateAuthToken = (userId, firstName, roles) => {
  return sign(
    { userId, firstName, roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
