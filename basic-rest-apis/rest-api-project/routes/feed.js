
const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);

// router.get('/posts', (req,res) =>{
//     res.status(200).json({
//         posts: [{ title: 'First Post', content: 'This is the first post!' }]
//       });
//     });

router.post('/post',feedController.createPost)

module.exports = router;