import mongoose from 'mongoose';

export const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medassist';

  if (uri.includes('<db_username>')) {
    console.warn(
      '[MongoDB Warning]: MONGO_URI contains unreplaced "<db_username>". Falling back to local MongoDB.'
    );
    uri = 'mongodb://127.0.0.1:27017/medassist';
  }

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    const isCloud = uri.includes('mongodb+srv') || uri.includes('mongodb.net');
    console.log(
      `[MongoDB] Connected successfully (${isCloud ? 'MongoDB Atlas Cloud' : 'Local Instance'}): ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error(`[MongoDB] Critical Connection Failure: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection lost. Attempting auto-reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[MongoDB] Auto-reconnected to cluster.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Runtime Connection Error: ${err.message}`);
  });
};
