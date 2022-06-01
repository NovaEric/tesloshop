import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import NextLink from "next/link";
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


interface Props { order: IOrder };


const OrderPage: NextPage<Props> = ({order}) => {

    return (
        <ShopLayout title='Order Summary' pageDescription='Order Summary' >
            
            <Grid container spacing={2} sx={{mb: 2, mt: 4}} >
                <Typography variant='h1' component='h1' sx={{mr: 2}} > Order: { order._id } </Typography>

                 <Chip
                label={order.isPaid ? 'Order is paid' : 'Pending payment'}
                variant='outlined'
                color={order.isPaid ? 'success' : 'error'}
                icon={order.isPaid ? <CreditScoreOutlined /> : <CreditCardOffOutlined />}
                 />
            </Grid>

            <Divider sx={{ my: 1 }} />

            <Grid container className='fadeIn'>

                <Grid item xs={12} sm={7} >
                    <CartList products={order.orderItems} />
                </Grid>

                <Grid item xs={12} sm={5} >
                    <Card className='summary-card' >
                        <CardContent>
                            <Typography 
                                variant='subtitle1' 
                                component='h2' > Summary ({order.numberOfItems} product{order.numberOfItems > 1 && 's'}) 
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant='subtitle1'> Shipping Address: </Typography>
                            <Typography> {order.shippingAddress.firstName + ' ' + order.shippingAddress.firstName } </Typography>
                            <Typography> 
                                {order.shippingAddress.address} {order.shippingAddress.address2 !== '' && order.shippingAddress.address2} 
                            </Typography>
                            <Typography> {order.shippingAddress.city + ' ' + order.shippingAddress.zip} </Typography>
                            <Typography> {order.shippingAddress.country} </Typography>
                            <Typography> {order.shippingAddress.phone} </Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary orderSum={order} />

                            <Box sx={{ mt: 3 }}  display='flex' flexDirection='column'>

                                {
                                    !order.isPaid &&
                                    <Button color='secondary' className='circular-btn' fullWidth >
                                        Pay
                                    </Button>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

        </ShopLayout>
    )
};


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const { id = '' } = query;  
    const session:any = await getSession({req});

    if ( !session ) {
        return {
            redirect: {
                destination: `/auth/login?p=orders/${id}`,
                permanent: false,
            }
        }
    };

    const order = await dbOrders.getOrderById( id.toString() );

    if ( !order || order.user !== session.user._id ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    };

    return {
        props: {
            order
        }
    };
};

export default OrderPage;
