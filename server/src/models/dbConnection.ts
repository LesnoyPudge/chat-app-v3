import mongoose from 'mongoose';
import { getEnvVars } from '../utils';



mongoose.pluralize(null);

export const dbConnection = async() => {
    try {
        // mongoose.set('debug', true);
        await mongoose.connect(getEnvVars().DB_CONNECTION);
        console.log('database connected');
    } catch (error) {
        console.log('database connection failed');
    }
};