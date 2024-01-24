import mongoose from 'mongoose';

const connection = {};

export async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(process.env.MONGODB_URI, {});

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(
      error,
      `Unable to connect to mongoose. URI: ${process.env.MONGO_URI}, API_URL. ${process.env.API_URL}`
    );
    throw error;
  }
  console.log('connected to mongoose');
}

export async function dbDisconnect() {
  return await mongoose.connection.close();
}
