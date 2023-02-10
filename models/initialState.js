import mongoose from 'mongoose';
import game from './game.js';

const { Schema, model, models } = mongoose;


const initialStateSchema = new Schema(
    {
        game: {
            type: Schema.Types.ObjectId,
            ref: game.modelName
        },
    },
    { timestamps: true, strict: false }
);

export default models.InitialState || model('InitialState', initialStateSchema);
