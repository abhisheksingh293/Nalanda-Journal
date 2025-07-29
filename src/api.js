const API_KEY = "941aa2761b0c4a6f8a6f45520c823b90";
const BASE_URL = "https://newsapi.org/v2/top-headlines";

/**
 * Fetches top headlines from NewsAPI.org
 * @param {Object} params - Query parameters (country, category, q, etc.)
 * @returns {Promise<{articles: Array, error?: string}>}
 */
export async function fetchTopHeadlines(params = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apiKey", API_KEY);
  url.searchParams.set("country", params.country || "us");
  if (params.category) url.searchParams.set("category", params.category);
  if (params.q) url.searchParams.set("q", params.q);
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    if (data.status !== "ok") throw new Error(data.message || "API error");
    return { articles: data.articles };
  } catch (err) {
    return { articles: [], error: err.message };
  }
}
