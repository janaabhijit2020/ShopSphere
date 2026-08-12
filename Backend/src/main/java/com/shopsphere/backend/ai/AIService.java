package com.shopsphere.backend.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // ============================================================
    // SHOPPING ASSISTANT
    // ============================================================

    public String chat(
            String userMessage,
            List<AIRecommendationRequest.ProductInfo> products
    ) {

        if (userMessage == null ||
                userMessage.trim().isEmpty()) {

            return "Please enter a question so I can help you.";
        }

        String productContext =
                buildProductContext(products);

        String systemPrompt = """
                You are the ShopSphere AI Shopping Assistant.

                ShopSphere is an e-commerce application.

                Your job is to help customers with:

                - Product discovery
                - Product recommendations
                - Product availability
                - Product prices
                - Basic shopping questions
                - Basic order guidance

                IMPORTANT RULES:

                1. You MUST use the ShopSphere product catalog
                   provided below when answering product questions.

                2. ONLY recommend products that actually appear
                   in the provided catalog.

                3. NEVER invent a product.

                4. NEVER invent a price.

                5. NEVER invent stock quantity.

                6. NEVER claim a product exists if it is not
                   present in the catalog.

                7. If the customer asks for headphones, search
                   the product names, categories and descriptions
                   for headphone-related products.

                8. If the customer asks for mobile phones,
                   search the product names, categories and
                   descriptions for mobile-phone-related products.

                9. If the customer asks for a product under
                   a particular price, only recommend products
                   whose actual price is within that limit.

                10. If the requested product exists, give its
                    actual price and stock information.

                11. If no matching product exists, clearly say
                    that the requested product could not be found
                    in the ShopSphere catalog.

                12. For order questions, explain that orders can
                    be viewed from the My Orders page.

                13. For cancellation questions, explain that
                    cancellation depends on the order status and
                    can be attempted from My Orders.

                14. Do not claim that you have access to private
                    customer information unless it is explicitly
                    provided.

                15. Keep responses concise, friendly and useful.

                SHOPSPHERE PRODUCT CATALOG:

                %s
                """.formatted(productContext);

        try {

            String response = chatClient
                    .prompt()
                    .system(systemPrompt)
                    .user(userMessage)
                    .call()
                    .content();

            if (response == null ||
                    response.trim().isEmpty()) {

                return "I could not generate a response right now. Please try again.";
            }

            return response.trim();

        } catch (Exception exception) {

            exception.printStackTrace();

            return "The AI Shopping Assistant is temporarily unavailable. Please try again later.";
        }
    }

    // ============================================================
    // AI PRODUCT RECOMMENDATIONS
    // ============================================================

    public String recommendProducts(
            String userRequest,
            List<AIRecommendationRequest.ProductInfo> products
    ) {

        if (products == null ||
                products.isEmpty()) {

            return """
                    {
                      "recommendations": [],
                      "message": "No products are currently available."
                    }
                    """;
        }

        String productContext =
                buildProductContext(products);

        String recommendationPrompt = """
                You are the ShopSphere AI Product Recommendation Engine.

                Analyze the customer's request and the available
                ShopSphere products.

                Customer request:
                %s

                Available products:
                %s

                Rules:

                1. Recommend ONLY products from the provided catalog.

                2. Never invent product IDs.

                3. Never recommend products with stock <= 0.

                4. Consider the customer's request, product name,
                   description, category and price.

                5. Return at most 5 products.

                6. Rank recommendations from most relevant
                   to least relevant.

                7. Give a short reason for every recommendation.

                8. If no product is relevant, return an empty array.

                9. Return ONLY valid JSON.

                10. Do not use markdown code fences.

                Required JSON format:

                {
                  "recommendations": [
                    {
                      "productId": 123,
                      "reason": "Short explanation"
                    }
                  ]
                }
                """.formatted(
                userRequest == null
                        ? "Recommend suitable products"
                        : userRequest,
                productContext
        );

        try {

            String response = chatClient
                    .prompt()
                    .user(recommendationPrompt)
                    .call()
                    .content();

            if (response == null ||
                    response.trim().isEmpty()) {

                return """
                        {
                          "recommendations": []
                        }
                        """;
            }

            return cleanJsonResponse(response);

        } catch (Exception exception) {

            System.err.println(
                    "AI recommendation error: "
                            + exception.getMessage()
            );

            return """
                    {
                      "recommendations": [],
                      "message": "AI recommendations are temporarily unavailable."
                    }
                    """;
        }
    }

    // ============================================================
    // BUILD PRODUCT CONTEXT
    // ============================================================

    private String buildProductContext(
            List<AIRecommendationRequest.ProductInfo> products
    ) {

        if (products == null ||
                products.isEmpty()) {

            return "No products available.";
        }

        StringBuilder context =
                new StringBuilder();

        for (AIRecommendationRequest.ProductInfo product
                : products) {

            if (product == null) {
                continue;
            }

            context.append(
                    "Product ID: "
            ).append(
                    product.getId()
            ).append(
                    "\nName: "
            ).append(
                    safe(product.getName())
            ).append(
                    "\nCategory: "
            ).append(
                    safe(product.getCategoryName())
            ).append(
                    "\nDescription: "
            ).append(
                    safe(product.getDescription())
            ).append(
                    "\nPrice: ₹"
            ).append(
                    product.getPrice()
            ).append(
                    "\nStock: "
            ).append(
                    product.getStock()
            ).append(
                    "\n-----------------------------\n"
            );
        }

        return context.toString();
    }

    // ============================================================
    // CLEAN JSON RESPONSE
    // ============================================================

    private String cleanJsonResponse(
            String response
    ) {

        String cleaned =
                response.trim();

        if (cleaned.startsWith("```json")) {

            cleaned =
                    cleaned.substring(7);

        } else if (
                cleaned.startsWith("```")
        ) {

            cleaned =
                    cleaned.substring(3);
        }

        if (cleaned.endsWith("```")) {

            cleaned =
                    cleaned.substring(
                            0,
                            cleaned.length() - 3
                    );
        }

        return cleaned.trim();
    }

    // ============================================================
    // NULL SAFE TEXT
    // ============================================================

    private String safe(String value) {

        if (value == null ||
                value.trim().isEmpty()) {

            return "Not available";
        }

        return value;
    }
}