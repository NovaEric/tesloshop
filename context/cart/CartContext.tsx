import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';



interface ContextProps {
      isLoaded: boolean;
      cart: ICartProduct[];
      numberOfItems: number;
      subTotal: number;
      tax: number;
      total: number;

      ShippingAddress?: ShippingAddress;


      addProductToCart: (product: ICartProduct) => void;
      updateCartQuantity: (product: ICartProduct) => void;
      removeCartItem: (product: ICartProduct) => void;
      updateAddress: (WholeAddress: ShippingAddress) => void;

      createOrder: () => Promise<{ hasError: boolean; message: string; }>;
};


export const CartContext = createContext({} as ContextProps);