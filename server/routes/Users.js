const express= require('express');
const users = express.Router();
const control = require('../controller/Users');



users.post('/register', (req,res) =>{
    control.registerUser(req,res);
});

users.post('/login', (req,res)=> {
    control.loginUser(req,res);
});

users.get('/logout/:email', (req,res)=> {
    control.logoutUser(req,res);
});

users.get('/', (req,res)=> {
    control.getAllUsers(req,res);
});

users.get('/:userId', (req,res)=> {
    control.getUserById(req,res);
});


module.exports =users;