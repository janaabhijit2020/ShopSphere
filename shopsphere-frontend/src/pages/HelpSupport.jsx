import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from
  "@mui/icons-material/ExpandMore";

import SearchIcon from
  "@mui/icons-material/Search";

import SupportAgentIcon from
  "@mui/icons-material/SupportAgent";

import EmailOutlinedIcon from
  "@mui/icons-material/EmailOutlined";

const faqData = [
  {
    question:
      "How can I place an order?",
    answer:
      "Open a product, add it to your cart, go to the cart page, select a delivery address, and complete the checkout process.",
  },

  {
    question:
      "How can I track my order?",
    answer:
      "Open My Orders from your account. You can view the current order status, such as PLACED, PROCESSING, SHIPPED, DELIVERED, or CANCELLED.",
  },

  {
    question:
      "Can I cancel an order?",
    answer:
      "You can cancel an order from the My Orders page when cancellation is available. After cancellation, the product stock is restored automatically.",
  },

  {
    question:
      "How do I update my delivery address?",
    answer:
      "Open your Profile page and manage your saved addresses. You can add, update, or remove addresses before placing an order.",
  },

  {
    question:
      "How can I add products to my wishlist?",
    answer:
      "Open a product and use the wishlist option. You can later view all saved products from the Wishlist page.",
  },

  {
    question:
      "What should I do if a product is out of stock?",
    answer:
      "An out-of-stock product cannot be ordered until the store administrator adds more inventory.",
  },

  {
    question:
      "How can I contact ShopSphere support?",
    answer:
      "Use the contact form below. Enter your details and describe your issue clearly.",
  },
];

function HelpSupport() {
  const [searchText, setSearchText] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const [success, setSuccess] =
    useState("");

  const filteredFaqs = useMemo(
    () => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      if (!search) {
        return faqData;
      }

      return faqData.filter(
        (faq) =>
          faq.question
            .toLowerCase()
            .includes(search) ||

          faq.answer
            .toLowerCase()
            .includes(search)
      );
    },
    [searchText]
  );

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setSuccess(
      "Your support request has been submitted successfully. Our team will contact you soon."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        py: {
          xs: 4,
          md: 6,
        },

        backgroundColor:
          "#f5f7fb",
      }}
    >
      <Container maxWidth="lg">

        {/* HEADER */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 3,
              md: 5,
            },

            mb: 4,

            borderRadius: 4,

            textAlign:
              "center",
          }}
        >
          <SupportAgentIcon
            color="primary"
            sx={{
              fontSize: 54,
              mb: 1,
            }}
          />

          <Typography
            variant="h3"
            fontWeight="bold"
          >
            Help & Support
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.5,

              maxWidth: 650,

              mx: "auto",
            }}
          >
            Find answers to common
            questions or send a message
            to the ShopSphere support
            team.
          </Typography>

          <TextField
            fullWidth

            value={
              searchText
            }

            onChange={
              (event) =>
                setSearchText(
                  event.target.value
                )
            }

            placeholder={
              "Search for help..."
            }

            slotProps={{
              input: {
                startAdornment: (
                  <SearchIcon
                    color="action"
                    sx={{
                      mr: 1,
                    }}
                  />
                ),
              },
            }}

            sx={{
              mt: 4,

              maxWidth: 700,
            }}
          />
        </Paper>

        {/* FAQ */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 2,
              md: 4,
            },

            mb: 4,

            borderRadius: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Frequently Asked Questions
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 3,
            }}
          >
            Quick answers to common
            ShopSphere questions.
          </Typography>

          <Stack spacing={1.5}>

            {filteredFaqs.map(
              (faq) => (
                <Accordion
                  key={
                    faq.question
                  }
                  elevation={0}

                  sx={{
                    border:
                      "1px solid",

                    borderColor:
                      "divider",

                    borderRadius:
                      "10px !important",

                    "&:before": {
                      display:
                        "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon />
                    }
                  >
                    <Typography
                      fontWeight="bold"
                    >
                      {
                        faq.question
                      }
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography
                      color="text.secondary"
                    >
                      {
                        faq.answer
                      }
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )
            )}

            {filteredFaqs.length ===
              0 && (

              <Box
                sx={{
                  py: 5,

                  textAlign:
                    "center",
                }}
              >
                <Typography
                  fontWeight="bold"
                >
                  No matching question
                  found
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  Try another search or
                  contact support below.
                </Typography>
              </Box>

            )}

          </Stack>
        </Paper>

        {/* CONTACT FORM */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },

            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap: 1,

              mb: 1,
            }}
          >
            <EmailOutlinedIcon
              color="primary"
            />

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Contact Support
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Describe your issue and our
            support team will review it.
          </Typography>

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

          <Box
            component="form"

            onSubmit={
              handleSubmit
            }
          >

            <Stack spacing={2.5}>

              <TextField
                label="Your Name"

                name="name"

                value={
                  formData.name
                }

                onChange={
                  handleChange
                }

                required

                fullWidth
              />

              <TextField
                label="Email Address"

                name="email"

                type="email"

                value={
                  formData.email
                }

                onChange={
                  handleChange
                }

                required

                fullWidth
              />

              <TextField
                label="Subject"

                name="subject"

                value={
                  formData.subject
                }

                onChange={
                  handleChange
                }

                required

                fullWidth
              />

              <TextField
                label="How can we help?"

                name="message"

                value={
                  formData.message
                }

                onChange={
                  handleChange
                }

                required

                fullWidth

                multiline

                minRows={5}
              />

              <Divider />

              <Button
                type="submit"

                variant="contained"

                size="large"

                sx={{
                  alignSelf:
                    "flex-start",

                  px: 4,

                  py: 1.3,

                  textTransform:
                    "none",

                  borderRadius: 2,
                }}
              >
                Submit Support Request
              </Button>

            </Stack>

          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

export default HelpSupport;