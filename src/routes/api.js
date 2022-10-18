const express = require('express');
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const fileUpload = require('../utils/fileUpload');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.post('/create-user', UserController.createUser);
router.post('/login',UserController.login);
router.get('/all-user', UserController.allUser);
router.get('/single-user/:id', UserController.singleUser);
router.post('/update-user', auth, UserController.updateUser);
router.delete('/delete-user',auth,  UserController.deleteUser);
router.post('/create-book',fileUpload("./storage/images"), BookController.createBook);
router.get('/all-book', BookController.allBook);
router.get('/single-book/:id', BookController.singleBook);
router.delete('/delete-book/:id',auth,  BookController.deleteBook);
router.put('/add-review',auth,BookController.addReview)
module.exports = router;