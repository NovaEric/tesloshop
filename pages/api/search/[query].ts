import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';

type Data = | { message: string } | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProduct(req, res);
        default:
            return res.status(400).json({ message: 'Wrong method' });
    };
};

const searchProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {


    let { query = '' } = req.query;

    if (query.length === 0) {
        return res.status(400).json({ message: 'Nothing found' })
    };

    query = query.toString().toLowerCase();

    db.connect();
    const products = await Product.find({ $text: { $search: query } })
    .select(' title images price inStock slug -_id  ').lean();
    db.disconnect();

    return res.status(200).json( products )
};
