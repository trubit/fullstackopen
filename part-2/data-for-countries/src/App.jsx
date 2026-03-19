import { useState, useEffect } from "react";
import axios from "axios";

// Weather section: handles fetching and displaying capital weather
const Weather = ({ capital, lat, lon }) => {
  // Stores the weather data we receive
  const [weather, setWeather] = useState(null);
  // Read API key from Vite environment variables
  const apiKey = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    // If we have no coordinates, we cannot fetch weather
    if (!lat || !lon) return;

    // Build the OpenWeather request URL
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Fetch weather data
    axios
      .get(url)
      // Save the response into state
      .then((res) => setWeather(res.data))
      // Log any error to the console
      .catch((err) => console.error("Weather fetch error:", err));
  }, [lat, lon, apiKey]);

  // Show loading text until data arrives
  if (!weather) return <p>Loading weather...</p>;

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
};

// Country details: shows info for a single country
const CountryDetail = ({ country }) => {
  // Capital name (first one if multiple)
  const capital = country.capital?.[0];
  // Capital coordinates for weather API
  const lat = country.capitalInfo?.latlng?.[0];
  const lon = country.capitalInfo?.latlng?.[1];

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {/* Convert the languages object into a list */}
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />

      {/* Weather block for this capital */}
      <Weather capital={capital} lat={lat} lon={lon} />
    </div>
  );
};

// Country list: shows multiple countries with a "show" button
const CountryList = ({ countries, setSelectedCountry }) => {
  return (
    <div>
      {countries.map((country) => (
        <div key={country.cca3}>
          {country.name.common}{" "}
          <button onClick={() => setSelectedCountry(country)}>show</button>
        </div>
      ))}
    </div>
  );
};

// Main App component
const App = () => {
  // All countries from the API
  const [countries, setCountries] = useState([]);
  // Search input value
  const [search, setSearch] = useState("");
  // Selected country when clicking "show"
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Fetch all countries once at start
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Country fetch error:", err));
  }, []);

  // Filter countries by the search text
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  // Decide what to show on the page
  let content = null;

  if (selectedCountry) {
    content = <CountryDetail country={selectedCountry} />;
  } else if (filteredCountries.length > 10) {
    content = <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length > 1) {
    content = (
      <CountryList
        countries={filteredCountries}
        setSelectedCountry={setSelectedCountry}
      />
    );
  } else if (filteredCountries.length === 1) {
    content = <CountryDetail country={filteredCountries[0]} />;
  }

  return (
    <div>
      <h1>Country Finder 🌍</h1>

      <div>
        find countries:{" "}
        <input
          value={search}
          onChange={(e) => {
            // Update search and clear selection when typing
            setSearch(e.target.value);
            setSelectedCountry(null); // reset selection when typing
          }}
        />
      </div>

      {content}
    </div>
  );
};

export default App;
