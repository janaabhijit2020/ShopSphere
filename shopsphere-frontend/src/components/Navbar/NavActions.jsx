import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

import FavoriteBorderOutlinedIcon from
  "@mui/icons-material/FavoriteBorderOutlined";

import ShoppingCartOutlinedIcon from
  "@mui/icons-material/ShoppingCartOutlined";

import AccountCircleOutlinedIcon from
  "@mui/icons-material/AccountCircleOutlined";

import PersonOutlineOutlinedIcon from
  "@mui/icons-material/PersonOutlineOutlined";

import Inventory2OutlinedIcon from
  "@mui/icons-material/Inventory2Outlined";

import LocalShippingOutlinedIcon from
  "@mui/icons-material/LocalShippingOutlined";

import SmartToyOutlinedIcon from
  "@mui/icons-material/SmartToyOutlined";

import LogoutOutlinedIcon from
  "@mui/icons-material/LogoutOutlined";

import LoginOutlinedIcon from
  "@mui/icons-material/LoginOutlined";

import AppRegistrationOutlinedIcon from
  "@mui/icons-material/AppRegistrationOutlined";

import { useNavigate } from
  "react-router-dom";

function NavActions() {
  const navigate = useNavigate();

  const [accountAnchorEl, setAccountAnchorEl] =
    useState(null);

  const accountMenuOpen =
    Boolean(accountAnchorEl);

  const token =
    localStorage.getItem("token");

  const handleAccountMenuOpen =
    (event) => {
      setAccountAnchorEl(
        event.currentTarget
      );
    };

  const handleAccountMenuClose =
    () => {
      setAccountAnchorEl(null);
    };

  const handleNavigate =
    (path) => {
      handleAccountMenuClose();

      navigate(path);
    };

  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      handleAccountMenuClose();

      navigate("/login");
    };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: {
          xs: 0.5,
          md: 1,
        },
      }}
    >
      {/* WISHLIST */}

      <Tooltip title="Wishlist">
        <IconButton
          onClick={() =>
            navigate("/wishlist")
          }
          color="inherit"
        >
          <FavoriteBorderOutlinedIcon />
        </IconButton>
      </Tooltip>

      {/* CART */}

      <Tooltip title="Cart">
        <IconButton
          onClick={() =>
            navigate("/cart")
          }
          color="inherit"
        >
          <Badge
            badgeContent={0}
            color="error"
          >
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* ACCOUNT */}

      <Tooltip title="My Account">
        <IconButton
          onClick={
            handleAccountMenuOpen
          }
          color="inherit"
        >
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={
          accountAnchorEl
        }
        open={
          accountMenuOpen
        }
        onClose={
          handleAccountMenuClose
        }
        slotProps={{
          paper: {
            sx: {
              minWidth: 230,
              mt: 1,
              borderRadius: 2,
            },
          },
        }}
      >
        {token ? (
          <>
            {/* MY PROFILE */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/profile"
                )
              }
            >
              <PersonOutlineOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              My Profile
            </MenuItem>

            {/* MY ORDERS */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/orders"
                )
              }
            >
              <Inventory2OutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              My Orders
            </MenuItem>

            {/* TRACK ORDER */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/order-tracking"
                )
              }
            >
              <LocalShippingOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              Track Your Order
            </MenuItem>

            {/* AI ASSISTANT */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/ai-assistant"
                )
              }
            >
              <SmartToyOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              AI Shopping Assistant
            </MenuItem>

            {/* LOGOUT */}

            <MenuItem
              onClick={
                handleLogout
              }
              sx={{
                color:
                  "error.main",
              }}
            >
              <LogoutOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              Logout
            </MenuItem>
          </>
        ) : (
          <>
            {/* LOGIN */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/login"
                )
              }
            >
              <LoginOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              Login
            </MenuItem>

            {/* REGISTER */}

            <MenuItem
              onClick={() =>
                handleNavigate(
                  "/register"
                )
              }
            >
              <AppRegistrationOutlinedIcon
                fontSize="small"
                sx={{
                  mr: 1.5,
                }}
              />

              Register
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}

export default NavActions;