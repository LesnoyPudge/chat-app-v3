import mongoose from 'mongoose';



export const databaseConnection = async() => {
    mongoose.set('strictQuery', true);

    await mongoose.connect(process.env.DB_CONNECTION_URL).then(() => {
        console.log('database connected');
    }).catch((error) => {
        console.log(`database connection failed: ${error.message}`);
    });
};