const API_BASE_URL = "http://localhost:8080/api/payments";

export const makePayment = async (orderId, paymentMethod) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderId: Number(orderId),
      paymentMethod,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Payment could not be completed"
    );
  }

  return response.json();
};

export const getPaymentByOrder = async (orderId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Payment information could not be loaded"
    );
  }

  return response.json();
};