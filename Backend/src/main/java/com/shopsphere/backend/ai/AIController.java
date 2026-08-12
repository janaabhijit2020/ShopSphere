package com.shopsphere.backend.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    // ============================================================
    // AI SHOPPING ASSISTANT
    // ============================================================

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody AIChatRequest request
    ) {

        if (request == null ||
                request.getMessage() == null ||
                request.getMessage().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Message cannot be empty."
                            )
                    );
        }

        String response =
                aiService.chat(
                        request.getMessage(),
                        request.getProducts()
                );

        return ResponseEntity.ok(
                Map.of(
                        "response",
                        response
                )
        );
    }

    // ============================================================
    // AI PRODUCT RECOMMENDATIONS
    // ============================================================

    @PostMapping("/recommendations")
    public ResponseEntity<?> recommendations(
            @RequestBody AIRecommendationRequest request
    ) {

        if (request == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "recommendations",
                                    List.of()
                            )
                    );
        }

        String response =
                aiService.recommendProducts(
                        request.getUserRequest(),
                        request.getProducts()
                );

        return ResponseEntity.ok(
                Map.of(
                        "result",
                        response
                )
        );
    }
}