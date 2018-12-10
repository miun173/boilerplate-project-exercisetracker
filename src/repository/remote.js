function createUser(UserModel, username) { return new Promise((resolve, reject) => {
  // TODO: UserModel.create callback is never called
  UserModel.create({ username: username }, (error, user) => {    
    if(error) {
      reject(error);
    }
    
    resolve({id: user.id});
  })
})}

module.exports.remote = {
  createUser
}