// scripts/seedUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Seed Farmers
    const farmers = [
      {
        name: 'Rajesh Kumar',
        email: 'farmer1@agriconnect.com',
        phone: '+91 98765 43210',
        password: 'farmer123',
        location: 'Guntur, Andhra Pradesh',
        role: 'farmer'
      },
      {
        name: 'Suresh Reddy',
        email: 'farmer2@agriconnect.com',
        phone: '+91 98765 43211',
        password: 'farmer123',
        location: 'Vijayawada, Andhra Pradesh',
        role: 'farmer'
      },
      {
        name: 'Venkat Rao',
        email: 'farmer3@agriconnect.com',
        phone: '+91 98765 43212',
        password: 'farmer123',
        location: 'Kurnool, Andhra Pradesh',
        role: 'farmer'
      }
    ];

    // Seed Experts
    const experts = [
      {
        name: 'Dr. Priya Sharma',
        email: 'expert1@agriconnect.com',
        phone: '+91 98765 43220',
        password: 'expert123',
        location: 'Hyderabad, Telangana',
        role: 'expert'
      },
      {
        name: 'Dr. Ramesh Yadav',
        email: 'expert2@agriconnect.com',
        phone: '+91 98765 43221',
        password: 'expert123',
        location: 'Bangalore, Karnataka',
        role: 'expert'
      },
      {
        name: 'Dr. Anil Kumar',
        email: 'expert3@agriconnect.com',
        phone: '+91 98765 43222',
        password: 'expert123',
        location: 'Chennai, Tamil Nadu',
        role: 'expert'
      }
    ];

    // Seed Government Users
    const governmentUsers = [
      {
        name: 'Arun Patel',
        email: 'gov1@agriconnect.com',
        phone: '+91 98765 43230',
        password: 'gov123',
        location: 'Amaravati, Andhra Pradesh',
        role: 'government'
      },
      {
        name: 'Meera Singh',
        email: 'gov2@agriconnect.com',
        phone: '+91 98765 43231',
        password: 'gov123',
        location: 'Hyderabad, Telangana',
        role: 'government'
      }
    ];

    // Insert users
    const allUsers = [...farmers, ...experts, ...governmentUsers];
    
    for (const userData of allUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created ${userData.role}: ${userData.name} (${userData.email})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('\nFarmers:');
    farmers.forEach(f => console.log(`  Email: ${f.email}, Password: ${f.password}`));
    console.log('\nExperts:');
    experts.forEach(e => console.log(`  Email: ${e.email}, Password: ${e.password}`));
    console.log('\nGovernment:');
    governmentUsers.forEach(g => console.log(`  Email: ${g.email}, Password: ${g.password}`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

