const mongoose =require('mongoose');
const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    aprtment: {type: mongoose.Schema.Types.ObjectId, ref: 'Apartments'},
    text: {type:String, required:true},
    first_name: {type:String},
    avatar: {type:String},

    star: [{
        aprtment: {type: mongoose.Schema.Types.ObjectId, ref: 'Apartments'},
        user :{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        value: {type:Number}
    }], //for ranc the apartment by user

    likes:[{
        user :{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    }],
    comments: [
        {
            user :{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            text: {type:String, required:true},
            first_name: {type:String},
            avatar: {type:String},
            date:{type:Date , default: Date.now}

        }
    ],
    date:{type:Date , default: Date.now}
}, { collection: 'posts' });


const Posts = mongoose.model( 'Posts' , PostSchema); 
module.exports = Posts;