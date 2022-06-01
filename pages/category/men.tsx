import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks/useProducts";



const MenPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title='Teslo Shop - Men' pageDescription='This Eric Startup' >
        <Typography variant='h1' component='h1' > Store - Men </Typography>
        <Typography variant='h2' sx={{ mb: 1}} > Men </Typography>
        
      {
        isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products } />
      }
        
    </ShopLayout>
  )
};

export default MenPage;
