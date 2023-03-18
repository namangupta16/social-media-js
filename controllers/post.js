const { PositionalAudio } = require('three')
const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const { post } = require('./auth')
const postController = require('express').Router()


//get all

postController.get('/getAll', async(req, res) => {
    try  {
        const posts = await Post.find({})
        return res.status(200).json(posts)

    } catch (error) {
        return res.status(500).json(error.message)

    }
})

//get one
postController.get('/find/:id', async(req, res) => {
    try  {
        const posts = await Post.findById(req.params.id)
        
        if(!post){
            return res.status(500).json({msg: "no such with such id!"})
        } else {
            return res.status(200).json(post)
        }

    } catch (error) {
        return res.status(500).json(error.message)
     }
})

//create
postController.post('/', verifyToken, async(req,res) => {
    try  {
        const newPost = await Post.create({...req.body, userId: req.user.id})
        return res.status(200).json(newPost)

    } catch (error) {
        return res.status(500).json(error.message)

    }

})

//update
postController.put("/:id", verifyToken, async(req,res) => {
    try  {
        const post = await Post.findById(req.params.id)
        console.log(post)
        if(post.userId === req.user.id){
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
            return res.status(200).json(updatedPost)

        }else{
            return res.status(403).json({msg: "you can update only your own post"})
        }

    } catch (error) {
        return res.status(500).json(error.message)

    }
})

//delete

postController.delete(':id', verifyToken ,async(req,res) =>{
    try  {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(500).json({msg: " no such post"})
        }else if(post.userId !== req.user.id){
            return res.status(403).json({msg: "you can delete only your own post"})
        }else{
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({msg: " post is successfully deleted"})
        }

    } catch (error) {
        return res.status(500).json(error.message)

    }
})

postController.put("/likeDislike/:id" , verifyToken, async(req,res) => {
    try  {
        const currentUserId = req.user.id
        const Post = await Post.findById(req.params.id)

        //if user has already liked the post , then disliked it
        //otherwise add the like
        if(post.likes.includes(currentUserId)){
            post.likes = post.likes.filter((id) => id !== currentUserId)
            await post.save()
            return res.status(200).json({msg: "successfully unliked the post"})
        }else{
            post.likes.push(currentUserId)
            await post.save()
            return res.status(200).json({msg: "successfully liked the post"})
        }

    } catch (error) {
        return res.status(500).json(error.message)

    }
})

module.exports = postController