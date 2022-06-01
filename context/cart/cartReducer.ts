import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';


type CartActionType =
    | { type: '[Cart] - LoadFromCookies|Storage', payload: ICartProduct[] }
    | { type: '[Cart] - UpdateCartProduct', payload: ICartProduct[] }
    | { type: '[Cart] - UpdateCartQuantity', payload: ICartProduct }
    | { type: '[Cart] - RemoveCartItem', payload: ICartProduct }
    | { type: '[Cart] - RemoveCartItem', payload: ICartProduct }
    | { type: '[Cart] - LoadAddressFromCookies', payload: ShippingAddress }
    | { type: '[Cart] - UpdateAddress', payload: ShippingAddress }
    | {
        type: '[Cart] - UpdateOrderSummary', payload: {
            numberOfItems: number;
            subTotal: number;
            tax: number;
            total: number;
        }
    }
    | { type: '[Cart] - Order Complete' }

export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[Cart] - LoadFromCookies|Storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[Cart] - UpdateCartProduct':
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[Cart] - UpdateOrderSummary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - LoadAddressFromCookies':
        case '[Cart] - UpdateAddress':
            return {
                ...state,
                ShippingAddress: action.payload
            }
        case '[Cart] - RemoveCartItem':
            return {
                ...state,
                cart: state.cart.filter(item => !(item._id === action.payload._id && item.size === action.payload.size))
            }
        case '[Cart] - UpdateCartQuantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;
                    return action.payload;
                })
            }
        case '[Cart] - Order Complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0,
            }    
        default:
            return state;
    }
};