import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Note: useUnifiedTopology and useNewUrlParser are often redundant in modern mongoose versions,
    // but keeping them doesn't hurt.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;