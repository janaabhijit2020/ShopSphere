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
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {
  getAllCustomers,
} from "../../services/adminUserService";

function AdminCustomers() {
  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAllCustomers();

      setCustomers(
        Array.isArray(
          response.data
        )
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load customers:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load customers."
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const fullName =

          `${customer.firstName || ""} ${
            customer.lastName || ""
          }`.toLowerCase();

        const email =

          (
            customer.email || ""
          ).toLowerCase();

        const searchValue =

          search.toLowerCase().trim();

        return (

          fullName.includes(
            searchValue
          )

          ||

          email.includes(
            searchValue
          )
        );
      }
    );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",

          display: "flex",

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
        minHeight: "100vh",

        py: {
          xs: 3,
          md: 5,
        },

        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container maxWidth="lg">

        {/* Page heading */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            gap: 2,

            mb: 4,
          }}
        >

          <Box>

            <Typography
              variant="h4"

              fontWeight="bold"
            >
              Customers
            </Typography>

            <Typography
              color="text.secondary"

              sx={{
                mt: 1,
              }}
            >
              View all registered
              ShopSphere customers.
            </Typography>

          </Box>

          <Button
            variant="outlined"

            startIcon={
              <RefreshOutlinedIcon />
            }

            onClick={
              loadCustomers
            }

            sx={{
              textTransform:
                "none",
            }}
          >
            Refresh
          </Button>

        </Box>

        {/* Error */}

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

        {/* Statistics and search */}

        <Grid
          container

          spacing={3}

          sx={{
            mb: 4,
          }}
        >

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >

            <Card
              elevation={2}

              sx={{
                height:
                  "100%",

                borderRadius:
                  3,
              }}
            >

              <CardContent>

                <Box
                  sx={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 2,
                  }}
                >

                  <Box
                    sx={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      width: 55,

                      height: 55,

                      borderRadius:
                        3,

                      color:
                        "primary.main",

                      backgroundColor:
                        "rgba(25, 118, 210, 0.10)",
                    }}
                  >

                    <PeopleAltOutlinedIcon
                      sx={{
                        fontSize:
                          30,
                      }}
                    />

                  </Box>

                  <Box>

                    <Typography
                      variant="h4"

                      fontWeight="bold"
                    >
                      {
                        customers.length
                      }
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Total Customers
                    </Typography>

                  </Box>

                </Box>

              </CardContent>

            </Card>

          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >

            <Paper
              elevation={2}

              sx={{
                height:
                  "100%",

                p: 2,

                display:
                  "flex",

                alignItems:
                  "center",

                borderRadius:
                  3,
              }}
            >

              <TextField
                fullWidth

                label="Search customers"

                placeholder={
                  "Search by name or email"
                }

                value={
                  search
                }

                onChange={
                  (event) =>
                    setSearch(
                      event.target.value
                    )
                }

                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchOutlinedIcon
                        sx={{
                          mr: 1,

                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

            </Paper>

          </Grid>

        </Grid>

        {/* Customer list */}

        <Paper
          elevation={2}

          sx={{
            borderRadius:
              3,

            overflow:
              "hidden",
          }}
        >

          <Box
            sx={{
              p: 3,

              borderBottom:
                "1px solid",

              borderColor:
                "divider",
            }}
          >

            <Typography
              variant="h6"

              fontWeight="bold"
            >
              Customer List
            </Typography>

            <Typography
              variant="body2"

              color="text.secondary"

              sx={{
                mt: 0.5,
              }}
            >
              Showing {
                filteredCustomers.length
              } of {
                customers.length
              } customers
            </Typography>

          </Box>

          {filteredCustomers.length === 0 ? (

            <Box
              sx={{
                minHeight:
                  250,

                display:
                  "flex",

                flexDirection:
                  "column",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                textAlign:
                  "center",

                px: 2,
              }}
            >

              <PeopleAltOutlinedIcon
                sx={{
                  fontSize:
                    55,

                  color:
                    "text.disabled",

                  mb: 2,
                }}
              />

              <Typography
                variant="h6"

                fontWeight="bold"
              >
                No customers found
              </Typography>

              <Typography
                color="text.secondary"

                sx={{
                  mt: 1,
                }}
              >
                {search

                  ? "Try a different name or email."

                  : "No customer accounts are registered yet."
                }
              </Typography>

            </Box>

          ) : (

            <Box>

              {filteredCustomers.map(
                (customer, index) => (

                  <Box
                    key={
                      customer.id
                    }

                    sx={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems: {
                        xs:
                          "flex-start",

                        sm:
                          "center",
                      },

                      flexDirection: {
                        xs:
                          "column",

                        sm:
                          "row",
                      },

                      gap: 2,

                      p: 3,

                      borderBottom:

                        index ===
                        filteredCustomers.length - 1

                          ? "none"

                          : "1px solid",

                      borderColor:
                        "divider",
                    }}
                  >

                    <Box>

                      <Typography
                        fontWeight="bold"

                        variant="h6"
                      >

                        {
                          customer.firstName
                        }{" "}

                        {
                          customer.lastName
                        }

                      </Typography>

                      <Typography
                        color="text.secondary"

                        sx={{
                          mt: 0.5,
                        }}
                      >

                        {
                          customer.email
                        }

                      </Typography>

                      <Typography
                        variant="body2"

                        color="text.secondary"

                        sx={{
                          mt: 0.5,
                        }}
                      >

                        Customer ID:
                        {" "}

                        {
                          customer.id
                        }

                      </Typography>

                    </Box>

                    <Chip
                      label={
                        customer.role
                      }

                      color="primary"

                      variant="outlined"

                      size="small"
                    />

                  </Box>

                )
              )}

            </Box>

          )}

        </Paper>

      </Container>
    </Box>
  );
}

export default AdminCustomers;