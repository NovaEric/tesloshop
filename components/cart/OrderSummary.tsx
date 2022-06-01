import { FC, useContext } from 'react';
import { Grid, Typography } from "@mui/material"
import { CartContext } from '../../context';
import { formatCurrency } from '../../utils/currency';
import { IOrder } from '../../interfaces';


interface Props { orderSum?: IOrder };

export const OrderSummary: FC<Props> = ({ orderSum }) => {

    const cartOrder = useContext(CartContext);

    const numberOfItems = orderSum ? orderSum.numberOfItems : cartOrder.numberOfItems;
    const subTotal = orderSum ? orderSum.subTotal : cartOrder.subTotal;
    const total = orderSum ? orderSum.total : cartOrder.total;
    const tax = orderSum ? orderSum.tax : cartOrder.tax;

    return (
        <Grid container >

            <Grid item xs={6} >
                <Typography> Items Qty. </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end' >
                <Typography> {numberOfItems} {numberOfItems > 1 ? 'items' : 'item'} </Typography>
            </Grid>

            <Grid item xs={6} >
                <Typography> Subtotal </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end' >
                <Typography> {formatCurrency(subTotal)} </Typography>
            </Grid>

            <Grid item xs={6} >
                <Typography> Tax </Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end' >
                <Typography> {formatCurrency(tax)} </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }} >
                <Typography variant='subtitle1' > Total:  </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end' >
                <Typography variant='subtitle1' > {formatCurrency(total)} </Typography>
            </Grid>

        </Grid>
    )
};
