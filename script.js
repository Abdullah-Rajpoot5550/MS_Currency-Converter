document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convertBtn");
    const resultText = document.getElementById("result");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/";

    // Fetch currency codes and populate dropdowns
    async function loadCurrencies() {
        try {
            const response = await fetch(`${API_URL}USD`);
            const data = await response.json();
            const currencies = Object.keys(data.rates);

            currencies.forEach(currency => {
                let option1 = document.createElement("option");
                option1.value = currency;
                option1.textContent = currency;
                fromCurrency.appendChild(option1);

                let option2 = document.createElement("option");
                option2.value = currency;
                option2.textContent = currency;
                toCurrency.appendChild(option2);
            });

            fromCurrency.value = "USD";
            toCurrency.value = "EUR";
        } catch (error) {
            console.error("Error loading currencies:", error);
        }
    }

    // Perform currency conversion
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            resultText.textContent = "Please enter a valid amount.";
            return;
        }

        try {
            const response = await fetch(`${API_URL}${from}`);
            const data = await response.json();
            const rate = data.rates[to];
            const convertedAmount = (amount * rate).toFixed(2);

            resultText.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
        } catch (error) {
            resultText.textContent = "Conversion failed. Please try again.";
            console.error("Error fetching conversion rate:", error);
        }
    }

    convertBtn.addEventListener("click", convertCurrency);
    loadCurrencies();
});
document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convertBtn");
    const resultText = document.getElementById("result");
    const historyList = document.getElementById("historyList");
    const clearHistoryBtn = document.getElementById("clearHistory");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/";

    // Load conversion history from localStorage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
        if (historyList) {
            historyList.innerHTML = history.map(entry => `<li>${entry}</li>`).join("");
        }
    }

    // Save conversion to localStorage
    function saveToHistory(entry) {
        let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
        history.unshift(entry); // Add new entry to the top
        history = history.slice(0, 10); // Keep only the last 10 entries
        localStorage.setItem("conversionHistory", JSON.stringify(history));
        loadHistory();
    }

    // Perform currency conversion
    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            resultText.textContent = "Please enter a valid amount.";
            return;
        }

        try {
            const response = await fetch(`${API_URL}${from}`);
            const data = await response.json();
            const rate = data.rates[to];
            const convertedAmount = (amount * rate).toFixed(2);
            const conversionResult = `${amount} ${from} = ${convertedAmount} ${to}`;

            resultText.textContent = conversionResult;
            saveToHistory(conversionResult);
        } catch (error) {
            resultText.textContent = "Conversion failed. Please try again.";
            console.error("Error fetching conversion rate:", error);
        }
    }

    // Clear history
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            localStorage.removeItem("conversionHistory");
            loadHistory();
        });
    }

    if (convertBtn) {
        convertBtn.addEventListener("click", convertCurrency);
    }

    loadHistory();
});
document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convertBtn");
    const pinBtn = document.getElementById("pinBtn");
    const resultText = document.getElementById("result");
    const favoriteList = document.getElementById("favoriteList");

    const API_URL = "https://api.exchangerate-api.com/v4/latest/";

    // Load pinned currencies from localStorage
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];
        favoriteList.innerHTML = favorites
            .map(pair => `<button class="favorite-item" data-pair="${pair}">${pair} ❌</button>`)
            .join("");

        document.querySelectorAll(".favorite-item").forEach(button => {
            button.addEventListener("click", () => removeFavorite(button.dataset.pair));
        });
    }

    // Save favorite currency pair
    function saveFavorite() {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const pair = `${from} → ${to}`;

        let favorites = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];

        if (!favorites.includes(pair)) {
            favorites.push(pair);
            localStorage.setItem("pinnedCurrencies", JSON.stringify(favorites));
            loadFavorites();
        }
    }

    // Remove a favorite currency pair
    function removeFavorite(pair) {
        let favorites = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];
        favorites = favorites.filter(item => item !== pair);
        localStorage.setItem("pinnedCurrencies", JSON.stringify(favorites));
        loadFavorites();
    }

    // Handle pin button click
    pinBtn.addEventListener("click", saveFavorite);

    // Load favorites on page load
    loadFavorites();
});
document.addEventListener("DOMContentLoaded", () => {
    const amountInput = document.getElementById("amount");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convertBtn");
    const resultText = document.getElementById("result");
    const errorMessage = document.getElementById("error-message");

    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            resultText.textContent = "";
            errorMessage.textContent = "Please enter a valid amount.";
            errorMessage.classList.remove("hidden");
            return;
        }

        try {
            errorMessage.classList.add("hidden");
            const rate = await fetchExchangeRate(from, to);
            if (!rate) throw new Error("Failed to fetch exchange rates");

            const convertedAmount = (amount * rate).toFixed(2);
            resultText.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
        } catch (error) {
            errorMessage.textContent = "Conversion failed. Please try again.";
            errorMessage.classList.remove("hidden");
        }
    }

    convertBtn.addEventListener("click", convertCurrency);
});
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const convertBtn = document.getElementById("convertBtn");
    const loadingIndicator = document.getElementById("loading");

    async function convertCurrency() {
        loadingIndicator.style.display = "block"; // Show loading animation

        setTimeout(async () => {
            try {
                // Perform currency conversion
                await fetchExchangeRate(fromCurrency.value, toCurrency.value);
            } finally {
                loadingIndicator.style.display = "none"; // Hide loading animation
            }
        }, 500);
    }

    convertBtn.addEventListener("click", convertCurrency);
});
let debounceTimer;
function debounce(fn, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, delay);
}

async function convertCurrency() {
    loadingIndicator.style.display = "block";

    debounce(async () => {
        try {
            const rate = await fetchExchangeRate(fromCurrency.value, toCurrency.value);
            if (!rate) throw new Error("Failed to fetch exchange rates");
            resultText.textContent = `${amountInput.value} ${fromCurrency.value} = ${(amountInput.value * rate).toFixed(2)} ${toCurrency.value}`;
        } catch (error) {
            errorMessage.textContent = "Conversion failed. Please try again.";
            errorMessage.classList.remove("hidden");
        } finally {
            loadingIndicator.style.display = "none";
        }
    }, 500);
}

convertBtn.addEventListener("click", convertCurrency);
document.getElementById("newsletter-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-input").value;
    const message = document.getElementById("message");

    if (!validateEmail(email)) {
        message.textContent = "Please enter a valid email address.";
        message.style.color = "red";
        return;
    }

    // Simulating API call (replace with real email service integration)
    setTimeout(() => {
        message.textContent = "Thank you for subscribing!";
        message.style.color = "green";
        document.getElementById("email-input").value = "";
    }, 1000);
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const contactMessage = document.getElementById("contact-message");

    if (!validateEmail(email)) {
        contactMessage.textContent = "Please enter a valid email address.";
        contactMessage.style.color = "red";
        return;
    }

    // Simulate sending email (replace with backend API later)
    setTimeout(() => {
        contactMessage.textContent = "Your message has been sent! We will get back to you soon.";
        contactMessage.style.color = "green";
        document.getElementById("contact-form").reset();
    }, 1000);
});
document.getElementById("mobile-menu").addEventListener("click", function () {
    document.getElementById("nav-links").classList.toggle("show");
});

document.getElementById("mobile-menu").addEventListener("click", function () {
    let navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("show");
});
document.addEventListener("DOMContentLoaded", function () {
    loadPinnedCurrencies();
    populateCurrencyDropdowns();
    document.getElementById("convertBtn").addEventListener("click", convertCurrency);
});

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];
    let fromSelect = document.getElementById("fromCurrency");
    let toSelect = document.getElementById("toCurrency");

    currencies.forEach(currency => {
        let option1 = document.createElement("option");
        let option2 = document.createElement("option");
        option1.value = option2.value = currency;
        option1.textContent = option2.textContent = currency;
        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);
    });
}

// Function to convert currency
function convertCurrency() {
    let from = document.getElementById("fromCurrency").value;
    let to = document.getElementById("toCurrency").value;
    let amount = document.getElementById("amount").value;

    if (amount === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    let conversionRate = getMockExchangeRate(from, to);
    let convertedAmount = (amount * conversionRate).toFixed(2);

    document.getElementById("result").textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
}

// Mock exchange rate function (Replace with real API)
function getMockExchangeRate(from, to) {
    const mockRates = {
        "USD_EUR": 0.92, "EUR_USD": 1.09,
        "USD_GBP": 0.78, "GBP_USD": 1.28,
        "USD_INR": 82.5, "INR_USD": 0.012,
        "USD_JPY": 110.5, "JPY_USD": 0.009,
        "USD_CAD": 1.25, "CAD_USD": 0.80,
        "USD_AUD": 1.35, "AUD_USD": 0.74
    };

    return mockRates[`${from}_${to}`] || 1;
}

// Function to pin a currency
function pinCurrency(selectId) {
    let selectedCurrency = document.getElementById(selectId).value;
    let pinnedCurrencies = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];

    if (!pinnedCurrencies.includes(selectedCurrency)) {
        pinnedCurrencies.push(selectedCurrency);
        localStorage.setItem("pinnedCurrencies", JSON.stringify(pinnedCurrencies));
        updatePinnedList(pinnedCurrencies);
    }
}

// Function to load pinned currencies on page load
function loadPinnedCurrencies() {
    let pinnedCurrencies = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];
    updatePinnedList(pinnedCurrencies);
}

// Function to update the pinned list UI
function updatePinnedList(pinnedCurrencies) {
    let pinnedList = document.getElementById("pinnedList");
    pinnedList.innerHTML = "";

    pinnedCurrencies.forEach(currency => {
        let listItem = document.createElement("li");
        listItem.textContent = currency;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("remove-btn");
        removeBtn.onclick = function () {
            removePinnedCurrency(currency);
        };

        listItem.appendChild(removeBtn);
        pinnedList.appendChild(listItem);
    });
}

// Function to remove a pinned currency
function removePinnedCurrency(currency) {
    let pinnedCurrencies = JSON.parse(localStorage.getItem("pinnedCurrencies")) || [];
    pinnedCurrencies = pinnedCurrencies.filter(item => item !== currency);
    localStorage.setItem("pinnedCurrencies", JSON.stringify(pinnedCurrencies));
    updatePinnedList(pinnedCurrencies);
}
