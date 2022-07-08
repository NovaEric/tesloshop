import { ConfirmationNumberOutlined } from "@mui/icons-material"
import { Chip, Grid } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from "../../components/layouts"
import useSWR from 'swr';
import { IOrder, IUser } from "../../interfaces";



const columns:GridColDef[] = [
  {field: 'id', headerName: 'Order ID', width: 250},
  {field: 'email', headerName: 'Email', width: 250},
  {field: 'name', headerName: 'Full Name', width: 300},
  {field: 'total', headerName: 'Total Amount', width: 200},
  {
    field: 'isPaid', headerName: 'Payment', width: 200,
    renderCell: ({row}: GridValueGetterParams) => {
      return <Chip variant='outlined' label={row.isPaid ? 'Paid' : 'Pending'} color={row.isPaid ? 'success' : 'error'} />
    }
  },
  {field: 'itemsQuantity', headerName: 'Items Quantity', width: 200, align: 'center'},
  {
    field: 'check', headerName: 'Go to Order', width: 200,
    renderCell: ({row}: GridValueGetterParams) => {
      return (
        <a href={`/orders/${row.id}`} target='_blank' rel='noreferrer' >
          See Order
        </a>
      )
    }
  },
  {field: 'createdAt', headerName: 'Created At', width: 200},
];

const OrdersPage = () => {

  const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return (<></>);

  const rows = data!.map( order => ({
    id:             order._id,
    email:          (order.user as IUser).email,
    name:           (order.user as IUser).name,
    total:          order.total,
    isPaid:         order.isPaid,
    itemsQuantity:  order.numberOfItems,
    createdAt:      order.createdAt,
  }));

  return (
    <AdminLayout title={'Orders'} subTitle={'Orders Manager'} icon={<ConfirmationNumberOutlined />} >
      <Grid container className='fadeIn' >
        <Grid item xs={12} sx={{ height: 650, width: '100%' }} >
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default OrdersPage