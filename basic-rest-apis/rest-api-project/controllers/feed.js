exports.getPosts = (req,res,next) =>{
    res.status(200).json({
        posts : [   
            {title : "My first Post", content : "This is my first post content."},
            {title : "My second Post", content : "This is my second post content."}]
       })
}

exports.createPost = (req,res, next) =>{
    const title = req.body.title;
    const content = req.body.content

    res.status(201).json({
        post : {
            id : new Date().toISOString(),
            title : title,
            content : content
        },
        message : 'New Post is Created succesfully.'
    })
}