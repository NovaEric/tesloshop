import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";


const EmptyCartPage = () => {
    return (
        <ShopLayout title='Empty cart' pageDescription='Nothing in the cart'>
            <Box
                display='flex'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                justifyContent='center'
                alignItems='center'
                height='calc( 100vh - 200px )'

            >
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display='flex' ml={2} flexDirection='column'  alignItems='center' >
                    <Typography variant='h4' component='h4' color='red' > Cart is empty </Typography>
                    <NextLink href='/'  passHref >
                        <Link typography='h6' color='secondary' > Home Page </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
};

export default EmptyCartPage;
