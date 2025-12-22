import { MongoClient } from 'mongodb';
import { MONGO_URI } from '$env/static/private';

const client = new MongoClient(MONGO_URI);
export const db = client.db('neodex');