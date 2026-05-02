import { setBaseUrl } from "@workspace/api-client-react";

// For production (Vercel) when the backend is on a separate domain.
// Set VITE_API_URL to your backend URL e.g. https://arogyaai-api.railway.app
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl.replace(/\/+$/, ""));
}

// Patch window.fetch to automatically attach the Authorization header
// so all API calls (from generated hooks) include the JWT token.
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = localStorage.getItem("arogya_token");

  if (token) {
    init = init || {};
    const headers = new Headers(init.headers);

    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (
      init.body &&
      typeof init.body === "string" &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json");
    }

    init.headers = headers;
  }

  return originalFetch(input, init);
};

export {};
