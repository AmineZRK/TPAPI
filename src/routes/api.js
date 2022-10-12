const express = require('express');
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const fileUpload = require('../utils/fileUpload');
const router = express.Router();

router.post('/create-user', UserController.createUser);
router.post('/create',UserController.createUser);
router.get('/all-user', UserController.allUser);
router.get('/single-user/:id', UserController.singleUser);
router.post('/update-user/:id', fileUpload("./storage/images"), UserController.updateUser);
router.delete('/delete-user/:id',  UserController.deleteUser);
router.post('/create-book',fileUpload("./storage/images"), BookController.createBook);

module.exports = router;