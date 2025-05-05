import { MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
    var signin: () => string[];
  }

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = "teststring";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// afterAll(async () => {
//     await mongoose.connection.close();
//     if (mongo) {
//         await mongo.stop();
//     }
// });

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })

global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@dev.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}