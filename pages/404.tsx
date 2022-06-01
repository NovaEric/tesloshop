import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";


export const Custom404 = () => {
  return (
    <ShopLayout title='Page not found' pageDescription='Nothing to show here'>
        <Box 
            display='flex'
            sx={{ flexDirection: { xs: 'column' , sm: 'row' } }} 
            justifyContent='center' 
            alignItems='center' 
            height='calc( 100vh - 200px )'

        >
            <Typography variant='h1' component='h1' fontSize={80} fontWeight={200} > 404 | </Typography>
            <Typography ml={2} > Page not found </Typography>
        </Box>
    </ShopLayout>
  )
};

export default Custom404;
