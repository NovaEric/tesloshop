import { useState, useContext } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';


interface Props { product: IProduct}

export const ProductPage: NextPage<Props> = ({product}) => {

  const router = useRouter();

  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    setTempCartProduct( currenProduct => ({
      ...currenProduct,
      size
    }));
  };

  const onUpdatedQuantity = (quantity: number) => {
    setTempCartProduct( currenProduct => ({
      ...currenProduct,
      quantity
    }));
  };

  const onAddProduct = () => {
    
    if ( !tempCartProduct.size ) return;

    addProductToCart( tempCartProduct );
    router.push('/cart');
    
  }

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>

      <Grid container spacing={ 3 }>

        <Grid item xs={ 12 } sm={ 7 } >
          <ProductSlideShow images={ product.images } />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 } >
            <Box display='flex' flexDirection='column' >

              {/* titles */}
              <Typography variant='h1' component='h1' > { product.title } </Typography>
              <Typography variant='subtitle1' component='h2' > { `$${product.price}` } </Typography>

              {/* Quantity */}
              <Box sx={{ my: 2 }} >
                <Typography variant='subtitle2' > Quantity </Typography>
                <ItemCounter
                  currentValue={ tempCartProduct.quantity }
                  updatedQuantity={ onUpdatedQuantity }
                  maxValue={ product.inStock > 10 ? 10 : product.inStock }
                />
                <SizeSelector 
                  selectedSize={ tempCartProduct.size } 
                  sizes={product.sizes} 
                  onSelectedSize={selectedSize}
                />
              </Box>

              {/* Add to cart */}
            {
              (product.inStock > 0)

                ? <Button 
                    color='secondary' 
                    className='circular-btn' 
                    disabled={ tempCartProduct.size ? false : true }
                    onClick={ onAddProduct }
                  >
                  {
                    tempCartProduct.size ? 'Add to the cart' : 'Select size'
                  }
                  </Button>

                : <Chip label='Out of stock' color='error' variant='outlined' />

            }


              {/* Description */}
              <Box sx={{ mt: 3 }} >
                <Typography variant='subtitle2' > Description </Typography>
                <Typography variant='body2' > { product.description } </Typography>
              </Box>
            </Box>
        </Grid>

      </Grid>

    </ShopLayout>
  )
};


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({params}) => {

//   const { slug = '' } = params as {slug: string};
//   const product = await dbProducts.getProductBySlug(slug); 
  
//   if ( !product ){
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// };

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const slugs = await dbProducts.getAllProductSlugs();

  return {
    paths: slugs.map( ({slug}) => ({ params: { slug }})),
    fallback: 'blocking'
  }
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.


export const getStaticProps: GetStaticProps = async ({params}) => {
  
  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 4
  }
};

export default ProductPage;