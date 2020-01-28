const express= require('express');
const mongoose = require('mongoose');
const Post =require('../models/Posts');
const User =require('../models/Users');
const Apartment =require('../models/Apartments');

const {creatPostValidation}  = require('../valdition');



class PostsController {
    static async createPost(req,res){
        try{
            //create a new post 
            const today=new Date()
            let newPost = new Post({ 
                text: req.body.text,
                first_name: req.body.first_name, //will come from redax
                avatar: req.body.avatar,
                user: req.user._id, //in the token user 
                aprtment: req.body.aprtment, 
                created: today
            });

            const savePost = await newPost.save();
            if(savePost){
                //Save post
                res.status(200).send({
                    message: 'Post created successfully',
                    Post: savePost
                })
          
            } else return res.status(404).send({message: 'Save failed'});

        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        } 
    }

    static async getAllPosts(req,res){
        try{
            const allPosts = await Post.find();
            if(!allPosts)
                return res.status(404).send({message: 'Posts not found' });
            
            return res.status(200).send({message: 'All Posts' , Posts: allPosts })

        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        } 

    }

    static async getPostById(req,res){
        try{
            const allPosts = await Post.findById(req.params.postId).populate('aprtment user', 'first_name last_name email city address price'); 
            if(!allPosts)
                return res.status(404).send({message: 'Post not found' });
            
            return res.status(200).send({message: 'Post found' , Posts: allPosts })

        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        } 
    }

    static async getPostByUserId(req,res){
        try{
            const user =req.params.userId;
            const allPosts = await Post.find({user}).populate('aprtment user', 'first_name last_name email city address price'); 
            if(!allPosts)
                return res.status(404).send({message: 'Posts not found by this user' });
            
            return res.status(200).send({message: 'All User Posts found' , Posts: allPosts })

        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        } 
    }

    static async getPostByApprId(req,res){
        try{
            const aprtment = await Post.find({aprtment:req.params.apartmntId }).populate('aprtment user', 'first_name last_name email city address price'); 
            if(!aprtment)
                return res.status(404).send({message: 'Posts not found' });
            console.log(aprtment);
            return res.status(200).send({message: 'All User Posts found' , Posts: aprtment })

        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        } 
    }

    static async deletePost(req,res){
        try{
            //Check if the current user is the owner of the post
            const userPost = await User.findOne({ _id: req.user._id });
            if (!userPost)
                return res.status(404).send({message: 'User not found' });
            
            const post = await Post.findById(req.params.postId);
            if (!post)
                return res.status(404).send({message: 'Post not found'});
            if (String(post.user) !== String(req.user._id)) //make it to string only to make sure it same type
                    return res.status(401).send({message: 'Not allowed. This user is not the owner of the post' });
            else
                //Delete
                //first  remove this post from user module post[]array
                 var postUser = await User.findOne({_id: req.user._id});
                if (!postUser)
                    return res.status(404).send({message: 'User not found'});
                else{
                    //remove user id to posts array
                    postUser.posts.unshift({ user: req.user._id });
                    await postUser.save();
                }

                //Now Delete
                post.remove().then(()=> res.status(200).send({message: 'post remove successfully '}) );
        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        }         
    }

    static async likePost(req,res){
        try{
            const userPost = await User.findOne({ _id: req.user._id });
            if (!userPost)
                return res.status(404).send({message: 'User not found' });
            
            //Check this user already liked the post
            const post = await Post.findById(req.params.postId);
            if (!post)
                return res.status(404).send({message: 'Post not found'});
            if (post.likes.filter( like => String(like.user) == String(req.user._id) ).length  > 0 ) //check if user id already in the array likes
                    return res.status(400).send({message: 'User allrady liked the post' });    
            else
                //Add user id to likes array
                post.likes.unshift({ user: req.user._id });
                post.save().then(post=> res.status(200).send({message: 'like has added to the post'}));
        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        }         
    }

    
    static async unlikePost(req,res){
        try{
            const userPost = await User.findOne({ _id: req.user._id });
            if (!userPost)
                return res.status(404).send({message: 'User not found' });
            
            //Check this user already liked the post
            const post = await Post.findById(req.params.postId);
            if (!post)
                return res.status(404).send({message: 'Post not found'});
            if (post.likes.filter( like => String(like.user) == String(req.user._id) ).length  === 0 ) //equal zero mean the id user is not in the likes array
                    return res.status(400).send({message: 'You have not yet liked this post' });    
            else
                //Get the Remove index
                var removeIndex = post.likes
                    .map(item=> String(item.user))
                    .indexOf(req.user._id);

                //Splice out of the array
                post.likes.splice(removeIndex,1);    

                //Save the changes
                const saveIt = post.save();
                if (saveIt)
                    return res.status(200).send({message: 'Unlike post successfully' });
        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        }         
    }

        
    static async commentPost(req,res){
        try{
            //validate that we have at list text in the comment
            //const {error} =  creatPostValidation(req.body);
            //if(error)
            //    return res.status(400).send(error.details[0].message);

            //Check if post exists
            const post = await Post.findById(req.params.postId);
            if (!post)
                return res.status(404).send({message: 'Post not found' });
            
            //Creat a comment to that post
            const neComment ={
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user._id
            }

            //Add to comment array 
            post.comments.unshift(neComment);
            //Save in DB
            const saveIt = post.save().then(t => t.populate('user', 'first_name last_name email').execPopulate()) ;
            if (!saveIt)
                return res.status(401).send({message: 'Something went wrong with data' });    
            
            return res.status(200).send({message: 'Comment added to the Post successfully'  , comment: neComment});
        }catch (err) {
            console.error( 'some error occurred', err);
            res.status(500).send(err.message); 
        }         
    }


}


module.exports =PostsController;
