import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
} from "../services/cartService";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [removingId, setRemovingId] =
    useState(null);

  const [clearing, setClearing] =
    useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      setCart(response.data);
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load your cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const cartItems =
    cart?.cartItems ||
    cart?.items ||
    [];

  const updateNavbarCount = () => {
    window.dispatchEvent(
      new Event(
        "shopsphereCountsUpdated"
      )
    );
  };

  const handleQuantityChange = async (
    cartItemId,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingId(cartItemId);
      setError("");

      await updateCartQuantity(
        cartItemId,
        newQuantity
      );

      setCart((currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        const itemKey =
          currentCart.cartItems
            ? "cartItems"
            : "items";

        return {
          ...currentCart,
          [itemKey]:
            currentCart[itemKey].map(
              (item) =>
                item.cartItemId ===
                cartItemId
                  ? {
                      ...item,
                      quantity:
                        newQuantity,
                    }
                  : item
            ),
        };
      });

      updateNavbarCount();
    } catch (error) {
      console.error(
        "Failed to update quantity:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (
    cartItemId
  ) => {
    try {
      setRemovingId(cartItemId);
      setError("");

      await removeCartItem(
        cartItemId
      );

      setCart((currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        const itemKey =
          currentCart.cartItems
            ? "cartItems"
            : "items";

        return {
          ...currentCart,
          [itemKey]:
            currentCart[itemKey].filter(
              (item) =>
                item.cartItemId !==
                cartItemId
            ),
        };
      });

      updateNavbarCount();
    } catch (error) {
      console.error(
        "Failed to remove item:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearing(true);
      setError("");

      await clearCart();

      setCart((currentCart) => {
        if (!currentCart) {
          return currentCart;
        }

        const itemKey =
          currentCart.cartItems
            ? "cartItems"
            : "items";

        return {
          ...currentCart,
          [itemKey]: [],
        };
      });

      updateNavbarCount();
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to clear cart."
      );
    } finally {
      setClearing(false);
    }
  };

  const getItemTotal = (item) => {
    return (
      Number(item.price) *
      Number(item.quantity)
    );
  };

  const totalAmount =
    cartItems.reduce(
      (total, item) =>
        total + getItemTotal(item),
      0
    );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            My Cart
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Review your products before
            checkout.
          </Typography>
        </Box>

        {cartItems.length > 0 && (
          <Button
            color="error"
            variant="outlined"
            disabled={clearing}
            onClick={
              handleClearCart
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            🗑️{" "}
            {clearing
              ? "Clearing..."
              : "Clear Cart"}
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 70,
                mb: 2,
              }}
            >
              🛒
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Your cart is empty
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              Add products to your cart
              and they will appear here.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              sx={{
                textTransform:
                  "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              Explore Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {cartItems.map((item) => (
            <Card
              key={
                item.cartItemId
              }
              elevation={0}
              sx={{
                border:
                  "1px solid #E5E7EB",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: 3,
                    flexWrap:
                      "wrap",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      minWidth:
                        200,
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      navigate(
                        `/products/${item.productId}`
                      )
                    }
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      {
                        item.productName
                      }
                    </Typography>

                    <Typography
                      color="primary"
                      fontWeight={700}
                      sx={{
                        mt: 1,
                      }}
                    >
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <IconButton
                      disabled={
                        item.quantity <=
                          1 ||
                        updatingId ===
                          item.cartItemId
                      }
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity -
                            1
                        )
                      }
                    >
                      ➖
                    </IconButton>

                    <Typography
                      fontWeight={700}
                      sx={{
                        minWidth:
                          30,
                        textAlign:
                          "center",
                      }}
                    >
                      {
                        item.quantity
                      }
                    </Typography>

                    <IconButton
                      disabled={
                        updatingId ===
                        item.cartItemId
                      }
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity +
                            1
                        )
                      }
                    >
                      ➕
                    </IconButton>

                    <IconButton
                      color="error"
                      disabled={
                        removingId ===
                        item.cartItemId
                      }
                      onClick={() =>
                        handleRemove(
                          item.cartItemId
                        )
                      }
                    >
                      🗑️
                    </IconButton>
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    ₹
                    {getItemTotal(
                      item
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Card
            elevation={0}
            sx={{
              border:
                "1px solid #E5E7EB",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                  >
                    Total
                  </Typography>

                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight={700}
                  >
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                </Box>

                <Divider />

                <Button
                  variant="contained"
                  size="large"
                  onClick={() =>
                    navigate(
                      "/checkout"
                    )
                  }
                  sx={{
                    textTransform:
                      "none",
                    borderRadius: 2,
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
}

export default Cart;