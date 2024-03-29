import { AddOutlined, ConfirmationNumberOutlined } from "@mui/icons-material"
import { Box, Button, CardMedia, Grid, Link } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from "../../components/layouts"
import useSWR from 'swr';
import { IProduct } from "../../interfaces";
import NextLink from "next/link";





const columns:GridColDef[] = [
  {
    field: 'img', headerName: 'Photo',
    renderCell: ({row}: GridValueGetterParams ) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer' >
          <CardMedia
            component='img'
            alt={ row.title }
            className='fadeIn'
            image={row.img}
          />
        </a>
      )
    }
  },
  {
    field: 'title', 
    headerName: 'Title', 
    width: 250,
    renderCell: ({row}: GridValueGetterParams ) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref >
          <Link underline='always' >
              { row.title }
          </Link>
        </NextLink>
      )
    }
  },
  {field: 'gender', headerName: 'Gender'},
  {field: 'type', headerName: 'Type'},
  {field: 'inStock', headerName: 'Inventary'},
  {field: 'price', headerName: 'Price'},
  {field: 'sizes', headerName: 'Sizes', width: 250},
  
];

const ProductsPage = () => {

  const {data, error} = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return (<></>);

  const rows = data!.map( product => ({
    id:      product._id,
    img:     product.images[0],
    title:   product.title,
    gender:  product.gender,
    type:    product.type,
    inStock: product.inStock,
    sizes:   product.price,
    price:   product.sizes.join(', '),
    slug:    product.slug,
  }));

  return (
    <AdminLayout title={`Products (${ data?.length })`} subTitle={'Products Manager'} icon={<ConfirmationNumberOutlined />} >
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }} >
        <Button
          startIcon={<AddOutlined/>}
          color='secondary'
          href='/admin/products/new'
        >
          Add Product
        </Button>
      </Box>
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

export default ProductsPage