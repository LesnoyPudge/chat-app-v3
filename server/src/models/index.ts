import mongoose from 'mongoose';



export const dbInit = () => {
    if (!process.env.DB_CONNECTION) return console.log('database toket is undefined');
    
    mongoose.pluralize(null);
    mongoose.connect(process.env.DB_CONNECTION)
        .then(() => console.log('database connected'))
        .catch((error) => console.log('database connection failed ' + error));
};