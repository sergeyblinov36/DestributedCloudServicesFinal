const express= require('express');
const profile = express.Router();
const control = require('../controller/Profile');
const verify = require('../config/verifyToken');

//Most private - user must be login .

profile.get('/',verify, (req,res)=>{
    control.profileUser(req,res);
});

profile.get('/user/:userId', (req,res)=>{
    control.profileUserById(req,res);
});

profile.get('/all/', (req,res)=>{
    control.getAllProfile(req,res);
});

profile.post('/',verify, (req,res)=>{
    control.createProfile(req,res);
});

profile.put('/',verify, (req,res)=>{
    control.updeateProfile(req,res);
});


profile.post('/myRentals/add', verify, (req,res)=>{
    control.myReantalAdd(req,res);
});

profile.delete('/myRentals/deleteOne/:rentId', verify, (req,res)=>{
    control.myReantalDelete(req,res);
});

profile.delete('/deleteUser', verify, (req,res)=>{
    control.Deleteuser(req,res);
});

module.exports =profile;