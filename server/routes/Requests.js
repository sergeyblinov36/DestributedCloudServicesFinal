const express= require('express');
const cors = require('cors');
const requests = express.Router();
const control = require('../controller/Requests');
const verify = require('../config/verifyToken');

//Most are private routs

requests.post('/',verify, (req,res)=> {
    control.craeteRequst(req,res);
});

//remove by request id
requests.delete('/:requestId',verify, (req,res)=>{
    control.deleteOneRequsts(req,res);
});

//remove by user id
requests.delete('/user/:requestId',verify, (req,res)=>{
    control.deleteOneRequsts(req,res);
});

requests.delete('/',verify, (req,res)=>{
    control.deleteAllRequsts(req,res);
});

requests.put('/:requestId',verify, (req,res)=>{
    control.updetOneRequsts(req,res);
});

requests.get('/',verify, (req,res)=> {
    control.getMyRequsts(req,res);
});

requests.get('/all', (req,res)=> {
    control.getAllRequsts(req,res);
});

//by id of the requst
requests.get('/:requestId', (req,res) =>{
    control.getRequstsById(req,res);
});

//by id of user
requests.get('/user/:userId', (req,res) =>{
    control.getRequstsByUserId(req,res);
});

//by id of apartment
requests.get('/apartment/:apartmntId', (req,res) =>{
    control.getRequstsByApartment(req,res);
});

//by id of owner of apartment
requests.get('/owner/:ownerId',verify, (req,res) =>{
    control.getRequstsByOwner(req,res);
});



module.exports =requests;