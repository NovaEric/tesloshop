import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { PayPalButtons } from '@paypal/react-paypal-js';

import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material";

import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { tesloApi } from '../../api';




export type OrderResponseBody = {
    id: string;
    status: | 'COMPLETED'
    | 'SAVED'
    | 'APPROVED'
    | 'VOIDED'
    | 'PAYER_ACTION_REQUIRED';

};

interface Props { order: IOrder };

const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter();

    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async (details: OrderResponseBody) => {

        if (details.status !== 'COMPLETED') {
            return alert('No payment has been made');
        };

        setIsPaying(true);

        try {

            await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }
    
    return (
        <ShopLayout title='Order Summary' pageDescription='Order Summary' >

            <Grid container spacing={2} sx={{ mb: 2, mt: 4 }} >
                <Typography variant='h1' component='h1' sx={{ mr: 2 }} > Order: {order._id} </Typography>

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
                            <Typography> {order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName} </Typography>
                            <Typography>
                                {order.shippingAddress.address} {order.shippingAddress.address2 !== '' && order.shippingAddress.address2}
                            </Typography>
                            <Typography> {order.shippingAddress.city + ' ' + order.shippingAddress.zip} </Typography>
                            <Typography> {order.shippingAddress.country} </Typography>
                            <Typography> {order.shippingAddress.phone} </Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary orderSum={order} />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >

                                <Box
                                    justifyContent='center'
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>

                                <Box display={ isPaying ? 'none' : 'flex' } flex={1} flexDirection='column' > 

                                    {
                                        !order.isPaid &&
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: order.total.toString(),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted(details);
                                                    // const name = details.payer.name.given_name;
                                                    // alert(`Transaction completed by ${name}`);
                                                });
                                            }}
                                        />
                                    }

                                </Box>
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

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=orders/${id}`,
                permanent: false,
            }
        }
    };

    const order = await dbOrders.getOrderById(id.toString());

    if (!order || order.user !== session.user._id) {
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
