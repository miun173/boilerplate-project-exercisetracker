function createUser(userModel, username) { return new Promise((resolve, reject) => {
  userModel.create({ username: username }, (error, user) => {
    if(error) {
      reject(error);
      return;
    }
    
    console.log(`user ${user.id} created`)
    resolve({id: user.id});
  })
})}

function createExercise(userModel, exerciseModel, exercise) { return new Promise((resolve, reject) => {
  // check if exercise.userId exists
  userModel.find({_id: exercise.userId}, (error, user) => {
    if(error) {
      reject(error);
      return;
    }

    if(!user) {
      reject(error);
      return;
    }
  })

  exerciseModel.create({ ...exercise  }, (error, newExercise) => {
    if(error) reject(error)

    resolve(newExercise)
  })
})}

function queryUserById(userModel, userId) {return new Promise((resolve, reject) => {
  console.log("userId", userId);
  userModel.findById(userId, (error, user) => {
    if(error) reject(error);

    resolve(user);
  })
})}

// queryUserLogs returns a user excercises logs with optional filter
// filter: {from: Number, to: Number, limit: Number}
function queryUserLogs(exerciseModel, userId, filter) { return new Promise((resolve, reject) => {
  let query = exerciseModel.find({ userId: userId }, 'description duration date')

  // query without filter
  if(filter && filter.from && filter.to) {
    query = exerciseModel.find({ userId: userId, date: { $gte: filter.from, $lte: filter.to } }, 'description duration date')
  }
  // query with filter from only
  else if(filter && filter.from && !filter.to) {
    query = exerciseModel.find({ userId: userId, date: { $gte: filter.from }}, 'description duration date')
  }
  // query with filter to only
  else if(filter && !filter.from && filter.to) {
    query = exerciseModel.find({ userId: userId, date: { $lte: filter.to }}, 'description duration date')
  }

  // check adding limit
  if(filter && filter.limit) {
    query = quer.limit(filter.limit)
  }

  query.exec((error, exercises) => {
    if(error) {
      reject(error);
      return;
    }
    
    resolve(exercises);
  })

})}

module.exports.remote = {
  createUser,
  createExercise,
  queryUserLogs,
  queryUserById,
}
