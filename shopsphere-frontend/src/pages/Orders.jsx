import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import {
  cancelOrder,
  getMyOrders,
} from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] =
    useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await getMyOrders();

      setOrders(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (
    orderId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(
        orderId
      );

      setError("");

      await cancelOrder(
        orderId
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to cancel the order."
      );
    } finally {
      setCancellingId(
        null
      );
    }
  };

  const getStatusColor = (
    status
  ) => {
    switch (
      status?.toUpperCase()
    ) {
      case "PLACED":
        return "primary";

      case "CONFIRMED":
        return "info";

      case "SHIPPED":
        return "warning";

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      default:
        return "default";
    }
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight:
            "60vh",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        backgroundColor:
          "#F5F5F5",

        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      <Container
        maxWidth="lg"
      >
        <Box
          sx={{
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.8rem",
                sm: "2.125rem",
              },
            }}
          >
            My Orders
          </Typography>

          <Typography
            color="text.secondary"
          >
            View and manage all
            your ShopSphere orders.
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

        {!error &&
          orders.length === 0 && (
            <Card
              elevation={0}
              sx={{
                textAlign:
                  "center",

                py: {
                  xs: 4,
                  sm: 7,
                },

                borderRadius:
                  3,

                border:
                  "1px solid #E5E7EB",
              }}
            >
              <CardContent>
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize:
                      80,

                    color:
                      "text.secondary",

                    mb: 2,
                  }}
                />

                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                >
                  You have no
                  orders yet
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Your placed
                  orders will
                  appear here.
                </Typography>
              </CardContent>
            </Card>
          )}

        <Stack
          spacing={3}
        >
          {orders.map(
            (order) => (
              <Card
                key={
                  order.orderId
                }
                elevation={0}
                sx={{
                  borderRadius:
                    3,

                  overflow:
                    "hidden",

                  border:
                    "1px solid #E5E7EB",
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 2,
                      sm: 3,
                    },
                  }}
                >
                  <Stack
                    direction={{
                      xs:
                        "column",

                      md:
                        "row",
                    }}
                    spacing={2}
                    sx={{
                      justifyContent:
                        "space-between",

                      alignItems: {
                        xs:
                          "flex-start",

                        md:
                          "center",
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        Order #
                        {
                          order.orderId
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Placed on{" "}
                        {
                          formatDate(
                            order.orderDate
                          )
                        }
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        order.status ||
                        "UNKNOWN"
                      }
                      color={
                        getStatusColor(
                          order.status
                        )
                      }
                      sx={{
                        fontWeight:
                          700,
                      }}
                    />
                  </Stack>

                  <Divider
                    sx={{
                      my: 3,
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                  >
                    Items
                  </Typography>

                  <Stack
                    spacing={2}
                  >
                    {order.items?.map(
                      (item) => (
                        <Box
                          key={
                            item.productId
                          }
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "flex-start",

                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth:
                                0,
                            }}
                          >
                            <Typography
                              fontWeight={500}
                              sx={{
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              {
                                item.productName
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Quantity:{" "}
                              {
                                item.quantity
                              }
                              {" × "}₹
                              {Number(
                                item.price ||
                                0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </Typography>
                          </Box>

                          <Typography
                            fontWeight={700}
                            sx={{
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            ₹
                            {Number(
                              item.totalPrice ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Stack>

                  <Divider
                    sx={{
                      my: 3,
                    }}
                  />

                  <Stack
                    direction={{
                      xs:
                        "column",

                      sm:
                        "row",
                    }}
                    spacing={2}
                    sx={{
                      justifyContent:
                        "space-between",

                      alignItems: {
                        xs:
                          "flex-start",

                        sm:
                          "center",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth:
                          "100%",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Delivery
                        address
                      </Typography>

                      <Typography
                        sx={{
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          order.deliveryAddress ||
                          "Address unavailable"
                        }
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: {
                          xs:
                            "left",

                          sm:
                            "right",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total amount
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        ₹
                        {Number(
                          order.totalAmount ||
                          0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>
                    </Box>
                  </Stack>

                  {order.status
                    ?.toUpperCase() ===
                    "PLACED" && (
                    <Box
                      sx={{
                        mt: 3,
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={
                          <CancelOutlinedIcon />
                        }
                        disabled={
                          cancellingId ===
                          order.orderId
                        }
                        onClick={() =>
                          handleCancelOrder(
                            order.orderId
                          )
                        }
                        sx={{
                          textTransform:
                            "none",
                        }}
                      >
                        {cancellingId ===
                        order.orderId
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default Orders;