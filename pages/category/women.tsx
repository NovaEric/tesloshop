import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks/useProducts";



const WomenPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title='Teslo Shop - Women' pageDescription='This Eric Startup' >
        <Typography variant='h1' component='h1' > Store - Women </Typography>
        <Typography variant='h2' sx={{ mb: 1}} > Women </Typography>
        
      {
        isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products } />
      }
        
    </ShopLayout>
  )
};

export default WomenPage;
