const PRIMARY_API_URL = "https://api.exchangerate-api.com/v4/latest/";
const FALLBACK_API_URL = "https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/";

async function fetchExchangeRate(from, to) {
    try {
        let response = await fetch(`${PRIMARY_API_URL}${from}`);
        if (!response.ok) throw new Error("Primary API failed");

        let data = await response.json();
        if (!data.rates || !data.rates[to]) throw new Error("Invalid API response");
        
        return data.rates[to];
    } catch (error) {
        console.warn("Primary API failed, switching to fallback:", error.message);
        return await fetchFallbackExchangeRate(from, to);
    }
}

async function fetchFallbackExchangeRate(from, to) {
    try {
        let response = await fetch(`${FALLBACK_API_URL}${from}`);
        if (!response.ok) throw new Error("Fallback API also failed");

        let data = await response.json();
        if (!data.conversion_rates || !data.conversion_rates[to]) throw new Error("Invalid fallback API response");

        return data.conversion_rates[to];
    } catch (error) {
        console.error("Both APIs failed:", error.message);
        return null;
    }
}
async function fetchExchangeRate(from, to) {
    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
        throw new Error("Invalid currency format");
    }

    try {
        let response = await fetch(`${PRIMARY_API_URL}${from}`);
        if (!response.ok) throw new Error("Primary API failed");
        let data = await response.json();
        if (!data.rates[to]) throw new Error("Invalid response from API");
        return data.rates[to];
    } catch (error) {
        console.error("API Error:", error.message);
        return null;
    }
}
