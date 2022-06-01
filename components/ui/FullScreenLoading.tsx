import { Box, CircularProgress } from "@mui/material"


export const FullScreenLoading = () => {
  return (
    <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        height='calc( 100vh - 200px )'
    >

        <CircularProgress thickness={ 3 } />

    </Box>
  )
}
