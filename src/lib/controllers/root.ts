import { Request, Response } from "express";
import clientPromise from "../mongodb";
import DBKeys from "../consts/DBKeys";

export async function indexController(req: Request, res: Response)
{
    try
    {
        const client = await clientPromise;
        const col = client.db(process.env.DB_NAME).collection(DBKeys.ConfigCollection);
        const doc = (await col.findOne({ name: "backend-configs" })) as any;
        return res.status(200).json(doc.responses.root);
    } catch (err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
}

