const path = require('path');
const { repository } = require('../repository');
const { dateToUnix, unixToDate  } = require('../utils')

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
    const { userId, description, duration } = req.body
    // TODO: validate the input body
    if(!userId || !description || !duration) {
      res.status(400).json({error: "field_cannot_empty"});
    }

    const nowDate = new Date(Date.now())

    const date =  req.body.date ? dateToUnix(req.body.date)
      : nowDate.getTime();

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
    const { userId } = req.query;
    if(!userId) res.status(404).json({error: "unknown userId"});

    let filter = {}
    let logs = { _id: userId }

    if(req.query.from) {
      filter.from = dateToUnix(req.query.from);
      logs.from = req.query.from
    }
    if(req.query.to) {
      filter.to = dateToUnix(req.query.to);
      logs.to = req.query.to
    }
    if(req.query.limit) {
      filter.limit = limit
    }
    
    repository.remote.queryUserById(model.user, userId)
      .then(user => {
        console.log("username", user.username);
        logs.username = user.username
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({error})
        return;
      })

    repository.remote.queryUserLogs(model.exercise, userId, filter)
      .then((exercises) => {
        const newLogs = Object.assign({}, logs,{
          count: exercises.length,
          log: exercises.map(el => {
            const dateString = unixToDate(el.date).toDateString()
            return {
              description: el.description,
              duration: el.duration,
              date: dateString,
            }
          }),
        })
        
        res.status(200).json(newLogs)
      })
      .catch(error => {
        // console.log("Error", error);
        res.status(400).json(error);
      })

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