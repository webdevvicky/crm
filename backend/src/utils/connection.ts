// utils/connection.ts
import mongoose, { Connection } from "mongoose";

const connections: { [key: string]: Connection } = {};

export const getConnection = async (dbName: string): Promise<Connection> => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  // Construct the database URL (assuming you're using MongoDB Atlas)
  const dbUrl = "mongodb://localhost:27017";
  const connectionUri = `${dbUrl}/${dbName}`;

  // Create a new connection if not exists
  const connection = await mongoose.createConnection(connectionUri);

  connections[dbName] = connection;
  return connection;
};
