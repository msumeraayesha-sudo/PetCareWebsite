
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CurrencyContext = createContext(null);

const countries = [
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$" }
];

export function CurrencyProvider({ children }) {
  const [countryCode, setCountryCode] = useState(() => {
    try {
      return localStorage.getItem("petcare-country") || "IN";
    } catch {
      return "IN";
    }
  });

  const [rates, setRates] = useState({ INR: 1 });
  const [ratesDate, setRatesDate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [rateError, setRateError] = useState(false);

  const country =
    countries.find((item) => item.code === countryCode) || countries[0];

  useEffect(() => {
    try {
      localStorage.setItem("petcare-country", countryCode);
    } catch {
      // Continue even when browser storage is unavailable.
    }
  }, [countryCode]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRates() {
      setLoadingRates(true);
      setRateError(false);

      try {
        const response = await fetch(
          "https://open.er-api.com/v6/latest/INR",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch exchange rates");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates) {
          throw new Error("Exchange-rate service returned an error");
        }

        setRates({ ...data.rates, INR: 1 });
        setRatesDate(data.time_last_update_utc || null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setRateError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRates(false);
        }
      }
    }

    loadRates();

    return () => controller.abort();
  }, []);

  function formatPrice(inrAmount) {
    const amount = Number(inrAmount);

    if (!Number.isFinite(amount)) return "—";

    const rate = rates[country.currency];

    if (!Number.isFinite(rate)) {
      return country.currency === "INR"
        ? `₹${amount.toFixed(2)}`
        : `${country.currency} rate unavailable`;
    }

    return new Intl.NumberFormat(
      country.currency === "INR" ? "en-IN" : "en",
      {
        style: "currency",
        currency: country.currency,
        maximumFractionDigits: 2
      }
    ).format(amount * rate);
  }

  return (
    <CurrencyContext.Provider
      value={{
        countries,
        country,
        countryCode,
        setCountryCode,
        formatPrice,
        loadingRates,
        rateError,
        ratesDate
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}
