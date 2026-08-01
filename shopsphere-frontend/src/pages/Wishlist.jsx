import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
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
  getMyWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import {
  addToCart,
} from "../services/cartService";

function Wishlist() {
  const navigate = useNavigate();

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    removingId,
    setRemovingId,
  ] = useState(null);

  const [
    addingToCartId,
    setAddingToCartId,
  ] = useState(null);

  const updateNavbarCount = () => {
    window.dispatchEvent(
      new Event(
        "shopsphereCountsUpdated"
      )
    );
  };

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMyWishlist();

      setWishlistItems(
        response.data
      );
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (
    productId
  ) => {
    try {
      setRemovingId(productId);
      setError("");

      await removeFromWishlist(
        productId
      );

      setWishlistItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              item.productId !==
              productId
          )
      );

      updateNavbarCount();
    } catch (error) {
      console.error(
        "Failed to remove product:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Failed to remove product."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart =
    async (productId) => {
      try {
        setAddingToCartId(
          productId
        );

        setError("");

        await addToCart(
          productId,
          1
        );

        updateNavbarCount();

        navigate("/cart");
      } catch (error) {
        console.error(
          "Failed to add product to cart:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to add product to cart."
        );
      } finally {
        setAddingToCartId(
          null
        );
      }
    };

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
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          My Wishlist
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          Products you saved for later.
        </Typography>
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

      {wishlistItems.length === 0 ? (
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
              ❤️
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Your wishlist is empty
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 3,
              }}
            >
              Save products you like
              and find them here later.
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/products")
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              Explore Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {wishlistItems.map(
            (item) => (
              <Card
                key={
                  item.wishlistId
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
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: 3,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 200,
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
                        variant="h6"
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
                      <Button
                        variant="contained"
                        disabled={
                          addingToCartId ===
                          item.productId
                        }
                        onClick={() =>
                          handleAddToCart(
                            item.productId
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                          borderRadius: 2,
                        }}
                      >
                        🛒{" "}
                        {addingToCartId ===
                        item.productId
                          ? "Adding..."
                          : "Add to Cart"}
                      </Button>

                      <IconButton
                        color="error"
                        disabled={
                          removingId ===
                          item.productId
                        }
                        onClick={() =>
                          handleRemove(
                            item.productId
                          )
                        }
                      >
                        🗑️
                      </IconButton>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      )}
    </Container>
  );
}

export default Wishlist;