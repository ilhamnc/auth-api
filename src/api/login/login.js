const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('@hapi/jwt');
const Joi = require('@hapi/joi');
const config = require('../../config/config');

// Membuat koneksi database
const connection = mysql.createConnection(config.development);

// Handler untuk endpoint login
const loginHandler = async (request, h) => {
    const { email, password } = request.payload;
  
    // Validasi input menggunakan Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(request.payload);
    if (error) {
      return h.response({ message: error.details[0].message }).code(400);
    }
  
    // Query untuk mencari data user berdasarkan email
    const query = `SELECT * FROM users WHERE email='${email}'`;
  
    return new Promise((resolve, reject) => {
      connection.query(query, async (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve({ message: 'Email atau password salah' });
          } else {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
              const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
              resolve({ token });
            } else {
              resolve({ message: 'Email atau password salah' });
            }
          }
        }
      });
    });
};

module.exports = loginHandler;
