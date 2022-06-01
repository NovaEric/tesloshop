import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { db } from '../../../database';
import { User } from '../../../models';
import { JWT, Validations } from '../../../utils';

type Data = 
| { message: string }
| { 
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
 }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser( req, res )
        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    if ( password.length < 6 ){
        return res.status(400).json({ message: 'Password must be greater than SIX characters'})
    };
    
    if ( name.length < 2 ){
        return res.status(400).json({ message: 'Name must be greater than TWO characters'})
    };

    if ( !Validations.isValidEmail( email ) ){
        return res.status(400).json({ message: 'Not a valid EMAIL'})
    };



    await db.connect();
    const user = await User.findOne({ email });
    
    if ( user ) {
        return res.status(400).json({ message: 'Email already exist, try login in' })
    };
    
    await db.disconnect();

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ),
        role: 'client',
        name,
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Check server logs!' })
    };
    
    

    const { role, _id } = newUser;

    const token = JWT.signToken( _id, email );

    return res.status(200).json({
        token,
        user: { email, role, name }
     });

}
