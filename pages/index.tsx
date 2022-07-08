import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks/useProducts';

const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products');


  return (
    <ShopLayout title='Teslo Shop - All' pageDescription='This Eric Startup' >
        <Typography variant='h1' component='h1' > Store - All </Typography>
        <Typography variant='h2' sx={{ mb: 1}} > Unisex </Typography>

      {
        isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products } />
      }
        
    </ShopLayout>
  )
}

export default HomePage;
