import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import {
  getAllAdminOrders,
  updateAdminOrderStatus,
} from "../../services/adminOrderService";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);


  // ==========================================
  // LOAD ALL ORDERS
  // ==========================================

  const loadOrders = async () => {
    try {
      setLoading(true);

      setError("");

      const response =
        await getAllAdminOrders();

      setOrders(
        response.data
      );
    } catch (error) {

      console.error(
        "Failed to load admin orders:",
        error
      );

      setError(

        error.response?.data?.message ||

        "Unable to load orders."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadOrders();

  }, []);


  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange =
    async (
      orderId,
      newStatus
    ) => {

      try {

        setUpdatingOrderId(
          orderId
        );

        setError("");

        setSuccess("");

        await updateAdminOrderStatus(

          orderId,

          newStatus
        );


        setOrders(

          (previousOrders) =>

            previousOrders.map(

              (order) =>

                order.orderId === orderId

                  ? {
                      ...order,

                      status:
                        newStatus,
                    }

                  : order
            )
        );


        setSuccess(

          `Order #${orderId} status updated to ${newStatus}.`
        );

      } catch (error) {

        console.error(

          "Failed to update order status:",

          error
        );


        setError(

          error.response?.data?.message ||

          "Unable to update order status."
        );

      } finally {

        setUpdatingOrderId(
          null
        );

      }
    };


  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor =
    (status) => {

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


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <Box
        sx={{

          minHeight: "70vh",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

        }}
      >

        <CircularProgress />

      </Box>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <Box
      sx={{

        minHeight: "100vh",

        py: 5,

        backgroundColor:
          "#f5f7fb",

      }}
    >

      <Container
        maxWidth="xl"
      >

        {/* PAGE HEADER */}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{

            mb: 1,

          }}
        >

          Order Management

        </Typography>


        <Typography
          color="text.secondary"
          sx={{

            mb: 4,

          }}
        >

          View customer orders and update
          their delivery status.

        </Typography>


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


        {/* SUCCESS */}

        {success && (

          <Alert
            severity="success"
            sx={{

              mb: 3,

            }}

            onClose={() =>
              setSuccess("")
            }
          >

            {success}

          </Alert>

        )}


        {/* EMPTY ORDERS */}

        {orders.length === 0 && (

          <Paper
            elevation={2}

            sx={{

              p: 5,

              borderRadius: 3,

              textAlign:
                "center",

            }}
          >

            <Typography
              variant="h6"
              fontWeight="bold"
            >

              No orders found

            </Typography>


            <Typography
              color="text.secondary"
              sx={{

                mt: 1,

              }}
            >

              Customer orders will appear
              here.

            </Typography>

          </Paper>

        )}


        {/* ORDER LIST */}

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

                  borderRadius: 3,

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
                    >

                      Customer:{" "}

                      {
                        order.customerName
                      }

                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >

                      {

                        order.orderDate

                          ? new Date(

                              order.orderDate

                            ).toLocaleString(

                              "en-IN"

                            )

                          : "Date unavailable"

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

                    my: 2.5,

                  }}
                />


                {/* ORDER ITEMS */}

                <Typography
                  fontWeight="bold"
                  sx={{

                    mb: 1.5,

                  }}
                >

                  Ordered Products

                </Typography>


                <Stack
                  spacing={1}
                >

                  {

                    order.items?.map(

                      (item) => (

                        <Box

                          key={

                            `${order.orderId}-${item.productId}`

                          }

                          sx={{

                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            gap: 2,

                            flexWrap:
                              "wrap",

                            p: 1.5,

                            borderRadius: 2,

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

                              {" × ₹"}

                              {

                                Number(

                                  item.price

                                ).toLocaleString(

                                  "en-IN"

                                )

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


                {/* ADDRESS */}

                <Typography
                  fontWeight="bold"
                >

                  Delivery Address

                </Typography>


                <Typography
                  color="text.secondary"
                  sx={{

                    mt: 0.5,

                  }}
                >

                  {
                    order.deliveryAddress
                  }

                </Typography>


                {/* TOTAL + STATUS */}

                <Box

                  sx={{

                    mt: 3,

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


                  <Box

                    sx={{

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 1.5,

                    }}
                  >

                    <Typography
                      fontWeight="medium"
                    >

                      Update Status:

                    </Typography>


                    <Select

                      size="small"

                      value={
                        order.status
                      }

                      disabled={

                        updatingOrderId
                          ===
                        order.orderId

                        ||

                        order.status
                          ===
                        "CANCELLED"

                        ||

                        order.status
                          ===
                        "DELIVERED"

                      }

                      onChange={

                        (event) =>

                          handleStatusChange(

                            order.orderId,

                            event.target.value

                          )

                      }

                      sx={{

                        minWidth:
                          160,

                      }}
                    >

                      <MenuItem
                        value="PLACED"
                      >

                        PLACED

                      </MenuItem>


                      <MenuItem
                        value="PROCESSING"
                      >

                        PROCESSING

                      </MenuItem>


                      <MenuItem
                        value="SHIPPED"
                      >

                        SHIPPED

                      </MenuItem>


                      <MenuItem
                        value="DELIVERED"
                      >

                        DELIVERED

                      </MenuItem>


                      <MenuItem
                        value="CANCELLED"
                      >

                        CANCELLED

                      </MenuItem>

                    </Select>


                    {

                      updatingOrderId
                        ===
                      order.orderId

                      &&

                      <CircularProgress
                        size={22}
                      />

                    }

                  </Box>

                </Box>

              </Paper>

            )

          )}

        </Stack>

      </Container>

    </Box>
  );
}

export default AdminOrders;