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

import axios from "axios";

import { getAllProducts } from "../services/productService";

// ============================================================
// DEPLOYED SHOPSPHERE BACKEND
// ============================================================

const AI_BACKEND_URL =
  "https://shopsphere-xwok.onrender.com/api";

// ============================================================
// STARTER MESSAGE
// ============================================================

const starterMessages = [
  {
    role: "assistant",
    text:
      "Hello! 👋 I am the ShopSphere AI Shopping Assistant. Ask me to recommend products, find products, check stock, or get help with your orders.",
  },
];

// ============================================================
// COMPONENT
// ============================================================

function AIShoppingAssistant() {
  const [messages, setMessages] =
    useState(starterMessages);

  const [input, setInput] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const messagesEndRef =
    useRef(null);

  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setError("");

        const response =
          await getAllProducts();

        const productData =
          Array.isArray(response.data)
            ? response.data
            : [];

        setProducts(productData);
      } catch (error) {
        console.error(
          "Unable to load ShopSphere products:",
          error
        );

        setError(
          "The assistant could not load ShopSphere products."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // ============================================================
  // AUTO SCROLL
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  // ============================================================
  // SEND MESSAGE TO AI BACKEND
  // ============================================================

  const handleSend = async () => {
    const userMessage =
      input.trim();

    if (
      !userMessage ||
      sending
    ) {
      return;
    }

    // Add user message immediately
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
    setError("");

    try {
      const token =
        localStorage.getItem("token");

      // ========================================================
      // POST /api/ai/chat
      //
      // Full URL:
      //
      // https://shopsphere-xwok.onrender.com/api/ai/chat
      // ========================================================

      const response =
        await axios.post(
          `${AI_BACKEND_URL}/ai/chat`,
          {
            message: userMessage,
            products: products,
          },
          {
            headers: {
              "Content-Type":
                "application/json",

              ...(token && {
                Authorization:
                  `Bearer ${token}`,
              }),
            },
          }
        );

      console.log(
        "AI backend response:",
        response.data
      );

      const assistantReply =
        response.data?.response ||
        response.data?.content ||
        response.data?.message ||
        "Sorry, I could not generate a response.";

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          {
            role: "assistant",
            text: assistantReply,
          },
        ]
      );
    } catch (error) {
      console.error(
        "AI Shopping Assistant error:",
        error
      );

      let errorMessage =
        "Sorry, the AI Shopping Assistant could not generate a response.";

      if (
        error.response?.status === 401
      ) {
        errorMessage =
          "Your session has expired. Please login again.";
      } else if (
        error.response?.status === 403
      ) {
        errorMessage =
          "You are not authorized to use the AI Shopping Assistant.";
      } else if (
        error.response?.status === 429
      ) {
        errorMessage =
          "The AI service has reached its usage limit. Please try again later.";
      } else if (
        error.response?.data?.message
      ) {
        errorMessage =
          error.response.data.message;
      } else if (
        error.response?.data?.response
      ) {
        errorMessage =
          error.response.data.response;
      }

      setError(errorMessage);

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          {
            role: "assistant",
            text: errorMessage,
          },
        ]
      );
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  // ============================================================
  // QUICK SUGGESTION
  // ============================================================

  const handleSuggestion =
    (suggestion) => {
      setInput(suggestion);
    };

  // ============================================================
  // UI
  // ============================================================

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
      <Container maxWidth="md">

        {/* ======================================================
            HEADER
        ======================================================= */}

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
            Get intelligent product
            recommendations and
            shopping assistance
            powered by AI.
          </Typography>
        </Paper>

        {/* ======================================================
            ERROR
        ======================================================= */}

        {error && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
            }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {/* ======================================================
            CHAT
        ======================================================= */}

        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: {
                xs: "55vh",
                md: "60vh",
              },

              overflowY: "auto",

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

                {/* ==================================================
                    MESSAGES
                =================================================== */}

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

                      {/* AI AVATAR */}

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

                      {/* MESSAGE */}

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

                            wordBreak:
                              "break-word",
                          }}
                        >
                          {
                            message.text
                          }
                        </Typography>
                      </Paper>

                      {/* USER AVATAR */}

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

                {/* ==================================================
                    AI LOADING
                =================================================== */}

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

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,

                        borderRadius:
                          3,

                        backgroundColor:
                          "#f1f5f9",
                      }}
                    >
                      <CircularProgress
                        size={22}
                      />
                    </Paper>
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

          {/* ======================================================
              INPUT
          ======================================================= */}

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

              multiline

              maxRows={4}

              placeholder={
                "Ask about products, recommendations, stock, or orders..."
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

        {/* ======================================================
            SUGGESTIONS
        ======================================================= */}

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
              "Which headphones do you recommend?",
              "I need a product under ₹2000",
              "How do I track my order?",
              "How can I cancel an order?",
            ].map(
              (suggestion) => (
                <Button
                  key={
                    suggestion
                  }

                  variant="outlined"

                  size="small"

                  startIcon={
                    <ShoppingBagOutlinedIcon />
                  }

                  onClick={() =>
                    handleSuggestion(
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