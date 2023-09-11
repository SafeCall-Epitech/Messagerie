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

async function save_mess(room, username, mess) {
    const d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);
        const messages = [username, mess, hour + ":" + min];
        const lastMessage = `${username}: ${mess} ${hour + ":" + min}`;

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

// async function get_friends(keyword) {
//     const fieldName = 'room';

//     try {
//         await connect();

//         const db = client.db(database);
//         const collection = db.collection(collectionName);

//         const query = { [fieldName]: { $regex: keyword, $options: 'i' } };

//         const documents = await collection.find(query).toArray();

//         if (documents.length > 0) {
//             // Récupérer le champ "last_mess" pour chaque document et l'ajouter sous forme de tableau
//             const friendList = documents.map(doc => ({ room: doc.room, last_mess: doc.last_mess }));

//             return friendList;
//         } else {
//             return [];
//         }
//     } catch (err) {
//         console.error(err);
//     }
// }

async function findLastMessageByRoom(room) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const filter = { room };
        const projection = { _id: 0, last_mess: 1 }; // Inclure uniquement le champ "last_mess" dans le résultat
        const sort = { _id: -1 }; // Tri décroissant pour récupérer le dernier document en premier

        const document = await collection.findOne(filter, { projection, sort });

        if (document && document.last_mess) {
            const lastMessage = document.last_mess;
            console.log('Last message in room:', lastMessage);
            return lastMessage;
        } else {
            console.log('No document found for room:', room);
            return null;
        }
    } catch (error) {
        console.error('Error finding last message:', error);
    }
}


module.exports = { get_friends, connection, save_mess, conv, findLastMessageByRoom };
