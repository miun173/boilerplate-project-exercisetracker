module.exports.exercise = {
    init(mongoose) {
        console.log('create a exercise schema');
    
        // make a Schema
        const Schema = mongoose.Schema
        const exerciseSchema = new Schema({
            userId: Schema.Types.ObjectId,
            description: String,
            duration: Number,
            date: Number,
        })
    
        // create & return user model
        const model = mongoose.model('exercise', exerciseSchema);
        console.log('exerciseModel created');
    
        return model;
    }
}