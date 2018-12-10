function createUser(userModel, username) { return new Promise((resolve, reject) => {
  userModel.create({ username: username }, (error, user) => {    
    if(error) {
      reject(error);
    }
    
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

    console.log("user id", user.id)
  })

  exerciseModel.create({ ...exercise  }, (error, newExercise) => {
    if(error) reject(error)

    resolve(newExercise)
  })
})}

module.exports.remote = {
  createUser,
  createExercise,
}