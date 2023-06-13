var jwt = require('jsonwebtoken');
const config = require('../config/config');
const { roles } = require('../config/roles');

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      if (req.user.user_type === 'Client') {
        const permission = roles.can(req.user.user_type)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: 'Some Error !!',
          });
        }
      } else {
        const permission = roles
          .can(req.user.userDetails.user_role)
        [action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: 'Some Error !!',
          });
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
exports.checkAuth = (req, res, next) => {
  let token =
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    req.cookies.auth;
  // Express headers are auto converted to lowercase
  if (!!token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  if (!token) {
    return res.status(401).redirect('/login');
  }
  try {
    const decode = jwt.verify(token, config.secret);
    req.user = decode;
    if (!decode) {
      if (req.method !== 'GET') {
        res.send({
          redirect: '/logout',
        });
      }
      return res.redirect('/logout');
    }
    next();
  } catch (error) {
    if (req.method !== 'GET') {
      return res.send({
        redirect: '/logout',
      });
    }
    delete req.decoded;
    return res.status(401).redirect('/logout');
  }
};
