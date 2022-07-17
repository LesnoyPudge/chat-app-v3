import mongoose from 'mongoose';
import { getEnv } from '../utils';



mongoose.pluralize(null);

export const dbConnection = async() => {
    try {
        // mongoose.set('debug', true);
        await mongoose.connect(getEnv().DB_CONNECTION);
        console.log('database connected');
    } catch (error) {
        console.log('database connection failed');
    }
};