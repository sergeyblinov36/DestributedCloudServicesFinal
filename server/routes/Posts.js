const express= require('express');
const posts = express.Router();
const control = require('../controller/Posts');
const verify = require('../config/verifyToken');


posts.post('/', verify ,  (req,res) =>{
    control.createPost(req,res);
});


posts.get('/' ,(req,res)=>{ 
    control.getAllPosts(req,res);
});

//get profile by post id
posts.get('/post/:postId' ,(req,res)=>{ 
    control.getPostById(req,res);
});

//get profile by user  id
posts.get('/user/:userId' ,(req,res)=>{ 
    control.getPostByUserId(req,res);
});

//get profile by user  id
posts.get('/apartment/:apartmntId' ,(req,res)=>{ 
    control.getPostByApprId(req,res);
});


posts.delete('/:postId' ,verify,(req,res)=>{
    control.deletePost(req,res);
});

posts.post('/like/:postId' ,verify,(req,res)=>{
    control.likePost(req,res);
});

posts.post('/unlike/:postId' ,verify,(req,res)=>{
    control.unlikePost(req,res);
});

posts.post('/comment/:postId' ,verify,(req,res)=>{
    control.commentPost(req,res);
});

posts.post('/star' ,verify,(req,res)=>{
    control.starIt(req,res);
});





module.exports =posts;