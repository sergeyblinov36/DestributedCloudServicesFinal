const mongoose =require('mongoose');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    first_name:{ type: String, required: true},
    last_name: { type: String, required: true}, 
    email: { type: String, required: true } , 
    avatar: {type: String},
    password: { type: String, required:true  } ,
    role: {type:String, required: true , enum: ["user", "owner"]}, //user or owner -cant be both. define who is the user
    id_token: { type: String, unique: true }, // id user from google login
    date: { type: Date, default: Date.now},
}, { collection: 'users' });



const Users = mongoose.model( 'Users' , UserSchema); 
module.exports = Users;

