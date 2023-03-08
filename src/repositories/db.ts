import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import {
    AuthDBModel,
    BlogDBModel,
    CommentDBModel,
    IpDataDBModel,
    PostDBModel,
    SecurityDevicesDBModel,
    UserDBModel
} from "../types/dbType";

dotenv.config()

const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
    throw new Error('! URL DOESNT FOUND ')
}
export const client = new MongoClient(mongoUri);

const db = client
    .db("Kamasutra");
export const blogsCollections = db
    .collection<BlogDBModel>("Blogs");
export const postsCollections = db
    .collection<PostDBModel>("Posts");
export const usersCollections = db
    .collection<UserDBModel>("Users");
export const commentsCollections = db
    .collection<CommentDBModel>("Comments");
export const authCollections = db
    .collection<AuthDBModel>("Auth");
export const securityDevicesCollections = db
    .collection<SecurityDevicesDBModel>("SecurityDevices");
export const ipDataCollections = db
    .collection<IpDataDBModel>("ipData");


export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("Kamasutra").command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Cant connect to mongo server");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
