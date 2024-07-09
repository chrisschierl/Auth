import asyncHandler from 'express-async-handler';
import User from '../../models/auth/userModel.js';
import generateToken from '../../helpers/generateToken.js';
import bcrypt from 'bcrypt';

export const registerUser = asyncHandler (async (req, res) => {
  const {name, email, password} = req.body;

  // validation
  if (!name || !email || !password) {
    // 400 Bad Request
    res.status (400).json ({message: 'Fülle alle Felder aus!'});
  }

  // Check Passwort länge
  if (password.length < 8) {
    return res
      .status (400)
      .json ({message: 'Passwort muss min. 8 Zeichen haben!'});
  }

  // Check ob User existiert
  const userExists = await User.findOne ({email});

  if (userExists) {
    // Bad Request
    return res.status (400).json ({message: 'Account existiert bereits!'});
  }

  // create new user
  const user = await User.create ({
    name,
    email,
    password,
  });

  // generate token with ID
  const token = generateToken (user._id);

  // send back user and token to client
  res.cookie ('token', token, {
    path: '/',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
    sameSite: true,
    secure: true,
  });

  if (user) {
    const {_id, name, email, role, photo, bio, isVerified} = user;

    // 201 Created
    res.status (201).json ({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status (400);
    throw new Error ('Fehler beim Erstellen des Users!');
  }
});

// User Login

export const loginUser = asyncHandler (async (req, res) => {
  // Get Email/Password from req.body
  const {email, password} = req.body;

  // Validation
  if (!email || !password) {
    return res
    .status (400)
    .json ({message: 'Füge deine Email und Passwort hinzu'});
  }

  // check if user exists
  const userExists = await User.findOne ({email});
  if (!userExists) {
    return res
    .status (404)
    .json ({message: 'Dieser Account existiert nicht!'});
  }
  // Check ob Passwort übereinstimmt mit der Datenbank
  const isMatch = await bcrypt.compare (password, userExists.password);

  if (!isMatch) {
    return res
    .status (401)
    .json ({message: 'Falsches Passwort!'});
  }

  // generate token with ID
  const token = generateToken (userExists._id);

  if (userExists && isMatch) {
    const {_id, name, email, role, photo, bio, isVerified} = userExists;

    // set the token in the cookie
    res.cookie ('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
      sameSite: true,
      secure: true,
    });

    // send back user and token to client
    res.status (200).json ({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res
    .status (400)
    .json ({message: 'Fehler beim Einloggen!'});
  }
});

// logout user

export const logoutUser = asyncHandler (async (req, res) => {
  res.clearCookie ('token');
  res.status (200).json ({message: 'Dein Account wurde abgemeldet'});
});