const router = require('express').Router();

const db = require('../data/db');

// router.get('/', (req, res) =>{
//     res
//     .send('<h1>Post Router Api<h1>')
// });
router.post('/', (req, res) => {
    const { title, contents } = req.body;
    db.insert(req.body)
     .then(post => {
         if (!title || !contents){
             res.status(400).json({
                 errorMessage:'Please provide title and contents for the post.'
             })
         } else {
             res.status(201).json(post);
         }
     })
     .catch(error => {
         console.log(error);
         res.status(500).json({
             error: 'There was an error while saving the post to the database'
         });
     });
});

router.post("/:id/comments", (req, res) => {
    const comment = req.body;
    const { text } = comment;
    if (!text) {
      res.status(400).json({
        errorMessage: "Please provide text for the comment."
      });
    }
    db.insertComment(req.body)
      .then(comment => {
        if (!comment) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          res.status(201).json(comment);
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });

  router.get('/', (req, res) => {
    db.find()
      .then( post => {
        res.status(200).json(post)
      })
      .catch( error => {
        console.log(error)
        res.status(500).json({
          error: 'Unable to retrieve posts.'
        });
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
      .then( post => {
        if (post.length > 0) {
          res.status(200).json(post);
        } else {
          res.status(400).json({
            errorMessage: 'The post with the specified ID does not exist.'
          });
        }
      })
      .catch( error => {
        console.log(error);
        res.status(500).json({
          error: 'Error retrieving the post.'
        });
      });
  });

  router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findById(id)
      .then( post => {
        if (post.length > 0) {
          db.findPostComments(id)
          .then( comments => {
            if (comments.length > 0) {
              res.status(200).json(comments);
            } else {
              res.status(404).json( {
                message: 'That post does not have any comments' 
              });
            }
          })
          .catch( error => {
            console.log(error);
            res.status(500).json({
              error: 'Error retrieiving post comments.'
            });
          });
        } else {
          res.status(404).json({
            message: 'The post with the specified ID does not exist'
          });
        }
      })
  });
   
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.remove(id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "The user could not be removed"
        });
      });
  });

  router.put("/:id", (req, res) => {
    const id = req.params.id;
    const user = req.body;
    const { title, contents } = user;
    if (!title || !contents) {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    }
    db.update(id, user)
      .then(post => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          res.status(200).json({
            message: "The post information was updated successfully"
          });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "The post information could not be modified."
        });
      });
  });

module.exports = router;