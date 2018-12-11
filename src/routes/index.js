const path = require('path');
const { repository } = require('../repository');
const { dateToUnix  } = require('../utils')

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
    if(!username) {
      res.status(400).json({error: new Error('invalid_username')});
      return;
    }
  
    // create new user
    repository.remote.createUser(model.user, username)
      .then((newUser) => {
        console.log("new user id", newUser.id);
        res.redirect(200, '/');
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
    const dateUnixTime = dateToUnix(date);

    repository.remote.createExercise(model.user, model.exercise, 
      { userId, description, duration, dateUnixTime })
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
    const { userId,   } = req.body;
    if(!userId) res.status(404).json({error: "unknown userId"});

    /* data returned format

      "_id": "HJW67J31N",
      "username": "hayo",
      "from": "Sat Nov 10 2018",
      "to": "Wed Dec 12 2018",
      "count": 1,
      "log": [
        {
          "description": "makan",
          "duration": 10,
          "date": "Mon Dec 10 2018"
        }
      ]
    */
  })
}

module.exports.routes = {
  register
}