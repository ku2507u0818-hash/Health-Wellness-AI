// This patches the global fetch to automatically include the Authorization header
// so that the generated API hooks (@workspace/api-client-react) work seamlessly.
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = localStorage.getItem("arogya_token");
  
  if (token) {
    init = init || {};
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    
    // Ensure content-type is set for JSON bodies if not already
    if (init.body && typeof init.body === "string" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    
    init.headers = headers;
  }
  
  return originalFetch(input, init);
};

export {};
