const express = require('express');
const auth_controller = require('./../controllers/auth-controller');
const candidate_controller = require('./../controllers/candidate-controler.js');
const view_controller = require('./../controllers/view-controller');
const router = express.Router();
//////////////////////////no authorization////////////////////////////////
router
  .route('/activate/:token')
  .get(auth_controller.activateAccount, view_controller.getVerification);
router.route('/login').post(auth_controller.login);
router.route('/forgetpassword').post(auth_controller.forgetPassword);
router.route('/resetpassword/:token').patch(auth_controller.resetPassword);
router.route('/signup').post(auth_controller.signup);
router.route('/logout').get(auth_controller.logout);
/////////////////////////////////////////////////////////////
router.use(auth_controller.isProtected);
router
  .route('/contestents')
  .post(
    auth_controller.restrictTo(['admin', 'candidate']),
    candidate_controller.makeCandidate
  )
  .get(
    auth_controller.restrictTo(['admin', 'candidate']),
    candidate_controller.getAll
  )
  .patch(candidate_controller.updatePassword)
  .delete(
    auth_controller.restrictTo(['admin']),
    candidate_controller.deleteAll
  );
router
  .route('/contestents/:id')
  .get(
    auth_controller.restrictTo(['admin', 'candidate']),
    candidate_controller.specificCandidate
  )
  .patch(candidate_controller.uploadfile, candidate_controller.updateUser)
  .delete(
    auth_controller.restrictTo(['admin']),
    candidate_controller.deleteOne
  );
router.route('/stats').get(candidate_controller.statsIndividual);
router
  .route('/statsAll')
  .get(
    auth_controller.restrictTo(['admin', 'candidate']),
    candidate_controller.statsOverall
  );
module.exports = router;
