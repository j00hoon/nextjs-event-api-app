import { connectDatabase, insertDocument } from "../../../helpers/db-util";



async function handler(req, res) {
    if (req.method === "POST") {
        const email = req.body.email;

        if (!email || !email.includes('@')) {
            res.status(422).json({message : "Invalid email address."});
            return;  
        }

        let client;

        try {
            client = await connectDatabase();
        } catch (err) {
            res.status(500).json({message : "Failed to connect the DB"});
            return;
        }   

        try {
            await insertDocument(client, "emails", {email : email});
        } catch (err) {
            res.status(500).json({message : "Failed to insert the data"});
            return;
        }

        res.status(201).json({message : "Sign up success!", email : email});
    }
}

export default handler;