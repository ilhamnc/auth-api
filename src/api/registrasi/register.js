const mysql = require('mysql');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const config = require('../../config/config')

// Membuat koneksi database
const connection = mysql.createConnection(config.development);

// Handler untuk endpoint registrasi
const registerHandler = async (request, h) => {
    const { username, email, password } = request.payload;
    
    // Validasi input menggunakan Joi
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });
    const { error } = schema.validate(request.payload);
    if (error) {
        return h.response({ message: error.details[0].message }).code(400);
    }

    // Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Query untuk menyimpan data registrasi ke database
    const query = `INSERT INTO user (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`;
  
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({ message: 'Registrasi berhasil' });
        }
      });
    });
  };
  
  module.exports = registerHandler;