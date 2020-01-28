const express= require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User =require('../models/Users');
const Apartments =require('../models/Apartments');
const Requests =require('../models/Requests');

const gravatar =require('gravatar');
const {regisrerValidation , loginValidation}  = require('../valdition');


class UserController {
    static async registerUser(req,res){
        try{
            //Validat the data befor create a user
            const {error} =  regisrerValidation(req.body);
            if(error)
                return res.status(400).send(error.details[0].message);

            //Chacking if all form is filed
            if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.password || !req.body.role) throw {
                status: 400,
                message: 'Missing Information try again'
            };

            //Chacking if the user is alrdy in the DB
            const emailExist = await User.findOne({email: req.body.email});
            if(emailExist)
                return res.status(402).send('Email allrady exists');


            //Hash the password using packag bycritjs   
            const salt = await bcrypt.genSalt(10);  // it creats a diffrant pass from whats the user enterd
            const hashPass = await bcrypt.hash(req.body.password, salt);  // hassPass contins the reall password of the user  

            //Create avater for poto:
            const avatar= gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            //Create a new user
            const today=new Date()
            let userData = new User({ 
                _id: new mongoose.Types.ObjectId(),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password:hashPass,
                avatar ,
                role: req.body.role,
                created: today
            });

            if(userData){
                const saveUser = await userData.save();
                res.status(200).send({
                    message: 'User registered',
                    User: saveUser
                });

            } 
            else  res.status(401).send({message: 'Something went wrong whit creating the user'});
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async loginUser(req,res){
        try{
            //Validat the data befor create a user
           const {error} =  loginValidation(req.body);
            if(error)
               return res.status(400).send({ message: error.details[0].message});
           
            //Chack if all form is filed
           if (!req.body.email || !req.body.password) throw {
                status: 400,
                message: 'Missing Information try again'
           };

            //Chack if email exists in DB
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return res.status(404).send({message:'Email is not found'});
            }
            //Chack password is corect     
            const validPass = await bcrypt.compare(req.body.password, user.password); //comparimg this.user to the data.psss
           if(!validPass) return res.status(400).send({message:'Invalid Password'});
           
            //sign the token for paivet routs 
            const token =jwt.sign({_id: user._id , role: user.role} , process.env.TOKEN_SECRET);

            //if user(owner) have apartment array  with id so show details
            if(user.apartmnts && user.apartmnts.length > 0 ){
                User.populate('apartmnts', 'address city'); //only show address,city.
            }

            res.status(200).header('user-token', token).send({
                message: 'Logdin seccsfully',
                User: user,
                token: token
            });   
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async logoutUser(req,res){
        try{
            //Chack if user exist in DB
            const usrExist= await User.findOne({email: req.params.email});
            if(!user){
                return res.status(404).send({message:'User is not found'});
            }
            //Logout
            res.status(200).send({
                message: 'User logout'
            })
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getAllUsers(req,res){ 
        try{
            const Exist= await User.find({});
            if (!Exist){
                return res.status(404).send({message:'Users not found'});
            }
            else  
                return res.status(200).send({
                    message:'All Users', 
                    users: Exist
                });
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };        
    }

    static async getUserById(req,res){ 
        try{
            const Exist= await User.findOne({_id: req.params.userId});
            if (!Exist){
                return res.status(404).send({message:'User not found'});
            }
            else  
                return res.status(200).send({
                    message:'All Users', 
                    users: Exist
                });
        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };        
    }

}

module.exports = UserController;

