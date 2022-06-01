import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import NextLink from "next/link";
import { getSession, signIn } from 'next-auth/react';
import { useForm } from "react-hook-form";

import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

import { AuthContext } from '../../context';
import { AuthLayout } from "../../components/layouts";
import { Validations } from "../../utils";



type FormData = { name: string, email: string, password: string, confirmPassword: string };

const RegisterPage = () => {

    const router = useRouter();

    const {registerUser} = useContext(AuthContext);

    const [showError, setShowError] = useState(false);
    
    const [msgError, setMsgError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onRegisterUser = async ({ name, email, password, confirmPassword }: FormData) => {

        if ( password !== confirmPassword ) return alert('Password must match');

        setShowError(false);

        const { hasError, message } = await registerUser( name, email, password );

        if (hasError) {
            setShowError(true);
            setMsgError( message! );
            setTimeout(() => { setShowError(false) }, 3000);
            return;
        };
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', {email, password});

    };

    return (
        <AuthLayout title='Register Page'>
            <form onSubmit={ handleSubmit(onRegisterUser) } noValidate > 
                <Box sx={{ width: 350, padding: '10px 20px' }} >
                    <Grid container spacing={2} >
                        <Grid item xs={12} >
                            <Typography variant='h1' component='h1' > Register </Typography>
                            <Chip
                                label='User already exist'
                                color='error'
                                icon={ <ErrorOutline/> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField type='text' label='Name' variant='filled' fullWidth {...register('name', {
                                required: 'Field required',
                                minLength: { value: 2, message: 'Two characters minimun' }
                            })}
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField type='email' label='Email' variant='filled' fullWidth {...register('email', {
                                required: 'Field required',
                                validate: Validations.isEmail
                            })}
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField type='password' label='Password' variant='filled' fullWidth {...register('password', {
                                required: 'Field required',
                                minLength: { value: 6, message: 'Six characters minimun' }
                            })} 
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField type='password' label='Confirm Password' variant='filled' fullWidth {...register('confirmPassword', {
                                required: 'Field required',
                                minLength: { value: 6, message: 'Six characters minimun' },
                            })} 
                            error={ !!errors.confirmPassword }
                            helperText={ errors.confirmPassword?.message }
                            />
                        </Grid>

                        <Grid item xs={12} >
                        <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth 
                            disabled={ (showError || errors. email || errors.password) ? true : false }
                        > Register </Button>    
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end' >
                            <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login' } passHref>
                                <Link underline='always' >
                                    Already Registered?
                                </Link>
                            </NextLink>
                        </Grid>

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
};

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    
    const session = await getSession({req});

    const {p='/'} = query;

    if (session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    };
    
    return {
        props: {
            
        }
    }
}

export default RegisterPage;
