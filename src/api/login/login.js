const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../../database/auth-db');

async function loginUser(request, h) {
  const { username, password } = request.payload;

  // Check if the user exists in the database
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return h.response('Invalid username or password').code(401);
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return h.response('Invalid username or password').code(401);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, 'your_secret_key');

    return { token };
  } catch (error) {
    return h.response(error.message).code(500);
  }
}

module.exports = loginUser;
