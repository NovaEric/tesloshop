import { GetServerSideProps, NextPage } from 'next';
import NextLink from "next/link";

import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from "../../components/layouts";
import { IOrder } from "../../interfaces";
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';


const col: GridColDef[] = [

  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Full Name', width: 300 },
  {
    field: 'payment', headerName: 'Payment', description: 'Show payment info', width: 200,
    renderCell: (params: GridValueGetterParams) => <Chip
      color={ params.row.paid ? 'success' : 'error' }
      label={ params.row.paid ? 'Paid' : 'Pay' }
      variant='outlined'
    />
  },
  {
    field: 'link to order', headerName: 'Go To Order', sortable: false, width: 200,
    renderCell: (params: GridValueGetterParams) => 
    <NextLink href={ `/orders/${ params.row.orderId }` } passHref >
      <Link underline='always' >
        ...{params.row.orderIdLastFour}
      </Link>
    </NextLink>
  }
];

// const row = [

//   { id: 1, paid: true, fullname: 'Eric Nova' },
//   { id: 2, paid: false, fullname: 'Smith Ju' },
//   { id: 3, paid: true, fullname: 'Hu Koune' },
//   { id: 4, paid: false, fullname: 'Lone Diefhr' },
//   { id: 5, paid: true, fullname: 'Guydf Bay' },
//   { id: 6, paid: true, fullname: 'Messo Cobbar' },
// ];

interface Props { orders: IOrder[] };

const HistoryPage: NextPage<Props> = ({orders}) => {

  const row = orders.map((order, i) => ({
    id: i + 1,
    orderId: order._id,
    orderIdLastFour: order._id?.slice(-4),
    paid: order.isPaid,
    fullname: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
  }))
  
  return (
    <ShopLayout title='History' pageDescription='Orders history'>

      <Typography variant='h1' component='h1'> Orders History</Typography>

      <Grid container className='fadeIn'>

        <Grid item xs={12} sx={{ height: 650, width: '100%' }} >

          <DataGrid columns={col} rows={row} pageSize={10} rowsPerPageOptions={[10]} />

        </Grid>

      </Grid>

    </ShopLayout>
  )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  
  const session: any = await getSession({req});

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      }
    }
  };

  const orders = await dbOrders.getOrdersByUser(session.user._id);


  return {
    props: {
      orders
    }
  }
}

export default HistoryPage;
