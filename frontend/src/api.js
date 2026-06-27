const BASE_URL = import.meta.env.VITE_API_URL;
console.log("BASE_URL =", BASE_URL);
if (!BASE_URL) {
  throw new Error("VITE_API_URL is missing.");
}

async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Server Error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new Error("Request timed out. The server took too long to respond.");
    }

    throw new Error(
      error.message || "Unable to connect to the AutoValue AI server."
    );
  }
}

export async function predictPrice(formData) {
  const payload = {
    company: formData.company,
    year: parseInt(formData.year),
    name: formData.name,
    kms_driven: parseFloat(formData.kms_driven),
    fuel_type: formData.fuel_type,
    condition: formData.condition,
    features: formData.features || [],
    location: formData.location || "",
  };

  return apiRequest("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getModelInfo() {
  return apiRequest("/model-info");
}

export async function getHealth() {
  return apiRequest("/health");
}