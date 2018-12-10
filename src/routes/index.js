const path = require('path');
const { repository } = require('../repository')

/**
 * register the routes
 */
function register(app,  model) {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
  });

  app.post('/api/exercise/new-user', (req, res) => {
    const { username } = req.body;
    // check username
    if(!username) return res.json(400);

    // create new user
    repository.remote.createUser(model.user, username)
      .then((newUser) => {
        console.log("new user id", newUser.id)      
        res.status(200).redirect('/');
      })
      .catch(error => {
        console.log("Error", error);
        res.status(400).json({error: error});                
      })
  });

  app.post('/api/exercise/add', (req, res) => {
    const { userId, description, duration, date } = req.body
    // TODO: validate the input body
    if(!userId || !description || !duration || !date) {
      res.status(400).json({error: "field_cannot_empty"});
    }

    // TODO: parse date into unix time

    repository.remote.createExercise(model.user, model.exercise, 
      { userId, description, duration, date })
      .then((newExercise) => {
        console.log("new exercise id", newExercise.id);
        res.status(200).redirect('/');
      })
      .catch((error) => {
        console.log("Error", error);
        res.status(400).json({error: error.message})
      })
    
    console.log(userId, description, duration, date);
  })

  app.get('/api/exercise/log', (req, res) => {
}

module.exports.routes = {
  register
}