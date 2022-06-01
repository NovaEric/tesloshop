import { IOrder } from '../interfaces';
import { isValidObjectId } from 'mongoose';
import { db } from '.';
import { Order } from '../models';


export const getOrderById = async( id: string ):Promise<IOrder | null> => {

    if ( !isValidObjectId(id) ) return null;
    
    await db.connect();
    const order = await Order.findById(id).lean();
    await db.disconnect();
    
    if ( !order ) return null;

    return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async( userId: string ):Promise<IOrder[]> => {

    if ( !isValidObjectId(userId) ) return [];
    
    await db.connect();
    const orders = await Order.find({user: userId}).lean();
    await db.disconnect();
    
    if ( !orders ) return [];

    return JSON.parse(JSON.stringify(orders));
};