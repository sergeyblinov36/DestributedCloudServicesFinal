const express= require('express');
const mongoose = require('mongoose');
const Apartment =require('../models/Apartments');
const User =require('../models/Users');
const Requests =require('../models/Requests');
const Profile =require('../models/Profile');

const {profileValidation ,addRentValidation}  = require('../valdition');

class ProfileController {
    static async profileUser(req,res){
         try{
             const profile = await Profile.findOne({user: req.user.id}).populate('user', 'first_name avatar');
             if (!profile)
                return res.status(404).send({message: 'Profile not found for this user'});  
        
            return res.status(200).send({message: 'Profile found' , Profile: profile });  
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async profileUserById(req,res){
        try{
            const profile = await Profile.findOne({user: req.params.userId}).populate('user', 'first_name avatar');
            if (!profile)
               return res.status(404).send({message: 'Profile not found for this user'});  
       
           return res.status(200).send({message: 'Profile found' , Profile: profile });  
       }
       catch (err) {
           console.error( 'some error occurred', err) 
           res.status(500).send(err.message);        
       };
   }

    static async getAllProfile(req,res){
        try{
            const user = await Profile.find().populate('user', 'first_name avatar');
            if (!user)
               return res.status(404).send({message: 'Profiles not found'});  
       
           return res.status(200).send({message: 'Profiles found' , User: user});  
       }
       catch (err) {
           console.error( 'some error occurred', err) 
           res.status(500).send(err.message);        
       };
   }

    static async createProfile(req,res){
        try{
           //validat the data befor create
           //const {error} =  profileValidation(req.body);
           //if(error)
            //   return res.status(400).send(error.details[0].message);

           //chacking if the user is in the DB
           const userExist = await User.findById({_id: req.user._id});
           if(!userExist)
               return res.status(404).send({message: 'User not exists for craeting profile'});

            //Chack if profile exists
            const profileExist = await Profile.findOne({user: req.user._id});
            if(profileExist)
                return res.status(401).send({message: 'User Profile allrady exists'});  
           else {
               //Create new profile
               let profileData = new Profile({ 
                   _id: new mongoose.Types.ObjectId(),
                   user: req.user._id,
                   hendler: req.body.hendler,
                   status: req.body.status,
                   disciption: req.body.disciption,
                   myReantals: req.body.myReantals,
                   aboutMe: req.body.aboutMe,
                   social: req.body.social,
               });
   
               if(profileData){
                   const saveUser = await profileData.save();
                   res.status(200).send({
                       message: 'User profile created',
                       User: saveUser
                   });
                }
           }

        }
       catch (err) {
           console.error( 'some error occurred', err) 
           res.status(500).send(err.message);        
       };
   }

   //cant uderstandd!!! 
   static async updeateProfile(req,res){
        try{
        //chacking if the user is in the DB
        const userExist = await User.findById({_id: req.user._id});
        if(!userExist)
            return res.status(404).send({message: 'User not exists for craeting profile'});

        //Udete a profile     
        //Do it in if stats becouse i dont want to require fildes. if it cames from user so i set it. 
        const profileFildes = {};
        profileFildes.user= req.user._id; //login user
        if(req.body.handle) profileFildes.handle=req.body.handle;
        if(req.body.loction) profileFildes.loction=req.body.loction;
        if(req.body.status) profileFildes.status=req.body.status;
        if(req.body.disciption) profileFildes.disciption=req.body.disciption;
        
        //split into array 
        if(typeof req.body.apartments !== 'undefined') {
            //Chack if the id apartment exists:
            const apartmentExist= await Apartment.findOne({_id: req.body.apartments});
            if (!apartmentExist) 
                    return res.status(400).send({message: 'Apartment not exists'});

            profileFildes.apartments=req.body.apartments.split(',');
        }
        
        //objects of fildes
        profileFildes.myReantals ={};
        if(req.body.address) profileFildes.myReantals.address=req.body.address;
        if(req.body.city) profileFildes.myReantals.city=req.body.city;
        if(req.body.from) profileFildes.myReantals.from=req.body.from;
        if(req.body.to) profileFildes.myReantals.to=req.body.to;
        if(req.body.leftCose) profileFildes.myReantals.leftCose=req.body.leftCose;
        if(req.body.current) profileFildes.myReantals.current=req.body.current;

        profileFildes.aboutMe ={};
        if(req.body.lives) profileFildes.aboutMe.lives=req.body.lives;
        if(req.body.from) profileFildes.aboutMe.from=req.body.from;
        if(req.body.age) profileFildes.aboutMe.age=req.body.age;
        if(req.body.job) profileFildes.aboutMe.job=req.body.job;
        if(req.body.jobTime) profileFildes.aboutMe.jobTime=req.body.jobTime;
        if(req.body.money) profileFildes.aboutMe.money=req.body.money;
        if(req.body.education) profileFildes.aboutMe.education=req.body.education;
        if(req.body.relationship) profileFildes.aboutMe.relationship=req.body.relationship;
        if(req.body.kids) profileFildes.aboutMe.kids=req.body.kids;
        
        profileFildes.social ={};
        if(req.body.twitter) profileFildes.social.twitter=req.body.twitter;
        if(req.body.faceboke) profileFildes.social.faceboke=req.body.faceboke;
        if(req.body.instegram) profileFildes.social.instegram=req.body.instegram;
        if(req.body.youtob) profileFildes.social.youtob=req.body.youtob;

        const profileExist = await Profile.findOne({user: req.user._id});
        if(profileExist){ 
            //Update //(from some reson dont enter to update....)
           const upadtUser= await Profile.findOneAndUpdate({user: req.user._id} , {$set: profileFildes}, {new: true});
            if(upadtUser)
            return res.status(200).send({message: 'User Profile updated' , Update: upadtUser });  
        }
        else {
            //craete:
            
            const newProfile = new Profile(
                //_id: new mongoose.Types.ObjectId(),
                profileFildes
            )
            const saveIt =await newProfile.save().then(t => t.populate('user' , 'first_name last_name').execPopulate());
            if(newProfile)
                return res.status(200).send({message: 'Prifile creaded succfuly',newProfile1: profileFildes  , saveed: saveIt});  
            }
        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

    static async myReantalAdd(req,res){
        try{
            //Validat the data befor create
           const {error} =  addRentValidation(req.body);
           if(error)
               return res.status(404).send(error.details[0].message);

           //Chacking if the profile is in the DB
           const userExist =await Profile.findOne({user: req.user._id});
           if(!userExist)
                return res.status(404).send({message: 'profile not found'})

           .then(profile =>{
                //create a new rental// is array in the modle     
                const newRent ={ 
                    address: req.body.address,
                    city: req.body.city,
                    from: req.body.from,
                    to: req.body.to,
                    leftCose: req.body.leftCose,
                    current: req.body.current
                }
                //add to array 
                profile.myReantal.unshift(newRent); //this is like push to start
                profile.save().then(profile=>{ res.status(200).send({message: 'Added renal', newRental: newRent})});  
           })
       }
       catch (err) {
           console.error( 'some error occurred', err) 
           res.status(500).send(err.message);        
       };
   }

   static async myReantalDelete(req,res){
        try{
        const isExist= await Profile.findOne({user: req.user._id})
        if(!isExist)
                return res.status(404).send({message: 'Item not exists'})

        .then(profile => {
            //Get remove index
            const removeIt= profile.myReantal
                .map(item=> item.id)
                .indexOf(req.params.rentId);

            //Splice out of array   
            profile.myReantal.splice(removeIt,1); //remove 1 item

            //Re-save it in DB
            const saveIt = profile.save();
            return res.status(200).send({
                message: 'Item deleted sucssfully' ,
                removed :removeIt, 
                currentMyRents: saveIt
            })
        })

        }catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }

  
    static async Deleteuser(req,res){
        try{
            const removeProfile= await Profile.findOneAndRemove({user:req.user._id});
            if(!removeProfile)
                return res.status(404).send({message: 'User Profile not exists'})

            //Remove this user from collection 'users' allso
            const removeUser= await User.findOneAndRemove({_id :req.user._id});
            if(!removeUser)
                return res.status(404).send({message: 'User not exists'});

            return res.status(200).send({message: 'Profile and User deleted secssfuly'});

        }
        catch (err) {
            console.error( 'some error occurred', err) 
            res.status(500).send(err.message);        
        };
    }  


}

module.exports = ProfileController;
