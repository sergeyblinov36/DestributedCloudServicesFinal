const express= require('express');
const cors = require('cors');
const apartments = express.Router();
const control = require('../controller/Apartments');
const verify = require('../config/verifyToken');


apartments.post('/',verify, (req,res)=> {
    control.craeteApartment(req,res);
});


apartments.put('/:apartmentId',verify, (req,res)=>{
    control.editeApartment2(req,res);
});


apartments.post('/invated/:apartmentId/:userId',verify, (req,res)=>{
    control.invated(req,res);
});

//any users can chang 'usersComing field'
apartments.get('/comingOpen/:apartmentId',verify, (req,res)=>{
    control.comming(req,res);
});

apartments.delete('/:apartmentId', (req,res)=>{ 
    control.deleteApartment(req,res);
});

apartments.get('/', (req,res) =>{ 
    control.getAllApartments(req,res);
});

apartments.get('/:apartmentId', (req,res)=> { //BY APARTMENT ID
    control.getApartmentsById(req,res);
});

apartments.get('/user/:userId', (req,res)=> { 
    control.getApartmentByuser(req,res);
});


apartments.post('/search', (req,res)=>{ 
    control.search(req,res);
});


module.exports =apartments;