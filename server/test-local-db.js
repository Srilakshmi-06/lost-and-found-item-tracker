require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection to local:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('Trying to list collections...');
    const result = await mongoose.connection.db.listCollections().toArray();
    console.log('Success, collections:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  });
