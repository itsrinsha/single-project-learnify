import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);
console.log("Connected to MongoDB!");

const user1 = await User.findById('69f9c74a62279bd57d3def81');
console.log("User 1 (69f9c74a62279bd57d3def81):", user1 ? { name: user1.name, email: user1.email, role: user1.role, approvalStatus: user1.approvalStatus } : "not found");

const user2 = await User.findById('69f9b4b862279bd57d3def80');
console.log("User 2 (69f9b4b862279bd57d3def80):", user2 ? { name: user2.name, email: user2.email, role: user2.role, approvalStatus: user2.approvalStatus } : "not found");

const instructors = await User.find({ role: 'instructor' });
console.log("All instructors:");
instructors.forEach(ins => {
  console.log(`- ${ins.name} (${ins.email}): id=${ins._id}, status=${ins.approvalStatus}`);
});

await mongoose.connection.close();
