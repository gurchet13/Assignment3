(() => {
  const searchForm = document.getElementById('searchForm');
  const results = document.getElementById('results');
  const errorEl = document.getElementById('error');

  function showError(msg) {
    errorEl.textContent = msg;
    results.classList.add('hidden');
  }

  function clearError() {
    errorEl.textContent = '';
  }

  function unixToTime(unix, tzOffsetSeconds = 0) {
    const date = new Date((unix + tzOffsetSeconds) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async function fetchWeatherByCity(city) {
    clearError();
    try {
      if (typeof WEATHER_API_KEY === 'undefined' || WEATHER_API_KEY === 'PUT_YOUR_API_KEY_HERE') {
        showError('Missing API key. Create js/config.js from js/config.example.js and add your OpenWeather API key.');
        return;
      }

      // 1) Current weather (gives coordinates)
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
      const res1 = await fetch(currentUrl);
      if (!res1.ok) {
        const err = await res1.json().catch(()=>null);
        throw new Error(err && err.message ? err.message : `HTTP ${res1.status}`);
      }
      const currentData = await res1.json();

      // Display current
      document.getElementById('place').textContent = `${currentData.name}, ${currentData.sys.country}`;
      document.getElementById('temp').textContent = currentData.main.temp.toFixed(1);
      document.getElementById('desc').textContent = currentData.weather[0].description;
      document.getElementById('feels').textContent = currentData.main.feels_like.toFixed(1);
      document.getElementById('hum').textContent = currentData.main.humidity;
      const tzOffset = currentData.timezone; // seconds
      document.getElementById('sunrise').textContent = unixToTime(currentData.sys.sunrise, tzOffset);
      document.getElementById('sunset').textContent = unixToTime(currentData.sys.sunset, tzOffset);
      const iconUrl = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
      const iconEl = document.getElementById('icon');
      iconEl.src = iconUrl;
      iconEl.alt = currentData.weather[0].description || 'weather icon';

      // 2) Short forecast (use forecast endpoint with lat/lon)
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&cnt=5&appid=${WEATHER_API_KEY}`;
      const res2 = await fetch(forecastUrl);
      if (!res2.ok) throw new Error(`Forecast request failed: ${res2.status}`);
      const forecastData = await res2.json();

      const listEl = document.getElementById('forecastList');
      listEl.innerHTML = '';
      forecastData.list.forEach(item => {
        const li = document.createElement('li');
        const dt = new Date(item.dt * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        li.innerHTML = `<strong>${dt}</strong> — ${item.main.temp.toFixed(1)} °C — ${item.weather[0].description}`;
        listEl.appendChild(li);
      });

      results.classList.remove('hidden');
    } catch (err) {
      showError('Error: ' + err.message);
      console.error(err);
    }
  }

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();
    if (!city) return;
    fetchWeatherByCity(city);
  });

})();
