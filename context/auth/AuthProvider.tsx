import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { authReducer, AuthContext } from './';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { useRouter } from 'next/router';



export interface AuthState { isLoggedIn: boolean; user?: IUser };

const Auth_INITIAL_STATE: AuthState = { isLoggedIn: false, user: undefined };

interface Props { children?: React.ReactNode | undefined };

export const AuthProvider: FC<PropsWithChildren<Props>> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
    
    const {data, status} = useSession();
    
    const router = useRouter();

    useEffect(() => {
        
        if ( status === 'authenticated' ){
            dispatch({type: '[Auth] - Login', payload: data?.user as IUser});
        }
    
    }, [data, status])
    

    // useEffect(() => {
    //     checkToken();
    // }, [])

    const checkToken = async () => {

        if (!Cookies.get('token')) return;

        try {
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });

        } catch (error) {
            Cookies.remove('token');
        }
    }

    const loginUser = async (email: string, password: string): Promise<boolean> => {

        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;

        } catch (error) {
            return false;
        }
    };
    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {

        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return { hasError: false };

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError
                return {
                    hasError: true,
                    message: err.message
                }
            }

            return {
                hasError: true,
                message: 'Something when wrong'
            }
        }
    };

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        signOut();
    }
        // router.reload();
        // Cookies.remove('token');
    
    return (

        <AuthContext.Provider value={{ ...state, loginUser, registerUser, logout }}>
            {children}
        </AuthContext.Provider>

    )
};