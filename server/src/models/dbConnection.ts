import mongoose from 'mongoose';
import { getEnvVars } from '../utils';



export const dbConnection = async() => {
    try {
        mongoose.pluralize(null);
        // mongoose.set('debug', true);
        const connection = await mongoose.connect(getEnvVars().DB_CONNECTION);
        console.log('database connected');
        return connection;
    } catch (error) {
        console.log('database connection failed');
    }
};

// export const dbConnection = () => {
//     Promise.resolve(async() => {
//         mongoose.pluralize(null);
//         // mongoose.set('debug', true);
//         const connection = await mongoose.connect(getEnvVars().DB_CONNECTION);
//         return connection;
//     }).then(() => {
//         console.log('database connected');
//     }).catch((error) => {
//         console.log('database connection failed: ', error.message);
//     });
// };