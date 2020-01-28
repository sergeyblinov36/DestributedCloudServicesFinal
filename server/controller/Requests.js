const express= require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const Apartment =require('../models/Apartments');
const User =require('../models/Users');
const Requests =require('../models/Requests');

const {craeteRequestsValidation}  = require('../valdition');


class requstController {

    static async craeteRequst(req,res){
        try{
            //validat the data befor create
            //const {error} =  craeteRequestsValidation(req.body);
            //if(error)
            //    return res.status(404).send(error.details[0].message);

            //chacking if the requst from req.user._id is alrdy send
            const requestExist = await Requests.findOne({sending: req.user._id ,resiving:req.body.resiving, purpose:req.body.purpose});
            if(requestExist && ((req.body.purpose) != "reply") ) //becouse if it reply i want to allow to sent more then once 
              return res.status(404).send({message:'Requst has allrady been made by that topic to this user, cant sent agin'});

 
            //Chack both usres exists and Not the same
            const user1Exist = await User.findById(req.user._id);
            const user2Exist = await User.findById(req.body.resiving);
            if((!user1Exist || !user2Exist)) 
               return res.status(404).send({message: 'Users not found'});
            if(String(user1Exist)==String(user2Exist)) 
                return res.status(402).send({message: 'Users cant himself'});
  
            if(user1Exist && user2Exist) { //when both exist:
                //create a new requst
                const today=new Date()
                let requstData = new Requests({ 
                    _id: new mongoose.Types.ObjectId(),
                    sending: req.user._id,
                    resiving: req.body.resiving,
                    purpose: req.body.purpose,
                    text: req.body.text,
                    status: req.body.status,
                    apartmnt :req.body.apartmnt,
                    created: today
                });

                if(requstData){
                    //save it in array requsts in Apartment collectin:
                    const apartmentReq =await Apartment.findById({_id: req.body.apartmnt});

                            
                    //save the requst
                    console.log(req.body.apartmnt);
                    console.log(apartmentReq);
                    const saveRequst= await requstData.save().then(t => t.populate('sending resiving', 'first_name last_name').execPopulate()) //(from stack overflow!!!!)
                    console.log(req.body.apartmnt);
                    console.log(apartmentReq);

                    apartmentReq.requsts.unshift({requestIdd: req.body.resiving} );  //need fixing 
                    apartmentReq.save();

                    res.status(200).send({
                        message: 'Requst created Sucssfly',
                         requst: saveRequst
                    });
                }else res.status(402).send({message: 'Something went wrong craetig requst'});
            } 
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async deleteAllRequsts(req,res){
        try{
            const request = await Requests.findById(req.user._id);
            if (!request) {
                res.status(404).send({message: 'Request not found'});
            } else {
                const remov= await Requests.remove({_id: req.user._id })
                res.status(200).send({
                    message: 'All users Request removed sucssfuly',
                    removed: remov
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async deleteOneRequsts(req,res){
        try{
            const request = await Requests.findById(req.user._id);
            if (!request) {
                res.status(404).send({message: 'Request not found'});
            } else {
                const remov= await Requests.remove({_id: req.user._id })
                res.status(200).send({
                    message: 'All users Request removed sucssfuly',
                    removed: remov
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getAllRequsts(req,res){
        try{
             const allRequsts = await Requests.find().populate('sending resiving apartmnt', 'first_name last_name address city');; //get the details owner    
            if (!allRequsts) {
                res.status(404).json({message: 'Requsts not found'});
            } else {
                res.status(200).send({
                    message: 'All Requests found',
                    allRequsts: allRequsts
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getMyRequsts(req,res){
        try{
             const allRequsts = await Requests.findById(req.user._id).populate('sending resiving apartmnt', 'first_name last_name address city');; //get the details owner    
            if (!allRequsts) {
                res.status(404).json({message: 'Requsts not found'});
            } else {
                res.status(200).send({
                    message: 'User Requests found',
                    allRequsts: allRequsts
                })
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getRequstsById(req,res){
        try{
            const request = await Requests.findById(req.params.requestId).populate('sending resiving', 'first_name last_name')
            if(!request)
                return res.status(404).send({
                    message: 'Request not found',
                })
            else 
                return res.status(200).send({
                message: 'Requests found sucssfuly',
                requests: request
               })
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getRequstsByUserId(req,res){
        try{
            const request = await Requests.find({resiving: req.params.userId}).populate('sending resiving', 'first_name last_name');
            if(!request)
                return res.status(404).send({
                    message: 'Request not found by the user',
                })
            else 
                return res.status(200).send({
                message: 'Users Requests found sucssfuly',
                requests: request
               })
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getRequstsByApartment(req,res){
        try{
            const request = await Requests.find({apartmnt: req.params.apartmntId}).populate('sending resiving apartmnt', 'first_name last_name address city price')
            if(!request)
                return res.status(404).send({
                    message: 'Request not found'
                })
            else 
                return res.status(200).send({
                message: 'Requests to Apartment found sucssfuly',
                requests: request
               })
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async getRequstsByOwner(req,res){
        try{
            if(req.params.ownerId !== req.user._id)
                return res.status(400).send({message: 'No Acsses , for owners only'});
            const request = await Requests.find({sending: req.params.ownerId}).populate('sending resiving apartmnt', 'first_name last_name address city');
            if(!request)
                return res.status(404).send({
                    message: 'Request not',
                })
            else 
                return res.status(200).send({
                message: 'User Requests found sucssfuly',
                requests: request
               })
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async updetOneRequsts(req,res){
        try{
           //if login user is not the sender of the requst so can only chang stutuse 
           const request = await Requests.findById(req.params.requestId)
           if (!request)
               return res.status(404).send({message: 'request not found'});
           if (String(request.sending) !== String(req.user._id)) {//make it to string only to make sure it same type
                const apartmentFileds = {};
                if(req.body.status) apartmentFileds.status=req.body.status;

                //choose not to delete the requst and only chang param 
   
                //Make sure cant chang a requst thet allrdy repled to:
                if(String(request.status) == 'reply'){
                    return res.status(404).send({message: 'this requst ended'});
                }

                //Allso sent requst to the sending the updete
                const requstBack =new Requests({
                    _id: new mongoose.Types.ObjectId(),
                    apartmnt:request.apartmnt,
                    sending: req.user._id,
                    resiving: request.sending, //now the resive to the sender a reply
                    purpose: 'reply',
                    status: req.body.status
                });
                console.log(requstBack)
                //save in DB the requst
                await requstBack.save().then(t => t.populate('sending resiving', 'first_name last_name').execPopulate())            

                //Update 
                const upadt= await Requests.findOneAndUpdate({_id: req.params.requestId} , {$set: apartmentFileds}, {new: true}).populate('sending resiving', 'first_name last_name');
                if(upadt)
                return res.status(200).send({message: 'User requst updated' , Update: upadt });  
            
            }else
                return res.status(402).send({message: 'cant updete the a requst allrady sended'});
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    
}

module.exports = requstController;
