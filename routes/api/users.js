const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
// Load User Model
const User = require("../../models/User");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route     GET api/users/test
// @desc      Test Route
// @access    Public
router.get("/test", (req, res) => {
  res.json({
    msg: "users Route is working"
  });
});

// @route     Post api/users/register
// @desc      Test  Route
// @access    Public
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  let email = req.body.email.toLowerCase();
  let username = req.body.username;
  let firstName = req.body.firstName.toLowerCase();
  let lastName = req.body.lastName.toLowerCase();

  let userFromDB = await User.findOne({
    $or: [{ email: email }, { username: username }]
  });

  if (!userFromDB) {
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            const payload = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username
            };
            // Sign The Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 3600
              },
              (err, token) => {
                if (err) {
                  res.json({ success: false });
                } else {
                  res.json({ success: true, token: "Bearer " + token });
                }
              }
            );
          })
          .catch(err => console.log(err));
      });
    });
  } else {
    if (userFromDB.username == username) {
      errors.username = "A user with that username is already registered";
      return res.status(406).json(errors);
    }
    if (userFromDB.email == email) {
      errors.email = "A user with that email address is already registered";
      return res.status(406).json(errors);
    }
  }
});

// @route     POST api/users/login
// @desc      Login User / Return JWT Token
// @access    PUBLIC
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    const emailOrUsername = req.body.emailOrUsername;
    let userFromDB = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });
    if (userFromDB) {
      bcrypt.compare(req.body.password, userFromDB.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          // JWT Payload
          const payload = {
            id: userFromDB.id,
            firstName: userFromDB.firstName,
            lastName: userFromDB.lastName,
            email: userFromDB.email,
            username: userFromDB.username
          };
          // Sign The Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) {
                res.json({ success: false });
              } else {
                res.json({ success: true, token: "Bearer " + token });
              }
            }
          );
        } else {
          errors.password = "Password Incorrect";
          return res.status(400).json(errors);
        }
      });
    } else {
      errors.emailOrUsername = "No user registered with that email or username";
      return res.status(400).json(errors);
    }
  }
});

module.exports = router;
