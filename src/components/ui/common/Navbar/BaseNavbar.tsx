import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useAuth0 } from '@auth0/auth0-react';

import LogoutButton from './LogoutButton';
import ProfileButton from './ProfileButton';
import LoginButton from './LoginButton';
import RegistroButton from './RegistroButton';

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const {isAuthenticated}=useAuth0();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement | null | any);
  };
  
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      {isAuthenticated ? (
                <div>
                  <MenuItem><div><LoginOutlinedIcon sx={{mr: 1}} /></div><LogoutButton /></MenuItem>
                  <MenuItem><div><LoginOutlinedIcon sx={{mr: 1}} /></div><ProfileButton /></MenuItem>


                </div>
              ) : (
                <div>
                <MenuItem><div><LoginOutlinedIcon sx={{mr: 1}} /></div><LoginButton /></MenuItem>
                <MenuItem><div><LoginOutlinedIcon sx={{mr: 1}} /></div><RegistroButton /></MenuItem>
                  
                  
                </div>
              )}

    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor: '#ha4444'}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ justifyContent: 'center' }}
          >
            El Buen Sabor Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}