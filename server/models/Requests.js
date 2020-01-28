const mongoose =require('mongoose');
const { Schema, model } = require('mongoose');

const RequestSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    apartmnt :{ type: mongoose.Schema.Types.ObjectId, ref: 'Apartments', required: true },
    sending: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, //user sent request to owner and get from owner
    resiving: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, //owner get requests
    purpose: {type:String ,default: 'invation', enum: ["reply", "seeHouse" , "wantToRent" ,"askForDetails", "invation" ]}, //need the default for creating request in the apartment collection
    text:{type:String},
    status : {type:String, default: 'apnding' , enum: [ "apnding" ,"aprovedByUser", "rejectedByUser" , "invited" ,"aprovedByOwner", "rejectedByOwner", "replied" ]},
    date: { type: Date, default: Date.now}
}, { collection: 'requests' });


const Requests = mongoose.model( 'Requests' , RequestSchema); 
module.exports = Requests;
