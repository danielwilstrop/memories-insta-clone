const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/post')
const Post = mongoose.model("Post")
const requireLogin = require('../middleware/requireLogin')

mongoose.set('useFindAndModify', false)
 
router.post('/createpost',requireLogin, (req, res) => {
    const { title, body, picture } = req.body
    if (!title || !body || !picture){
        return res.status(422).json({ error: "Please Add title and content to your post"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        picture,
        postedBy: req.user
    })
    post.save()
    .then(data => {
        res.json({ post:data })
    })
    .catch(error => console.log(error))
})

router.get('/allpost', requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({ posts })
    })
    .catch(error => console.log(error))
})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({
        postedBy: req.user._id
    })
    .populate("postedBy", "_id name")
    .then(myposts => {
        res.json({ myposts })
    })
    .catch(error => console.log(error))
})

router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({ postedBy:{ $in:req.user.following || req.user._id }})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    },
    { new:true })
       .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            return res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    },
    { new:true })
    .exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            return res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/editpost/:postId',requireLogin,(req,res)=> {
    const { title, body, picture } = req.body
    if (!title || !body || !picture){
        return res.status(422).json({ error: "Please Add title and content to your post"})
    }
    Post.findByIdAndUpdate({_id:req.params.postId},{
        $set: {
            title: title,
            body: body,
            picture: picture
        }}, {new:true}, (err,result) => {
            if(err){
                return res.status(422).json({error:'There was a problem updating your post, please try again'})
            }
            res.json(result)
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

router.delete("/deletecomment/:id/:comment_id", requireLogin, (req, res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.id,
      {$pull: {
        comments: comment },
      },{
        new: true, 
    })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name ")
      .exec((err, postComment) => {
        if (err || !postComment) {
          return res.status(422).json({ error: err });
        } else {
          const result = postComment;
          res.json(result);
        }
      });
  });

module.exports = router