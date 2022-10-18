const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const fs = require('fs');
const DIR = './';

module.exports = class BookController {

  //New book Create
  static createBook = async (req, res) => {
    let payload = req.body;
    console.log(payload);
    //Image check if have then include image into payload
    var imgUrl = "";
    if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
    payload.image = imgUrl;

    try {
      const bookCreate = await new Book(payload).save();
      return res.status(200).json({
        code: 200,
        message: "book Create Successfully",
        data: bookCreate,
      });
    } catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };


  //Single book Information
  static singleBook = async(req, res)=>{
    const id = req.params.id;

    try{
      const singleBookInfo = await Book.findById(id);
      const {title, author, categorie, description,price, isbn,review,nbr_pages,image} =singleBookInfo;
      var getImageName = image.match(/\/([^\/?#]+)[^\/]*$/);

      //return console.log(getImageName);
      
      const singleBookData ={
        title, 
        author, 
        categorie, 
        description,
        price, 
        isbn,
        nbr_pages,
        review,
        imageUrl: `http://localhost:5000/book/${getImageName[1]}`
      }
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: singleBookData,
      });
      //return console.log(singleUserInfo)
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }

  //All User information
  static allBook = async(req, res)=>{
    try{
      const allBookInfo = await Book.find();
      

      //return console.log(singleUserInfo);
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: allBookInfo,
      });
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }

  //add review
  static addReview = async (req, res) => {
    let payload = req.body;

    try {
        if(res.locals.userId){
            const id = payload.bookId
            //console.log(payload.grade, payload.message)
            const BookExist = await Book.findOne({_id: payload.bookId})
            if(BookExist){
                //const reviewCreate = await new Review(payload).save();
                var avis = {UserId: payload.bookId, grade: payload.grade, description: payload.message}
                const updateItem = await Book.findOneAndUpdate( { _id: id }, {$push : {review: avis}});
                console.log(avis)
                return res.status(200).json({
                    code: 200,
                    message: "review Create Successfully",
                    data: updateItem,
                });
            }else{
              res.status(401).json({
                code:401,
                message: "Book not exist",
                error: true,
              })
            }
        
    }else{console.log("no id")}
    } 
    catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };

  //Delete Book by admin
  static deleteBook = async(req, res)=>{
    const id = req.params.id;
    const isAdmin=res.locals.isAdmin;
    const BookExist = await Book.findOne({_id: id})
    try{
        if(isAdmin){
          if(BookExist){
            const userDeleteinfo = await Book.findOneAndDelete({_id: id});
            const {image} = userDeleteinfo
        
            if(image){
              fs.unlinkSync(DIR + image);
            }
            return res.status(200).json({
              code: 200,
              message: "Book Delete Successfully",
              data: userDeleteinfo,
            });
          }else{
            res.status(401).json({
              code: 401,
              message: "Book not exist"
            })
          }
        }else{
          res.status(401).json({
            code: 401,
            message: "you don't have access to delete"
          })
        }
          
        
    }catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }

};