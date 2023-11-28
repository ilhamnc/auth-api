const bcrypt = require('bcrypt');
const connection = require('../../database/auth-db');

async function registerUser(request, h) {
  const { username, password } = request.payload;

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user data into the database
  try {
    const [result] = await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result;
  } catch (error) {
    return h.response(error.message).code(500);
  }
}

module.exports = registerUser;
