import { FormEvent, FormEventHandler, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { GetServerSideProps } from 'next';
import { Box, Button, FormControl, Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
// import { JWT } from '../../utils';
import { CartContext } from '../../context';
import Cookies from 'js-cookie';

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
};


const getAddressFromCookies = ():FormData => {
    return {
        firstName:  Cookies.get('firstName')    || '',
        lastName:   Cookies.get('lastName')     || '',
        address :   Cookies.get('address')      || '',
        address2:   Cookies.get('address2')     || '',
        zip:        Cookies.get('zip')          || '',
        city :      Cookies.get('city')         || '',
        country:    Cookies.get('country')      || '',
        phone:      Cookies.get('phone')        || '',
    }
}

const AddressPage = () => {

    const router = useRouter();

    const {updateAddress} = useContext(CartContext);

    // const [countrySelected, setCountrySelected] = useState(getAddressFromCookies().country || '');
    const [countrySelected, setCountrySelected] = useState(getAddressFromCookies().country || 'MEX');

    const { register, handleSubmit, formState: { errors} } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });


    const onSubmit = ( Wholeaddress: FormData ) => {

        updateAddress(Wholeaddress);

        router.push('/checkout/summary');
        
    };

    return (
        <ShopLayout title='Address' pageDescription='Enter destination address' >

            <form onSubmit={handleSubmit(onSubmit)} >
                <Typography variant='h1' component='h1' > Address </Typography>

                <Grid spacing={2} container sx={{ mt: 2 }} >
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='First name' variant='filled' fullWidth {...register('firstName', {
                            required: 'Field required',
                            minLength: { value: 2, message: 'Two characters minimun' }
                        })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='Last name' variant='filled' fullWidth {...register('lastName', {
                            required: 'Field required',
                            minLength: { value: 2, message: 'Two characters minimun' }
                        })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='Address' variant='filled' fullWidth {...register('address', {
                            required: 'Field required',
                            maxLength: { value: 25, message: 'Max characters exceed' }
                        })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='Address(Optional)' variant='filled' fullWidth {...register('address2', {
                            maxLength: { value: 25, message: 'Max characters exceed' }
                        })}
                            error={!!errors.address2}
                            helperText={errors.address2?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField label='Postal code' variant='filled' fullWidth {...register('zip', {
                            required: 'Field required',
                            minLength: { value: 5, message: 'Must be 5 digit' },
                            maxLength: { value: 5, message: 'Must be 5 digit' }

                        })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='City' variant='filled' fullWidth {...register('city', {
                            required: 'Field required',
                            maxLength: { value: 15, message: 'Max characters exceed' }
                        })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <FormControl fullWidth >
                        <TextField variant='filled' label='Country' fullWidth select
                            value={countrySelected}
                            {...register('country', {
                                required: 'Field required'
                            })}
                            onChange={(e) => setCountrySelected( e.target.value )}
                            error={!!errors.country}
                            helperText={errors.city?.message}
                        >
                        {
                                    countries.map(country => (
                                        <MenuItem key={country.code} value={country.code} >{country.name}</MenuItem>
                                    ))
                                }
                         </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField type='text' label='Phone' variant='filled' fullWidth {...register('phone', {
                            required: 'Field required',
                            maxLength: { value: 10, message: 'Max characters exceed' }
                        })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center' >
                    <Button type='submit' color='secondary' className='circular-btn' size='large' > Revise order </Button>
                </Box>
            </form>

        </ShopLayout>
    )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({req}) => {

//     const {token = ''} = req.cookies;
//     let isValidToken = false;

//     try {
//         await JWT.isValidToken(token);
//         isValidToken = true;

//     } catch (error) {
//         isValidToken = false;
//     };

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }
//     return {
//         props: {

//         }
//     }
// }

export default AddressPage;
