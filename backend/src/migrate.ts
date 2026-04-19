import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google DNS to bypass ISP blocking of SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const LOCAL_URI = 'mongodb://localhost:27017/noon-academy';
const REMOTE_URI = 'mongodb+srv://Faisal:faisal2026@cluster0.o0fo9wo.mongodb.net/faisalAcademy?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  console.log('Connecting to Local Database...');
  const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
  
  console.log('Connecting to Remote Database (Atlas)...');
  const remoteConnection = await mongoose.createConnection(REMOTE_URI).asPromise();

  // Get the native db objects
  const localDb = localConnection.db;
  const remoteDb = remoteConnection.db;

  if (!localDb || !remoteDb) {
     throw new Error("Unable to access native DB objects");
  }

  // Fetch all collections from local DB
  const collections = await localDb.collections();
  console.log(`Found ${collections.length} collections locally.`);

  for (const collection of collections) {
    const name = collection.collectionName;
    console.log(`\n--- Starting migration for: ${name} ---`);
    
    const documents = await collection.find({}).toArray();
    
    if (documents.length === 0) {
      console.log(`No documents found in ${name}. Skipping.`);
      continue;
    }

    try {
      // Access remote collection
      const targetCollection = remoteDb.collection(name);
      
      // Clear remote collection first (optional, but good for clean migrations)
      await targetCollection.deleteMany({});
      
      // Insert locally fetched documents into remote DB
      await targetCollection.insertMany(documents);
      console.log(`✅ Successfully migrated ${documents.length} documents into ${name}.`);
    } catch (err) {
      console.error(`❌ Failed to migrate ${name}:`, err);
    }
  }

  // Close connections
  await localConnection.close();
  await remoteConnection.close();
  console.log('\n🎉 Database Migration Complete!');
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
