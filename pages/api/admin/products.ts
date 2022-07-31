import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = 
| { message: string }
| IProduct[]
| IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts( req, res );
        case 'PUT':
            return updateProduct( req, res );
        case 'POST':
            return createProduct( req, res );
        default:
            return res.status(400).json({ message: 'Bad request' });
    };
};

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  
    await db.connect();

    const products = await Product.find().sort({title: 'asc'}).lean();

    await db.disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}` ;
        });

        return product;
    });
    

    res.status(200).json(updatedProducts);
};

const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({message: 'No valid Product ID'})
    };
    
    if (images.length < 2) {
        return res.status(400).json({message: 'Minimum two images required'})
    };

    //TODO: images repo

    try {

        await db.connect();
        const product = await Product.findById(_id);
        
        if (!product) {
            await db.disconnect();
            return res.status(400).json({message: 'No product was found with this ID'});
        };

        //https://res.cloudinary.com/dyej4hpgt/image/upload/v1659300042/f4sz9mi4fgjc012sdix4.png

        product.images.forEach(async(image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring( image.lastIndexOf('/') + 1).split('.'); //To get f4sz9mi4fgjc012sdix4 from url above
                console.log({image ,fileId, extension});
                cloudinary.uploader.destroy(fileId);
            }
        })
        
        await product.update(req.body);
        await db.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Server Error'})
    }
};

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {
        return res.status(400).json({message: 'Minimum two images required'})
    };

    //TODO: images repo

    try {

        await db.connect();
        const productInDB = await Product.findOne({slug: req.body.slug});
        
        if (productInDB) {
            await db.disconnect();
            return res.status(400).json({message: 'Product slug already exist'});
        };
        
        const product = new Product(req.body);
        await product.save();
        await db.disconnect();

        return res.status(201).json(product);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({message: 'Server Error'})
    }
};


