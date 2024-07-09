import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/auth/userModel.js';

export const protect = expressAsyncHandler (async (req, res, next) => {
  try {
    // check if user is logged in
    const token = req.cookies.token;

    if (!token) {
      // 401 Unauthorized
      return res.status (401).json ({message: 'Du musst angemeldet sein'});
    }

    // verify token
    const decoded = jwt.verify (token, process.env.JWT_SECRET);

    // get user from the token ---> OHNE PASSWORT!
    const user = await User.findById (decoded.id).select("-password");

    // check if user exists
    if (!user) {
        res.status(404).json({message: 'User not found'})
    }

    // set user details in req object
    req.user = user;

    next();
  } catch (error) {
    // 401 Unauthorized
    res.status (401).json ({message: 'Du musst angemeldet sein'});
  }
});


// admin middleware
export const adminMiddleware = expressAsyncHandler (async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // if user is admin continue
    next ();
    return;
  }
  // if not admin send 403 forbidden
  res.status (403).json ({message: 'Nicht berechtigt'});
});
