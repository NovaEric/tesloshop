import { Box, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from '../../interfaces/products';

interface Props { products: IProduct[]; foundProducts: boolean; query: string };

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title='Teslo Shop - Search' pageDescription='This Eric Startup' >
      <Typography variant='h1' component='h1' > Search Products </Typography>
      {
        foundProducts
          ? (
            <Box display='flex' >
              <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>  Matches found for   </Typography>
              <Typography variant='h2' sx={{ ml: 1, color: 'seagreen', fontWeight: 600 }} textTransform='capitalize' >  "{query}"  </Typography>
            </Box>
          )
          : (
            <Box display='flex' >
              <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>  No Matches found for   </Typography>
              <Typography variant='h2' sx={{ ml: 1, color: 'tomato', fontWeight: 600 }} textTransform='capitalize'>  "{query}"  </Typography>
            </Box>
          )
      }
      <ProductList products={products} />
    </ShopLayout>
  )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query: string };

  if (query.length === 0) {

    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  };

  let products = await dbProducts.getProductsByTerm(query);

  const foundProducts = products.length > 0;

  if (!foundProducts) {
     products = await dbProducts.getAllProducts();
  };

  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}


export default SearchPage;
