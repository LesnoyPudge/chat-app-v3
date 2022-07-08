import mongoose from 'mongoose';
import { getEnvVars } from '../utils';



export const dbConnect = () => {
    mongoose.pluralize(null);
    mongoose.connect(getEnvVars().DB_CONNECTION)
        .then(() => console.log('database connected'))
        .catch((error) => console.log('database connection failed ' + error));
};