import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";



const KidsPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kids');

    return (
        <ShopLayout title='Teslo Shop - Kids' pageDescription='This Eric Startup' >
        <Typography variant='h1' component='h1' > Store - Kids </Typography>
        <Typography variant='h2' sx={{ mb: 1}} > Kids </Typography>
        
      {
        isLoading
        ? <FullScreenLoading/>
        : <ProductList products={ products } />
      }
        
    </ShopLayout>
    )
  };
  
  export default KidsPage;
  