import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { getCart } from "../services/cartService";

import {
  addAddress,
  getAddresses,
} from "../services/addressService";

import {
  placeOrder,
} from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);

  const [addresses, setAddresses] =
    useState([]);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    savingAddress,
    setSavingAddress,
  ] = useState(false);

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    addressData,
    setAddressData,
  ] = useState({
    fullName: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        cartResponse,
        addressResponse,
      ] = await Promise.all([
        getCart(),
        getAddresses(),
      ]);

      setCart(cartResponse.data);

      const loadedAddresses =
        addressResponse.data;

      setAddresses(
        loadedAddresses
      );

      const defaultAddress =
        loadedAddresses.find(
          (address) =>
            address.isDefault === true
        );

      if (defaultAddress) {
        setSelectedAddressId(
          defaultAddress.id
        );
      } else if (
        loadedAddresses.length > 0
      ) {
        setSelectedAddressId(
          loadedAddresses[0].id
        );
      }
    } catch (err) {
      console.error(
        "Failed to load checkout:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load checkout details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setAddressData(
      (previousData) => ({
        ...previousData,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };

  const handleAddAddress = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSavingAddress(true);
      setError("");
      setSuccess("");

      const response =
        await addAddress(
          addressData
        );

      const newAddress =
        response.data;

      setAddresses(
        (previousAddresses) => [
          ...previousAddresses,
          newAddress,
        ]
      );

      setSelectedAddressId(
        newAddress.id
      );

      setSuccess(
        "Address added successfully."
      );

      setShowAddressForm(
        false
      );

      setAddressData({
        fullName: "",
        mobileNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      console.error(
        "Failed to add address:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to add address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder =
    async () => {
      if (!selectedAddressId) {
        setError(
          "Please select a delivery address."
        );

        return;
      }

      try {
        setPlacingOrder(true);
        setError("");

        const response =
          await placeOrder(
            selectedAddressId
          );

        const createdOrder =
          response.data;

        navigate(
          `/payment/${createdOrder.orderId}`,
          {
            state: {
              order:
                createdOrder,
            },
          }
        );
      } catch (err) {
        console.error(
          "Failed to place order:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Unable to place the order."
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Preparing checkout...
          </Typography>
        </Stack>
      </Container>
    );
  }

  const cartItems =
    cart?.items || [];

  const grandTotal = Number(
    cart?.grandTotal || 0
  );

  if (
    cartItems.length === 0
  ) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 9,
          textAlign:
            "center",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 6,
            borderRadius: 4,
          }}
        >
          <Typography
            sx={{
              fontSize:
                "70px",
              mb: 2,
            }}
          >
            🛒
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
          >
            Your cart is empty
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Add products before
            proceeding to checkout.
          </Typography>

          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              textTransform:
                "none",
              borderRadius: 2,
              px: 4,
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
        >
          Checkout
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Select a delivery address
          and review your order.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>
      )}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={4}
        alignItems="flex-start"
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: 2,
                flexWrap:
                  "wrap",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
              >
                Delivery Address
              </Typography>

              <Button
                variant="outlined"
                onClick={() =>
                  setShowAddressForm(
                    !showAddressForm
                  )
                }
                sx={{
                  textTransform:
                    "none",
                  borderRadius: 2,
                }}
              >
                {showAddressForm
                  ? "Cancel"
                  : "+ Add New Address"}
              </Button>
            </Box>

            <Divider
              sx={{ my: 2 }}
            />

            {showAddressForm && (
              <Box
                component="form"
                onSubmit={
                  handleAddAddress
                }
                sx={{
                  mb: 3,
                  p: 3,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                  borderRadius: 3,
                  backgroundColor:
                    "background.default",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
                  Add New Address
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={
                      addressData.fullName
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    fullWidth
                  />

                  <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      addressData.mobileNumber
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    fullWidth
                  />

                  <TextField
                    label="Address Line 1"
                    name="addressLine1"
                    value={
                      addressData.addressLine1
                    }
                    onChange={
                      handleAddressChange
                    }
                    required
                    fullWidth
                  />

                  <TextField
                    label="Address Line 2 (Optional)"
                    name="addressLine2"
                    value={
                      addressData.addressLine2
                    }
                    onChange={
                      handleAddressChange
                    }
                    fullWidth
                  />

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                  >
                    <TextField
                      label="City"
                      name="city"
                      value={
                        addressData.city
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                      fullWidth
                    />

                    <TextField
                      label="State"
                      name="state"
                      value={
                        addressData.state
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                      fullWidth
                    />
                  </Stack>

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                  >
                    <TextField
                      label="Postal Code"
                      name="postalCode"
                      value={
                        addressData.postalCode
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                      fullWidth
                    />

                    <TextField
                      label="Country"
                      name="country"
                      value={
                        addressData.country
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                      fullWidth
                    />
                  </Stack>

                  <Box
                    sx={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={
                        addressData.isDefault
                      }
                      onChange={
                        handleAddressChange
                      }
                    />

                    <Typography>
                      Set as default
                      address
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={
                      savingAddress
                    }
                    sx={{
                      py: 1.2,
                      textTransform:
                        "none",
                      borderRadius: 2,
                    }}
                  >
                    {savingAddress
                      ? "Saving..."
                      : "Save Address"}
                  </Button>
                </Stack>
              </Box>
            )}

            {addresses.length ===
            0 ? (
              <Box
                sx={{
                  py: 3,
                  textAlign:
                    "center",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No saved address
                  found.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Add a delivery address
                  to continue.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {addresses.map(
                  (address) => {
                    const selected =
                      selectedAddressId ===
                      address.id;

                    return (
                      <Paper
                        key={
                          address.id
                        }
                        variant="outlined"
                        onClick={() =>
                          setSelectedAddressId(
                            address.id
                          )
                        }
                        sx={{
                          p: 2.5,
                          cursor:
                            "pointer",
                          borderWidth:
                            selected
                              ? 2
                              : 1,
                          borderColor:
                            selected
                              ? "primary.main"
                              : "divider",
                          backgroundColor:
                            selected
                              ? "action.selected"
                              : "background.paper",
                          transition:
                            "0.2s",
                        }}
                      >
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              fontWeight="bold"
                            >
                              {
                                address.fullName
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {
                                address.mobileNumber
                              }
                            </Typography>

                            <Typography
                              sx={{
                                mt: 1,
                              }}
                            >
                              {
                                address.addressLine1
                              }

                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </Typography>

                            <Typography>
                              {
                                address.city
                              }
                              {", "}
                              {
                                address.state
                              }
                              {" - "}
                              {
                                address.postalCode
                              }
                            </Typography>

                            <Typography>
                              {
                                address.country
                              }
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              textAlign:
                                "right",
                            }}
                          >
                            {address.isDefault && (
                              <Typography
                                variant="caption"
                                color="primary"
                                fontWeight="bold"
                              >
                                DEFAULT
                              </Typography>
                            )}

                            {selected && (
                              <Typography
                                color="primary"
                                fontWeight="bold"
                                sx={{
                                  mt: 1,
                                }}
                              >
                                ✓ Selected
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  }
                )}
              </Stack>
            )}
          </Paper>

          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Order Items
            </Typography>

            <Divider
              sx={{ my: 2 }}
            />

            <Stack spacing={2}>
              {cartItems.map(
                (item) => {
                  const itemId =
                    item.cartItemId ||
                    item.id;

                  const name =
                    item.productName ||
                    item.product
                      ?.name ||
                    "Product";

                  const quantity =
                    item.quantity ||
                    1;

                  const total =
                    Number(
                      item.totalPrice ||
                        0
                    );

                  return (
                    <Box
                      key={itemId}
                      sx={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          fontWeight="bold"
                        >
                          {name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Quantity:{" "}
                          {
                            quantity
                          }
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight="bold"
                      >
                        ₹
                        {total.toLocaleString(
                          "en-IN"
                        )}
                      </Typography>
                    </Box>
                  );
                }
              )}
            </Stack>
          </Paper>
        </Box>

        <Paper
          elevation={3}
          sx={{
            width: {
              xs: "100%",
              md: 330,
            },
            p: 3,
            borderRadius: 3,
            position: {
              md: "sticky",
            },
            top: 20,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Order Summary
          </Typography>

          <Divider
            sx={{ my: 2 }}
          />

          <Box
            sx={{
              display:
                "flex",
              justifyContent:
                "space-between",
              mb: 2,
            }}
          >
            <Typography
              color="text.secondary"
            >
              Products
            </Typography>

            <Typography>
              {
                cartItems.length
              }
            </Typography>
          </Box>

          <Box
            sx={{
              display:
                "flex",
              justifyContent:
                "space-between",
              mb: 2,
            }}
          >
            <Typography
              color="text.secondary"
            >
              Delivery
            </Typography>

            <Typography
              color="success.main"
              fontWeight="bold"
            >
              FREE
            </Typography>
          </Box>

          <Divider
            sx={{ my: 2 }}
          />

          <Box
            sx={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Total
            </Typography>

            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
            >
              ₹
              {grandTotal.toLocaleString(
                "en-IN"
              )}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={
              handlePlaceOrder
            }
            disabled={
              !selectedAddressId ||
              placingOrder
            }
            sx={{
              py: 1.4,
              textTransform:
                "none",
              fontSize:
                "16px",
              borderRadius: 2,
            }}
          >
            {placingOrder
              ? "Placing Order..."
              : selectedAddressId
                ? "Place Order"
                : "Select Address to Continue"}
          </Button>

          <Button
            component={Link}
            to="/cart"
            fullWidth
            sx={{
              mt: 1,
              textTransform:
                "none",
            }}
          >
            Back to Cart
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
}

export default Checkout;