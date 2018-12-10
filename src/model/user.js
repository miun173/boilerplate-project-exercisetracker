module.exports.user = {
    init(mongoose) {
        console.log('create a user schema');
    
        // make a Schema
        const Schema = mongoose.Schema
        const userSchema = new Schema({
            username: String,
        })
    
        // create & return user model
        const model = mongoose.model('User', userSchema);
        console.log('userModel created');
    
        return model;
    }
}