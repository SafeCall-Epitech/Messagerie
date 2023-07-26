const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Test:7TLjJuHQRqSowKHE@safecall.n9jr0.mongodb.net/?retryWrites=true&w=majority";
const database = 'userData';
const collectionName = 'facteur';

let client;

async function connect() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
}

// async function connection(room) {
//     try {
//         await connect();

//         const db = client.db(database);
//         const collection = db.collection(collectionName);

//         const existingDoc = await collection.findOne({ room });
//         if (existingDoc) {
//             console.log(`Document with room "${room}" already exists. No new document created.`);
//             return;
//         }

//         const document = { room, messages: [] };
//         const result = await collection.insertOne(document);
//         console.log('New document created:', result.insertedId);
//     } catch (error) {
//         console.error('Error creating document:', error);
//     }
// }

async function conv(room) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);
        const filter = { room };
        const document = await collection.findOne(filter);

        if (document) {
            const messages = document.messages;
            console.log('Messages:', messages);
            return messages;
        } else {
            console.log('Document not found for room:', room);
        }
    } catch (error) {
        console.error('Error retrieving and transforming messages:', error);
    }
}

// async function save_mess(room, username, mess) {
//     try {
//         await connect();

//         const db = client.db(database);
//         const collection = db.collection(collectionName);
//         const messages = [username, mess];

//         const filter = { room };
//         const document = await collection.findOne(filter);

//         if (document) {
//             const update = { $push: { messages: messages } };
//             const result = await collection.updateOne(filter, update);
//             console.log('Document updated:', result.modifiedCount);
//         } else {
//             console.log('Document not found for room:', room);
//         }
//     } catch (error) {
//         console.error('Error updating document:', error);
//     }
// }

async function get_friends(keyword) {
    const fieldName = 'room';

    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const query = { [fieldName]: { $regex: keyword, $options: 'i' } };

        const documents = await collection.find(query).toArray();

        if (documents.length > 0) {
            return documents;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
    }
}



async function connection(room) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const existingDoc = await collection.findOne({ room });
        if (existingDoc) {
            console.log(`Document with room "${room}" already exists. No new document created.`);
            return;
        }

        const document = { room, messages: [], last_mess: "" };
        const result = await collection.insertOne(document);
        console.log('New document created:', result.insertedId);
    } catch (error) {
        console.error('Error creating document:', error);
    }
}


async function save_mess(room, username, mess) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);
        const messages = [username, mess];
        const lastMessage = `${username}: ${mess}`

        const filter = { room };
        const document = await collection.findOne(filter);

        if (document) {
            const update = { $push: { messages: messages }, $set: { last_mess: lastMessage } };
            const result = await collection.updateOne(filter, update);
            console.log('Document updated:', result.modifiedCount);
        } else {
            console.log('Document not found for room:', room);
        }
    } catch (error) {
        console.error('Error updating document:', error);
    }
}
module.exports = { get_friends, connection, save_mess, conv };
