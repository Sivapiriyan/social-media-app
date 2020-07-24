const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.post('/createpost', requireLogin, (req, res) => {
    const { body, title } = req.body
    if (!title || !body) {
        return res.status(422).json({
            error: "please add all details"
        })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedby: req.user
    })
    post.save().then(result => {
        res.json({
            post: result
        })
    }).catch(err => {
        console.log(err)
    })

})

router.get('/viewpost',(req,res)=>{
    Post.find()
    .populate("postedby","_id name")
    .then(posts=>{
        res.json({
            posts
        })        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res)=>{
Post.find({postedby:req.user._id})
.populate("postedby","_id name")
.then(mypost=>{
    res.json({
        mypost
    })
})
.catch(err=>{
    console.log(err)
})
})
module.exports = router 