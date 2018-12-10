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
}

module.exports.routes = {
  register
}