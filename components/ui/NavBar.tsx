import { UiContext } from '../../context';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { CartContext } from '../../context';


export const NavBar = () => {

    const router = useRouter();
    
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const onSearchTerm = () => {

        if (searchTerm.trim().length === 0 ) return;
        router.push(`/search/${ searchTerm }`);
        setSearchTerm('')
    }

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref >
                    <Link display='flex' alignItems='center' >
                        <Typography variant='h6' > Teslo | </Typography>
                        <Typography sx={{ ml: 0.5 }} > Shop </Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box sx={{ display: isSearching ?  'none' : { xs: 'none', sm: 'flex'} }}  >
                    <NextLink href='/category/men' passHref >
                        <Link>
                            <Button color={ router.asPath === '/category/men' ? 'primary' : 'info' } > Men </Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref >
                        <Link>
                            <Button color={ router.asPath === '/category/women' ? 'primary' : 'info' } > Women </Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kids' passHref >
                        <Link>
                            <Button color={ router.asPath === '/category/kids' ? 'primary' : 'info' } > Kids </Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {
                    isSearching
                    ?(

                        <Input
                        autoFocus
                        className='fadeIn'
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        value={ searchTerm }
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type="text"
                        placeholder="Search..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={ () => setIsSearching(false) } >
                                 <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                        />
                        )
                        : (
                            <IconButton
                                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                                    className='fadeIn'
                                    onClick={ () => setIsSearching(true)}
                                >
                                 <SearchOutlined />
                                </IconButton>
                        )
                }

                {/* Small screens     */}
                <IconButton onClick={toggleSideMenu} sx={{ display: { xs: 'flex', sm: 'none' } }} >
                    <SearchOutlined/>
                </IconButton>

                <NextLink href='/cart' passHref >
                    <Link>
                        <IconButton>
                            <Badge badgeContent={ numberOfItems > 10 ? '+10' : numberOfItems } color='secondary' > 
                                <ShoppingCartOutlined/>
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toggleSideMenu} > Menu </Button>

            </Toolbar>
        </AppBar>
    )
}
