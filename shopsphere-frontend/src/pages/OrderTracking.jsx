import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import {
  getMyOrders,
} from "../services/orderService";

const orderSteps = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function OrderTracking() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
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
        "Unable to load order tracking:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getActiveStep = (
    status
  ) => {
    const stepIndex =
      orderSteps.indexOf(
        status
      );

    return stepIndex >= 0
      ? stepIndex
      : 0;
  };

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "PLACED":
        return "info";

      case "PROCESSING":
        return "warning";

      case "SHIPPED":
        return "primary";

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
            "70vh",

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

        py: {
          xs: 3,
          md: 5,
        },

        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container
        maxWidth="lg"
      >
        {/* HEADER */}

        <Box
          sx={{
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Order Tracking
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Track the current
            delivery status of
            your ShopSphere
            orders.
          </Typography>
        </Box>

        {/* ERROR */}

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

        {/* EMPTY STATE */}

        {!error &&
          orders.length === 0 && (
            <Paper
              elevation={2}

              sx={{
                p: {
                  xs: 3,
                  md: 6,
                },

                borderRadius:
                  4,

                textAlign:
                  "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
              >
                No orders to track
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                Place an order and
                its delivery progress
                will appear here.
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
                }}
              >
                Browse Products
              </Button>
            </Paper>
          )}

        {/* ORDER CARDS */}

        <Stack
          spacing={3}
        >
          {orders.map(
            (order) => (
              <Paper
                key={
                  order.orderId
                }

                elevation={2}

                sx={{
                  p: {
                    xs: 2,
                    md: 3,
                  },

                  borderRadius:
                    4,
                }}
              >
                {/* ORDER HEADER */}

                <Box
                  sx={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    flexWrap:
                      "wrap",

                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      Order #
                      {
                        order.orderId
                      }
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                      }}
                    >
                      Ordered on{" "}
                      {
                        formatDate(
                          order.orderDate
                        )
                      }
                    </Typography>
                  </Box>

                  <Chip
                    label={
                      order.status
                    }

                    color={
                      getStatusColor(
                        order.status
                      )
                    }

                    sx={{
                      fontWeight:
                        "bold",
                    }}
                  />
                </Box>

                <Divider
                  sx={{
                    my: 3,
                  }}
                />

                {/* CANCELLED */}

                {order.status ===
                  "CANCELLED" ? (
                  <Alert
                    severity="error"
                  >
                    This order has
                    been cancelled.
                    It will not move
                    through the
                    delivery stages.
                  </Alert>
                ) : (
                  <Stepper
                    activeStep={
                      getActiveStep(
                        order.status
                      )
                    }

                    alternativeLabel

                    sx={{
                      mb: 3,
                    }}
                  >
                    {orderSteps.map(
                      (step) => (
                        <Step
                          key={
                            step
                          }
                        >
                          <StepLabel>
                            {step}
                          </StepLabel>
                        </Step>
                      )
                    )}
                  </Stepper>
                )}

                {/* PRODUCTS */}

                <Typography
                  fontWeight="bold"
                  sx={{
                    mb: 1.5,
                  }}
                >
                  Products
                </Typography>

                <Stack
                  spacing={1}
                >
                  {
                    order.items?.map(
                      (
                        item,
                        index
                      ) => (
                        <Box
                          key={
                            `${order.orderId}-${index}`
                          }

                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "center",

                            flexWrap:
                              "wrap",

                            gap: 2,

                            p: 1.5,

                            borderRadius:
                              2,

                            backgroundColor:
                              "#f8fafc",
                          }}
                        >
                          <Box>
                            <Typography
                              fontWeight="medium"
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
                            </Typography>
                          </Box>

                          <Typography
                            fontWeight="bold"
                          >
                            ₹
                            {
                              Number(
                                item.totalPrice
                              ).toLocaleString(
                                "en-IN"
                              )
                            }
                          </Typography>
                        </Box>
                      )
                    )
                  }
                </Stack>

                <Divider
                  sx={{
                    my: 2.5,
                  }}
                />

                {/* TOTAL */}

                <Box
                  sx={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    flexWrap:
                      "wrap",

                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    Current status:
                    {" "}
                    <strong>
                      {
                        order.status
                      }
                    </strong>
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    Total: ₹
                    {
                      Number(
                        order.totalAmount
                      ).toLocaleString(
                        "en-IN"
                      )
                    }
                  </Typography>
                </Box>
              </Paper>
            )
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default OrderTracking;