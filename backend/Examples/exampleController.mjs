import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercise_model.mjs';

const PORT = process.env.PORT;

const NOT_FOUND_ERROR = { Error: 'Not found' };
const INVALID_REQUEST_ERROR = { Error: 'Invalid request' };
const SERVER_ERROR = { Error: 'Request failed' };

const app = express();

app.use(express.json());

/**
 * 
 * @param {*} date 
 */
function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * 
 * @param {*} body 
 */
function isBodyValid(name, reps, weight, unit, date) {
    if (name === undefined || reps === undefined || weight === undefined || unit === undefined || date === undefined) {
        return false;
    } else if (typeof name !== 'string' || name.length < 1) {
        return false;
    } else if (isNaN(reps) || reps < 1) {
        return false;
    } else if (isNaN(weight) || weight < 1) {
        return false;
    } else if (typeof unit !== 'string' || (unit !== 'kgs') && unit !== 'lbs') {
        return false;
    } else if (!isDateValid(date)) {
        return false;
    }
    else {
        return true;
    }
}


/**
 * 
 */
app.post('/exercises', asyncHandler(async (req, res) => {
    try {
        if (isBodyValid(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)) {
            const exercise = await exercises.createExercise(
                req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
            res.status(201).json(exercise);
        } else {
            res.status(400).json(INVALID_REQUEST_ERROR);
        }
    }
    catch (error) {
        console.error(error);
        // In case of an error, send back status code 500 in case of an error.
        // A better approach will be to examine the error and send an
        // error status code corresponding to the error.
        res.status(500).json(SERVER_ERROR);
    }
}));


/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const exercise = await exercises.findExerciseById(req.params.id);
        if (exercise !== null) {
            res.json(exercise);
        } else {
            res.status(404).json(NOT_FOUND_ERROR);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(SERVER_ERROR);
    }
}));

/**
 * Retrieve all the exercises
 */
app.get('/exercises', asyncHandler( async(req, res) => {
    try{
        const result = await exercises.findExercises();
        res.json(result);
    } catch(error) {
            console.error(error);
            res.status(500).json(SERVER_ERROR);
        }
}));

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit and date to the values provided in the body.
 */
app.put('/exercises/:_id', asyncHandler(async (req, res) => {
    try {
        if (isBodyValid(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)) {
            const resultVal = await exercises.updateExercise({ _id: req.params._id }, req.body);
            if (resultVal.matchedCount === 0) {
                res.status(404).json(NOT_FOUND_ERROR);
            } else {
                const exercise = {};
                exercise._id = req.params._id;
                exercise.name = req.body.name;
                exercise.reps = req.body.reps;
                exercise.weight = req.body.weight;
                exercise.unit = req.body.unit;
                exercise.date = req.body.date;
                res.json(exercise);
            }
        }
        else {
            res.status(400).json(INVALID_REQUEST_ERROR);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(SERVER_ERROR);
    }
}));


/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:id', asyncHandler(async (req, res) => {
    try {
        const deletedCount = await exercises.deleteById(req.params.id);
        if (deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json(NOT_FOUND_ERROR);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(SERVER_ERROR);
    }
}));


app.listen(PORT, async () => {
    await exercises.connect(true)
    console.log(`Server listening on port ${PORT}...`);
});