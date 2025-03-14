import mongoose from 'mongoose';
import 'dotenv/config';


const EXERCISE_DB_NAME = 'exercise_db';
const EXERCISE_COLLECTION = 'exercises';
const EXERCISE_CLASS = 'Exercise';

let connection = undefined;
let Exercise = undefined;

/**
 * This function does the following:
 *  1. Connects to the MongoDB server.
 *  2. Drop EXERCISE_COLLECTION if asked to do so.
 *  3. Creates a model class for the movie schema.
 * @param {Boolean} dropCollection If true, drop EXERCISE_COLLECTION
 */
async function connect(dropCollection){
    try{
        connection = await createConnection();
        console.log("Successfully connected to MongoDB using Mongoose!");
        if(dropCollection){
            await connection.db.dropCollection(EXERCISE_COLLECTION);
        }
        const exerciseSchema = createSchema();
        //  Compile the model from the schema. This must be done after defining the schema.
        Exercise  = mongoose.model(EXERCISE_CLASS, exerciseSchema);
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

/**
 * Connect to the MongoDB server for the connect string in .env file
 * @returns A connection to the server
 */
async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: EXERCISE_DB_NAME});
    return mongoose.connection;
}

/**
 * Define the schema
 */
function createSchema(){
    return mongoose.Schema({
        name: { type: String, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
        unit: { type: String, required: true },
        date: { type: String, required: true }
    });
}


/**
 * 
 * @param name 
 * @param reps 
 * @param weight 
 * @param unit 
 * @param date 
 * @returns 
 */
const createExercise = async (name, reps, weight, unit, date) => {
    // Call the constructor to create an instance of the model class Movie
    const exercise = new Exercise({
        name: name, reps: reps, weight: weight, unit: unit, date: date
    });
    // Call save to persist this object as a document in MongoDB
    return exercise.save();
}


/**
 * Find the exercise with the given ID value
 * @param {String} _id 
 * @returns 
 */
const findExerciseById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

/**
 * 
 * @returns 
 */
const findExercises = async () => {
    const query = Exercise.find();
    return query.exec();
}

/**
 * 
 * @param {object} filter 
 * @param {object} update 
 * @returns 
 */
const updateExercise = async (filter, update) => {
    const result = await Exercise.updateOne(filter, update);
    return result;
};


/**
 * 
 * @param _id 
 * @returns 
 */
const deleteById = async (_id) => {
    const result = await Exercise.deleteOne({ _id: _id });
    // Return the count of deleted document. Since we called deleteOne, this will be either 0 or 1.
    return result.deletedCount;
}

export { connect, createExercise, findExerciseById, findExercises, updateExercise, deleteById};