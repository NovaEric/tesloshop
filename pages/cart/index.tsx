import { useContext, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from 'next/router';
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";


const CartPage = () => {

    const {isLoaded, cart, ShippingAddress} = useContext(CartContext);

    const router = useRouter();

    useEffect(() => {
      
        if (isLoaded && cart.length === 0){
            router.replace('/cart/emptycart');
        };
      
    }, [isLoaded, cart, router]);

    if (!isLoaded || cart.length === 0) {return (<></>)};
    

    return (
        <ShopLayout title='Cart - 3' pageDescription='Shopping cart' >

            <Typography variant='h1' component='h1' > Cart </Typography>

            <Grid container >

                <Grid item xs={12} sm={7} >
                    <CartList editable />
                </Grid>

                <Grid item xs={12} sm={5} >
                    <Card className='summary-card' >
                        <CardContent>
                            <Typography variant='h2' component='h2' > Order </Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary />
                            <Box sx={{ mt: 3 }} >
                                <NextLink href={ ShippingAddress ? '/checkout/summary' : '/checkout/address' } passHref >
                                    <Link>
                                        <Button color='secondary' className='circular-btn' fullWidth >
                                            Checkout
                                        </Button>
                                    </Link>
                                </NextLink>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

        </ShopLayout>
    )
};

export default CartPage;
