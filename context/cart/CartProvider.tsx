import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { cartReducer, CartContext } from './';
import Cookies from 'js-cookie';
import {tesloApi} from '../../api';
import axios from 'axios';


export interface CartState { 
    isLoaded        : boolean;
    cart            : ICartProduct[]; 
    numberOfItems   : number;
    subTotal        : number;
    tax             : number;
    total           : number;
    ShippingAddress?: ShippingAddress;
};



const CART_INITIAL_STATE: CartState = { 
    isLoaded        : false,
    cart            : [],
    numberOfItems   : 0,
    subTotal        : 0,
    tax             : 0,
    total           : 0, 
    ShippingAddress: undefined
};

interface Props { };

export const CartProvider: FC<PropsWithChildren<Props>> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        
        try {

            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
            dispatch({ type: '[Cart] - LoadFromCookies|Storage', payload: cookieProducts });

        } catch (error) {
            dispatch({ type: '[Cart] - LoadFromCookies|Storage', payload: [] });
        }

    }, []);

    useEffect(() => {

        
      
        if (Cookies.get('firstName')) {

            const shippingAddress = {

                firstName:  Cookies.get('firstName')    || '',
                lastName:   Cookies.get('lastName')     || '',
                address :   Cookies.get('address')      || '',
                address2:   Cookies.get('address2')     || '',
                zip:        Cookies.get('zip')          || '',
                city :      Cookies.get('city')         || '',
                country:    Cookies.get('country')      || '',
                phone:      Cookies.get('phone')        || '',
            }

            dispatch({ type: '[Cart] - LoadAddressFromCookies', payload: shippingAddress });
        }

    }, [])
    

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);
   
   
    useEffect(() => {
        
        const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 );
        const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0 );
        const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * ( taxRate + 1 ), 
        };

        dispatch({ type: '[Cart] - UpdateOrderSummary', payload: orderSummary });
        
    }, [state.cart]);


    const addProductToCart = (product: ICartProduct) => {

        const productInCart = state.cart.some(p => p._id === product._id);
        if (!productInCart) return dispatch({ type: '[Cart] - UpdateCartProduct', payload: [...state.cart, product] });


        const productInCartButNotSameSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButNotSameSize) return dispatch({ type: '[Cart] - UpdateCartProduct', payload: [...state.cart, product] });

        const updatedProducts = state.cart.map(p => {

            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            p.quantity += product.quantity;
            return p;

        });

        dispatch({ type: '[Cart] - UpdateCartProduct', payload: updatedProducts })
    };


    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - UpdateCartQuantity', payload: product });
    };

    const removeCartItem = ( item: ICartProduct ) => {
        dispatch({ type: '[Cart] - RemoveCartItem', payload: item })
    };

    const updateAddress = (WholeAddress: ShippingAddress) => {

        Cookies.set('firstName', WholeAddress.firstName);
        Cookies.set('lastName', WholeAddress.lastName);
        Cookies.set('address', WholeAddress.address);
        Cookies.set('address2', WholeAddress.address2 || '');
        Cookies.set('zip', WholeAddress.zip);
        Cookies.set('city', WholeAddress.city);
        Cookies.set('country', WholeAddress.country);
        Cookies.set('phone', WholeAddress.phone);
        
        dispatch({ type: '[Cart] - UpdateAddress', payload: WholeAddress });
    }

    const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {

        if ( !state.ShippingAddress ) {
            throw new Error('Not Shipping address');
        };

        const body: IOrder = {
            orderItems      : state.cart.map( p => ({
                ...p,
                size        : p.size!
            })),
            shippingAddress : state.ShippingAddress,
            numberOfItems   : state.numberOfItems,
            subTotal        : state.subTotal,
            tax             : state.tax,
            total           : state.total,
            isPaid          : false
        }

        try {
            
            const {data} = await tesloApi.post('/orders', body);
            
            dispatch({ type: '[Cart] - Order Complete', });

            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.message
                }
            }

            return {
                hasError: true,
                message: 'Contact Administrator'
            }
        }
    };

    return (

        <CartContext.Provider value={{ 
            ...state, 
            addProductToCart, 
            updateCartQuantity, 
            removeCartItem, 
            updateAddress,
            createOrder, 
            }}>
            {children}
        </CartContext.Provider>

    )
};