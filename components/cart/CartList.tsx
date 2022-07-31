import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { CartContext } from '../../context';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { ICartProduct, IOrderItem } from '../../interfaces';


interface Props { editable?: boolean; products?: IOrderItem[] };

export const CartList: FC<Props> = ({ editable = false, products }) => {

  const {cart, updateCartQuantity, removeCartItem} = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct, newCartQuantityValue: number) => {
    product.quantity = newCartQuantityValue;
    updateCartQuantity( product );
  };

  const productsToShow = products ? products : cart;

  return (
    <>
        {
            productsToShow.map( product => (
                <Grid key={product.slug + product.size} container spacing={2} sx={{ mb: 1 }} > 
                  <Grid item xs={ 3 } >
                    <NextLink href={ `/product/${ product.slug }` } passHref >
                      <Link>
                        <CardActionArea>
                          <CardMedia 
                            image={ product.image }
                            component='img'
                            sx={{ borderRadius: '5px' }}
                          />
                        </CardActionArea>
                      </Link>
                    </NextLink>
                  </Grid>

                  <Grid item xs={6} >
                      <Box display='flex' flexDirection='column' mx={1} >
                          <Typography variant='body1' >{ product.title }</Typography>
                          <Typography variant='body1' > Sizes:  <strong>{ product.size }</strong></Typography>
                          {
                            editable 
                            ? <ItemCounter
                                currentValue={ product.quantity }
                                maxValue={ 10 }
                                updatedQuantity={ (value) => onNewCartQuantityValue( product as ICartProduct, value)  }
                              />
                            : <Typography variant='h6'> { product.quantity } { product.quantity > 1 ? 'items' : 'item' }  </Typography>

                          }
                      </Box>
                  </Grid>

                  <Grid item xs={2} display='flex' flexDirection='column' alignItems='center' >
                          <Typography variant='subtitle1' >{ `$${product.price}` }</Typography>
                          {
                            editable && <Button variant='text' color='secondary' onClick={() => removeCartItem(product as ICartProduct)} > 
                              Remove 
                            </Button>
                          }
                  </Grid>
                </Grid>
            ))
        }
    </>
  )
};
