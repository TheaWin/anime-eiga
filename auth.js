const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); //Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user,jwtSecret, {
    subject: user.username, //This is the username you're encoding in the JWT
    expiresIn: '7d', //specifies that the token will expire in 7 days
    algorithm: 'HS256' // used to 'sign' or encode the values of the JWT
  });
};

/* POST login. */
module.exports =(router) => {
  /**
   * User login
   * 
   * @function
   * @method POST
   * @name login
   * @param {object} req - The request body containing user credentials.
   * @param {string} req.username - The username of the user trying to log in.
   * @param {string} req.password - The password of the user trying to log in.
   * @param {object/error} res - Returns
   * @returns {object} 200 - The user object and JWT token if login is successful.
   * @returns {object} 400 - Error message if login fails.
   * @returns {Error} 500 - Internal Server Error
   * 
   * @example
   * // Example URL request:
   * GET http://localhost:8080/login
   * 
   * @example
   * // Example request
   * {
   *  "username": "user123",
   *  "password": 'pass123"
   * }
   * 
   * @example
   * // Example response
   * {{
   *  "user": {
   *    "_id": "66cd4597cc1745afe19c0c9a",
   *    "username": "user123",
   *    "name": "John Doe",
   *    "password": "$2b$10$eB4FcL5yFz5LEgFQu0UGHOHWFqlGMuVuFISIwBSkokDnpnCF79e8S",
   *    "email": "test@gmail.com",
   *    "birthday": "2000-08-08T00:00:00.000Z",
   *    "favoriteMovies": [],
   *    "__v": 0
   *  },
   *  "token": "eyJhbGciOiJIUzI1NiIsInR5cC..." 
   * }
   * @example
   * //Example error response
   * {
   *  "message": "Something is not right",
   *  "user": null
   * }
   */
  router.post('/login', (req,res) => {
    passport.authenticate('local', {session:false}, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, {session:false}, (error) => {
        if(error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({user, token});
      });
    }) (req,res);
  });
};