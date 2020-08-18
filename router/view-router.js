const express = require('express');
const viewcontroller = require('./../controllers/view-controller');
const authcontroller = require('./../controllers/auth-controller');
const router = express.Router();
router
  .route('/EC/mainpage')
  .get(authcontroller.islogin, viewcontroller.getMainPage);
router
  .route('/EC/login')
  .get(
    viewcontroller.somedata,
    authcontroller.islogin,
    viewcontroller.getLoginPage
  );
router.get('/EC/Verify', viewcontroller.getVerification);
router.get('/EC/resetpassword/:token', viewcontroller.resetPassword);
router
  .route('/EC/person/:id')
  .get(
    authcontroller.islogin,
    authcontroller.isProtected,
    viewcontroller.person
  );
router.get(
  '/EC/Myteam/:id',
  authcontroller.islogin,
  authcontroller.isProtected,
  authcontroller.restrictTo(['admin', 'candidate']),
  viewcontroller.getteam,
  viewcontroller.team
);
router.get(
  '/EC/nomination/:id',
  authcontroller.islogin,
  authcontroller.isProtected,
  authcontroller.restrictTo(['admin', 'candidate']),
  viewcontroller.nominationfilling
);
router.get(
  '/EC/post/:post',
  authcontroller.islogin,
  authcontroller.isProtected,
  authcontroller.restrictTo(['admin']),
  viewcontroller.specificpost,
  viewcontroller.post
);
router.get(
  '/EC/posts',
  authcontroller.islogin,
  authcontroller.isProtected,
  authcontroller.restrictTo(['admin']),
  viewcontroller.posts
);
module.exports = router;
