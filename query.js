const express = require("express")
const app = express();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const uri = "mongodb+srv://Test:7TLjJuHQRqSowKHE@safecall.n9jr0.mongodb.net/?retryWrites=true&w=majority";
const database = 'userData';
const collectionName = 'facteur';



async function connection(room) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const existingDoc = await collection.findOne({ room });
        if (existingDoc) {
            console.log(`Document with room "${room}" already exists. No new document created.`);
            client.close();
            return;
        }

        const document = { room, messages: [] }; // Champ messages avec un tableau vide
        const result = await collection.insertOne(document);
        console.log('New document created:', result.insertedId);

    } catch (error) {
        console.error('Error creating document:', error);
    }
}

async function conv(room) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);
        const filter = { room: room };
        const document = await collection.findOne(filter);

        if (document) {
            const messages = document.messages;
            console.log('Messages:', messages);
            return messages
        } else {
            console.log('Document not found for room:', room);
        }

    } catch (error) {
        console.error('Error retrieving and transforming messages:', error);
    }
}

async function save_mess(room, username, mess) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);
        messages = [username, mess]

        const filter = { room: room };
        const document = await collection.findOne(filter);

        if (document) {
            const update = { $push: { messages: messages } };
            const result = await collection.updateOne(filter, update);
            console.log('Document updated:', result.modifiedCount);
        } else {
            console.log('Document not found for room:', room);
        }

    } catch (error) {
        console.error('Error updating document:', error);
    }
}

async function get_friends(keyword) {
    const fieldName = 'room';

    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const query = { [fieldName]: { $regex: keyword, $options: 'i' } };

        const documents = await collection.find(query).toArray();

        if (documents.length > 0) {
            return documents;
        } else {
            return []
        }
    } catch (err) {
        console.error(err);
    }
}


// app.listen(8000, () => {
//     console.log(`Example app listening on port 8000`)
// })

module.exports = { get_friends, connection, save_mess, conv }


