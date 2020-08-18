const Candidates = require('./../modle/candidate-modle');
const mongoose = require('mongoose');
const catchAsync = require('./../util/catchAsync');
const apierror = require('./../util/global-error');
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/user-image');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});
const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new apierror('invalid file type', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerfilter });
exports.uploadfile = upload.single('photo');
exports.makeCandidate = catchAsync(async (req, res, next) => {
  let data = await Candidates.create(req.body);
  res.status(201).json({
    status: 'success',
    data,
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  let query = Candidates.find();
  let arr = ['select', 'limit', 'page', 'sort'];
  let body = { ...req.query };
  arr.forEach((el) => delete body[el]);
  body = JSON.stringify(body);
  body = body.replace(/\b(gt|lt|lte|gte)\b/g, (match) => `$${match}`);
  body = JSON.parse(body);
  query = query.find(body);
  if (req.query.sort) {
    sortList = req.query.sort.split(',').join(' ');
    query = query.sort(sortList);
  }
  if (req.query.select) {
    sortList = req.query.select.split(',').join(' ');
    query = query.select(sortList);
  } else {
    query.select('-__v');
  }
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || 10;

  let skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  let users = await query;
  res.status(200).json({
    status: 'success',
    data: users,
  });
});
exports.specificCandidate = catchAsync(async (req, res, next) => {
  let user = await Candidates.findById(req.params.id);
  if (!user) return next(new apierror('no such user exist', 400));
  res.status(200).json({
    status: 'success',
    data: user,
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password) delete req.body['password'];
  if (req.body.email) delete req.body['email'];
  if (req.body.role) delete req.body['role'];
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  const data = await Candidates.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ status: 'success', data });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await Candidates.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(new apierror('Incorrect password', 400));
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  await user.save({ validateBeforeSave: true });
  res.status(200).json({
    status: 'success',
    data: user,
  });
});
exports.deleteOne = catchAsync(async (req, res, next) => {
  let user_id = req.params.id;
  let user = await Candidates.findById(user_id);
  if (user.role === 'candidate') {
    await Candidates.deleteMany({ worksFor: mongoose.Types.ObjectId(user_id) });
  }
  await Candidates.findByIdAndDelete(user_id);
  res.status(200).json({ status: 'success' });
});
exports.deleteAll = catchAsync(async (req, res, next) => {
  await Candidates.deleteMany();
  res.status(200).json({ status: 'success' });
});
exports.statsIndividual = catchAsync(async (req, res, next) => {
  let user_id = req.user._id;
  const stats = await Candidates.aggregate([
    { $match: { active: true } },
    { $match: { worksFor: mongoose.Types.ObjectId(user_id) } },
    { $group: { _id: '$role', totalno: { $sum: 1 } } },
  ]);
  console.log(stats);
  res.status(200).json({ status: 'success', data: stats });
});
exports.statsOverall = catchAsync(async (req, res, next) => {
  const stats = await Candidates.aggregate([
    { $match: { active: true } },
    {
      $group: {
        _id: { person: '$worksFor', role: '$role' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.person',
        role: { $push: { role: '$_id.role', count: '$count' } },
      },
    },
  ]);
  console.log(stats);
  res.status(200).json({ status: 'success', data: stats });
});
