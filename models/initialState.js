import mongoose from 'mongoose';
import game from './game.js';

const { Schema, model, models } = mongoose;


const initialStateSchema = new Schema(
    {
        slug: {
            type: String
        },
        state: {
            type: Object
        },
    },
    { timestamps: true, strict: false }
);

export default models.InitialState || model('InitialState', initialStateSchema);
