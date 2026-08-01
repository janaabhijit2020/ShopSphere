import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Avatar,
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

import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import {
  getAllProducts,
} from "../services/productService";

const starterMessages = [
  {
    role: "assistant",
    text:
      "Hello! I am the ShopSphere AI Shopping Assistant. Ask me to recommend products, find products by name, check stock, or help with orders.",
  },
];

function AIShoppingAssistant() {
  const [messages, setMessages] =
    useState(starterMessages);

  const [input, setInput] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const messagesEndRef =
    useRef(null);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          setLoadingProducts(true);

          const response =
            await getAllProducts();

          setProducts(
            Array.isArray(
              response.data
            )
              ? response.data
              : []
          );
        } catch (error) {
          console.error(
            "Unable to load products:",
            error
          );

          setError(
            "The assistant could not load products."
          );
        } finally {
          setLoadingProducts(false);
        }
      };

    loadProducts();
  }, []);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  // ==========================================
  // FIND MATCHING PRODUCTS
  // ==========================================

  const findMatchingProducts =
    (message) => {
      const text =
        message.toLowerCase();

      const words =
        text
          .replace(
            /[^a-z0-9\s]/g,
            " "
          )
          .split(/\s+/)
          .filter(
            (word) =>
              word.length >= 3
          );

      return products.filter(
        (product) => {
          const productText =
            `${product.name} ${product.description} ${product.categoryName}`
              .toLowerCase();

          return words.some(
            (word) =>
              productText.includes(
                word
              )
          );
        }
      );
    };

  // ==========================================
  // CREATE ASSISTANT RESPONSE
  // ==========================================

  const createAssistantReply =
    (userMessage) => {
      const text =
        userMessage
          .toLowerCase()
          .trim();

      // GREETING

      if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
      ) {
        return (
          "Hello! 👋 I can help you discover products, check availability, recommend products, and answer questions about ShopSphere orders."
        );
      }

      // ORDER TRACKING

      if (
        text.includes("track") &&
        text.includes("order")
      ) {
        return (
          "You can track your order from the My Orders page. The order status may be PLACED, PROCESSING, SHIPPED, DELIVERED, or CANCELLED."
        );
      }

      // CANCEL ORDER

      if (
        text.includes("cancel") &&
        text.includes("order")
      ) {
        return (
          "Open the My Orders page and select the order you want to cancel. If cancellation is available, you can cancel it there."
        );
      }

      // PAYMENT HELP

      if (
        text.includes("payment")
      ) {
        return (
          "You can complete payment during checkout. After payment is completed, your order will appear in My Orders."
        );
      }

      // STOCK CHECK

      if (
        text.includes("stock") ||
        text.includes("available")
      ) {
        const inStockProducts =
          products.filter(
            (product) =>
              product.stock > 0
          );

        if (
          inStockProducts.length === 0
        ) {
          return (
            "Currently, no products are available in stock."
          );
        }

        const productList =
          inStockProducts
            .slice(0, 5)
            .map(
              (product) =>
                `${product.name} (${product.stock} available)`
            )
            .join(", ");

        return (
          `We currently have ${inStockProducts.length} products in stock. Some available products are: ${productList}.`
        );
      }

      // PRODUCT RECOMMENDATION

      if (
        text.includes("recommend") ||
        text.includes("suggest") ||
        text.includes("best")
      ) {
        const recommendedProducts =
          products
            .filter(
              (product) =>
                product.stock > 0
            )
            .sort(
              (
                firstProduct,
                secondProduct
              ) =>
                Number(
                  firstProduct.price
                ) -
                Number(
                  secondProduct.price
                )
            )
            .slice(0, 5);

        if (
          recommendedProducts.length === 0
        ) {
          return (
            "I could not find an in-stock product to recommend right now."
          );
        }

        const productList =
          recommendedProducts
            .map(
              (product) =>
                `${product.name} — ₹${Number(
                  product.price
                ).toLocaleString(
                  "en-IN"
                )}`
            )
            .join(", ");

        return (
          `Based on the products currently available, you may consider: ${productList}. You can open the Products page to view their details.`
        );
      }

      // PRODUCT SEARCH

      const matches =
        findMatchingProducts(
          userMessage
        );

      if (
        matches.length > 0
      ) {
        const productList =
          matches
            .slice(0, 5)
            .map(
              (product) =>
                `${product.name} — ₹${Number(
                  product.price
                ).toLocaleString(
                  "en-IN"
                )} (${
                  product.stock > 0
                    ? "In stock"
                    : "Out of stock"
                })`
            )
            .join(", ");

        return (
          `I found these products: ${productList}.`
        );
      }

      // DEFAULT RESPONSE

      return (
        "I can help you find products, recommend available items, check stock, and answer questions about orders. Try asking: “Recommend a product”, “What is in stock?”, or “How do I track my order?”"
      );
    };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const handleSend =
    async () => {
      const userMessage =
        input.trim();

      if (
        !userMessage ||
        sending
      ) {
        return;
      }

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          {
            role: "user",
            text: userMessage,
          },
        ]
      );

      setInput("");

      setSending(true);

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );

      const assistantReply =
        createAssistantReply(
          userMessage
        );

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          {
            role: "assistant",
            text: assistantReply,
          },
        ]
      );

      setSending(false);
    };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown =
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        handleSend();
      }
    };

  // ==========================================
  // UI
  // ==========================================

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
      <Container
        maxWidth="md"
      >
        {/* HEADER */}

        <Paper
          elevation={2}
          sx={{
            p: {
              xs: 3,
              md: 4,
            },

            mb: 3,

            borderRadius: 4,

            textAlign:
              "center",
          }}
        >
          <SmartToyOutlinedIcon
            color="primary"
            sx={{
              fontSize: 55,
              mb: 1,
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            AI Shopping Assistant
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Ask questions and discover
            products available on
            ShopSphere.
          </Typography>
        </Paper>

        {/* ERROR */}

        {error && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* CHAT */}

        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,

            overflow:
              "hidden",
          }}
        >
          <Box
            sx={{
              height: {
                xs: "55vh",
                md: "60vh",
              },

              overflowY:
                "auto",

              p: 2.5,

              backgroundColor:
                "#ffffff",
            }}
          >
            {loadingProducts ? (
              <Box
                sx={{
                  height: "100%",

                  display: "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  gap: 2,
                }}
              >
                <CircularProgress />

                <Typography
                  color="text.secondary"
                >
                  Loading ShopSphere
                  products...
                </Typography>
              </Box>
            ) : (
              <Stack
                spacing={2.5}
              >
                {messages.map(
                  (
                    message,
                    index
                  ) => (
                    <Box
                      key={index}
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          message.role ===
                          "user"
                            ? "flex-end"
                            : "flex-start",

                        gap: 1,
                      }}
                    >
                      {message.role ===
                        "assistant" && (
                        <Avatar
                          sx={{
                            bgcolor:
                              "primary.main",
                          }}
                        >
                          <SmartToyOutlinedIcon />
                        </Avatar>
                      )}

                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth:
                            "78%",

                          p: 2,

                          borderRadius:
                            3,

                          backgroundColor:
                            message.role ===
                            "user"
                              ? "primary.main"
                              : "#f1f5f9",

                          color:
                            message.role ===
                            "user"
                              ? "primary.contrastText"
                              : "text.primary",
                        }}
                      >
                        <Typography
                          sx={{
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {
                            message.text
                          }
                        </Typography>
                      </Paper>

                      {message.role ===
                        "user" && (
                        <Avatar
                          sx={{
                            bgcolor:
                              "secondary.main",
                          }}
                        >
                          <AccountCircleOutlinedIcon />
                        </Avatar>
                      )}
                    </Box>
                  )
                )}

                {sending && (
                  <Box
                    sx={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          "primary.main",
                      }}
                    >
                      <SmartToyOutlinedIcon />
                    </Avatar>

                    <CircularProgress
                      size={22}
                    />
                  </Box>
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </Stack>
            )}
          </Box>

          <Divider />

          {/* INPUT */}

          <Box
            sx={{
              p: 2,

              display:
                "flex",

              gap: 1.5,

              alignItems:
                "center",
            }}
          >
            <TextField
              fullWidth

              placeholder={
                "Ask about products, stock, recommendations, or orders..."
              }

              value={input}

              onChange={
                (event) =>
                  setInput(
                    event.target.value
                  )
              }

              onKeyDown={
                handleKeyDown
              }

              disabled={
                loadingProducts ||
                sending
              }
            />

            <Button
              variant="contained"

              onClick={
                handleSend
              }

              disabled={
                !input.trim() ||
                loadingProducts ||
                sending
              }

              sx={{
                minWidth: 52,
                height: 56,
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>

        {/* SUGGESTIONS */}

        <Paper
          elevation={1}
          sx={{
            mt: 3,

            p: 2.5,

            borderRadius: 3,
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              mb: 1.5,
            }}
          >
            Try asking:
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}

            spacing={1}

            flexWrap="wrap"
          >
            {[
              "Recommend a product",

              "What products are in stock?",

              "How do I track my order?",

              "How can I cancel an order?",
            ].map(
              (suggestion) => (
                <Button
                  key={suggestion}

                  variant="outlined"

                  size="small"

                  startIcon={
                    <ShoppingBagOutlinedIcon />
                  }

                  onClick={() =>
                    setInput(
                      suggestion
                    )
                  }

                  sx={{
                    textTransform:
                      "none",
                  }}
                >
                  {suggestion}
                </Button>
              )
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default AIShoppingAssistant;