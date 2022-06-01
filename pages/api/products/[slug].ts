import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data = | {message: string;} | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProductBySlug( req, res );
        default:
            return res.status(400).json({ message: 'Wrong method' });
    }
}

const getProductBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { slug } = req.query;

    await db.connect();
    const ProductBySlug = await Product.findOne({slug}).lean();
    await db.disconnect();

    if (!ProductBySlug) {

        await db.disconnect();
        return res.status(400).json({ message: 'Nothing found with SLug: ' + slug });
        
    };
    
    res.status(200).json( ProductBySlug );
}
