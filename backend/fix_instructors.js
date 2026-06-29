import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);
console.log("Connected to MongoDB!");

// Check ALL instructors
const instructors = await User.find({ role: 'instructor' });
console.log("\n=== ALL INSTRUCTORS ===");
instructors.forEach(ins => {
  console.log(`ID: ${ins._id}`);
  console.log(`  Name: ${ins.name}`);
  console.log(`  Email: ${ins.email}`);
  console.log(`  approvalStatus: ${ins.approvalStatus}`);
  console.log(`  isBlocked: ${ins.isBlocked}`);
  console.log('---');
});

// Fix: Set ALL instructors to "approved" if not already
const updated = await User.updateMany(
  { role: 'instructor', approvalStatus: { $ne: 'approved' } },
  { $set: { approvalStatus: 'approved' } }
);
console.log(`\n✅ Updated ${updated.modifiedCount} instructor(s) to approvalStatus: "approved"`);

// Verify
const after = await User.find({ role: 'instructor' });
console.log("\n=== AFTER UPDATE ===");
after.forEach(ins => {
  console.log(`  ${ins.name} (${ins.email}): ${ins.approvalStatus}`);
});

await mongoose.connection.close();
console.log("\nDone!");
