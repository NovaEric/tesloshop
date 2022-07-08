import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data = | {message: string} | IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad request' })
    }
};

const createOrder = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    const {orderItems, total} = req.body as IOrder;

    const session: any = await getSession({req});
    if (!session) return res.status(401).json({ message: 'Must Be Authenticated' });

    const productsIds = orderItems.map( product => product._id );

    await db.connect();
    const dbproductsPerUser = await Product.find({ _id: { $in: productsIds } });
    
    try {
        
        const subTotal = orderItems.reduce( (prev, current) => {

            const currentPrice = dbproductsPerUser.find( prod => prod.id === current._id )?.price;

            if (!currentPrice) throw new Error('Verify Product');

            return (currentPrice * current.quantity) + prev; 
        }, 0);



        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backEndTotal = subTotal * (taxRate + 1);

        if (total !== backEndTotal) throw new Error('Total amount do not match with backend');

        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;
        await newOrder.save();

        await db.disconnect();

        res.status(200).json( newOrder);


    } catch (error: any) {

        await db.disconnect();
        console.log(error);
        res.status(400).json({ message: error.message || 'Check Server Logs' });
        
    };

    // return res.status(201).json(req.body);

}