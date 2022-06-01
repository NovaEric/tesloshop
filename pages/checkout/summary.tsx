import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import NextLink from "next/link";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from '../../context';
import { countries } from '../../utils';
import { useRouter } from "next/router";
import Cookies from "js-cookie";


const SummaryPage = () => {

    const router = useRouter();

    const {ShippingAddress, numberOfItems, createOrder} = useContext(CartContext);

    const [ isPosting, setIsPosting ]       = useState(false);
    const [ errorMessage,setErrorMessage ]  = useState('');

    useEffect(() => {
        if ( !Cookies.get('firstName' )) { router.push('/checkout/address' );};
    }, [router]);

    const onCreateOrder = async() => {

        setIsPosting(true);
        
        const {hasError, message} = await createOrder();

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        };

        router.replace(`/orders/${ message }`);
    }

    if ( !ShippingAddress ) {
        return <></>;
    };

  return (
    <ShopLayout title='Order Summary' pageDescription='Orders Summary' >
        
        <Typography variant='h1' component='h1' > Order Summary </Typography>

        <Grid container >

            <Grid item xs={12} sm={7} >
                <CartList />
            </Grid>

            <Grid item xs={12} sm={5} >
                <Card className='summary-card' >
                    <CardContent>
                    <Typography variant='h2' component='h2' > Summary ({numberOfItems} {numberOfItems > 1 ? 'items' : 'item'} ) </Typography>
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='space-between' >
                            <Typography variant='subtitle1' > Shipping address </Typography>
                            <NextLink href='/checkout/address' passHref >
                                <Link underline='always' > Edit </Link>
                            </NextLink>
                        </Box>

                        <Typography> { ShippingAddress?.firstName + ' ' + ShippingAddress?.lastName } </Typography>
                        <Typography> { ShippingAddress?.address } </Typography>
                        <Typography> { ShippingAddress?.address2 } </Typography>
                        <Typography> { ShippingAddress?.city + ' ' + ShippingAddress?.zip  } </Typography>
                        <Typography> { countries.find( country => country.code === ShippingAddress?.country)?.name } </Typography>
                        <Typography> { ShippingAddress?.phone } </Typography>
                    
                        <Divider sx={{ my: 1 }} />

                        <Box display='flex' justifyContent='end' >
                            <NextLink href='/cart' passHref >
                                <Link underline='always' > Edit </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary/>

                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth 
                                onClick={onCreateOrder} 
                                disabled={isPosting}    
                            >
                                Confirm order
                            </Button>

                            <Chip
                                color='error'
                                label={ errorMessage }
                                sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>

    </ShopLayout>
  )
};

export default SummaryPage;
