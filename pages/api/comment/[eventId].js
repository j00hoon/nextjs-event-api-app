import { connectDatabase, insertDocument, getAllDocuments } from "../../../helpers/db-util";


async function handler(req, res) {

    const eventId = req.query.eventId;
    let client;

    try {
        client = await connectDatabase();
    } catch (err) {
        res.status(500).json({message : "Failed to connect the DB"});
        return;
    }

    
    if (req.method === "POST") {
        
        const { email, name, text } = req.body;

        if (!email || !email.includes('@') || 
            !name || !name.trim() === '' ||
            !text || !text.trim() === '') {

            res.status(422).json({message : "Invalid inputs."});

            return;  
        }

        const newComment = {
            email,
            name,
            text,
            eventId
        };


        let result;

        try {
            result = await insertDocument(client, "comments", newComment);
            
            newComment._id = result.insertedId;

            res.status(201).json({
                message : "Comment post success!",
                comments: newComment
            });                                       
        } catch (err) {
            res.status(500).json({message : "Failed to insert the data"});
        }


    } else if (req.method === "GET") {
        
        try {
            const documents = await getAllDocuments(client, "comments", {_id : -1}, { eventId : eventId});

            res.status(200).json({
                message : "Comments get!",
                comments : documents
            });
        } catch (err) {
            res.status(500).json({message : "Failed to get all the data"});
        }

    }
}

export default handler;











