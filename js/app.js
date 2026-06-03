const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const weatherEmojiEl = document.getElementById('weatherEmoji');
const weatherTempEl = document.getElementById('weatherTemp');
const weatherTextEl = document.getElementById('weatherText');
const weatherLocationEl = document.getElementById('weatherLocation');
const disneyWeatherEmojiEl = document.getElementById('disneyWeatherEmoji');
const disneyWeatherTempEl = document.getElementById('disneyWeatherTemp');
const disneyWeatherTextEl = document.getElementById('disneyWeatherText');
const disneyWeatherLocationEl = document.getElementById('disneyWeatherLocation');
const waitSpaceMountainEl = document.getElementById('waitSpaceMountain');
const waitToyStoryManiaEl = document.getElementById('waitToyStoryMania');
const waitBigThunderEl = document.getElementById('waitBigThunder');
const rideWaitsNoteEl = document.getElementById('rideWaitsNote');
const monorailSoundButtonEl = document.getElementById('monorailSoundButton');
const flipPhoneTimeEl = document.getElementById('flipPhoneTime');

const monorailAudioStartSeconds = 4;
const monorailAudioEndSeconds = 10;
let monorailPlayer = null;
let monorailStopInterval = null;

function ensureMonorailPlayerReady() {
  return new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player && monorailPlayer) {
      resolve(monorailPlayer);
      return;
    }

    const existingScript = document.getElementById('youtubeIframeApi');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtubeIframeApi';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReadyWrapped() {
      if (typeof previousReady === 'function') previousReady();

      monorailPlayer = new window.YT.Player('monorailPlayer', {
        height: '1',
        width: '1',
        videoId: 'bX8oYEol6ro',
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          playsinline: 1,
          start: monorailAudioStartSeconds,
          end: monorailAudioEndSeconds
        },
        events: {
          onReady: () => resolve(monorailPlayer),
          onError: () => reject(new Error('YouTube player error'))
        }
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }
  });
}

async function playMonorailClip() {
  try {
    const player = await ensureMonorailPlayerReady();
    if (!player || typeof player.seekTo !== 'function') return;

    if (monorailStopInterval) {
      clearInterval(monorailStopInterval);
      monorailStopInterval = null;
    }

    player.seekTo(monorailAudioStartSeconds, true);
    player.playVideo();

    monorailStopInterval = window.setInterval(() => {
      const currentTime = player.getCurrentTime && player.getCurrentTime();
      if (typeof currentTime === 'number' && currentTime >= monorailAudioEndSeconds) {
        player.pauseVideo();
        player.seekTo(monorailAudioStartSeconds, true);
        clearInterval(monorailStopInterval);
        monorailStopInterval = null;
      }
    }, 120);
  } catch (error) {
    window.open('https://www.youtube.com/watch?v=bX8oYEol6ro&t=4s', '_blank', 'noopener');
  }
}

if (monorailSoundButtonEl) {
  monorailSoundButtonEl.addEventListener('click', playMonorailClip);
}

function updateFlipPhoneTime() {
  if (!flipPhoneTimeEl) return;
  const now = new Date();
  flipPhoneTimeEl.textContent = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
}

updateFlipPhoneTime();
setInterval(updateFlipPhoneTime, 30000);

function pinkWeatherIcon(iconName) {
  const stroke = '#ff6b9d';
  const fill = 'none';
  const base = `stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="${fill}"`;

  const icons = {
    sunny: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" ${base}></circle><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" ${base}></path></svg>`,
    partlyCloudy: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3" ${base}></circle><path d="M12 18.5h6a2.8 2.8 0 1 0-.6-5.5 4.5 4.5 0 0 0-8.5 1.4A2.4 2.4 0 0 0 9.5 18.5H12Z" ${base}></path></svg>`,
    cloudy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 18h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 13.2 2.8 2.8 0 0 0 7.5 18Z" ${base}></path></svg>`,
    foggy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 13h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 8.2 2.8 2.8 0 0 0 7.5 13Z" ${base}></path><path d="M4 16h16M6 19h12" ${base}></path></svg>`,
    drizzle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 7.7a2.8 2.8 0 0 0 1.5 4.8Z" ${base}></path><path d="M9 16.2l-.8 1.8M13 16.2l-.8 1.8M17 16.2l-.8 1.8" ${base}></path></svg>`,
    rain: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 7.7a2.8 2.8 0 0 0 1.5 4.8Z" ${base}></path><path d="M9 15.8l-1 2.7M13 15.8l-1 2.7M17 15.8l-1 2.7" ${base}></path></svg>`,
    snow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 7.7a2.8 2.8 0 0 0 1.5 4.8Z" ${base}></path><path d="M10 17h4M12 15v4M10.7 15.7l2.6 2.6M13.3 15.7l-2.6 2.6" ${base}></path></svg>`,
    thunderstorm: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5h9a3 3 0 1 0-.8-5.9A5 5 0 0 0 6 7.7a2.8 2.8 0 0 0 1.5 4.8Z" ${base}></path><path d="M12.6 13.7l-1.8 3h1.8l-1.2 3.5 3-4.5h-1.9l1.1-2Z" ${base}></path></svg>`,
    update: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7" ${base}></path><path d="M20 5.8v4h-4" ${base}></path></svg>`
  };

  return icons[iconName] || icons.update;
}

function weatherFromCode(code) {
  if (code === 0) return { icon: 'sunny', label: 'Sunny' };
  if ([1, 2].includes(code)) return { icon: 'partlyCloudy', label: 'Partly cloudy' };
  if (code === 3) return { icon: 'cloudy', label: 'Cloudy' };
  if ([45, 48].includes(code)) return { icon: 'foggy', label: 'Foggy' };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: 'drizzle', label: 'Drizzle' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: 'rain', label: 'Rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: 'snow', label: 'Snow' };
  if ([95, 96, 99].includes(code)) return { icon: 'thunderstorm', label: 'Thunderstorm' };
  return { icon: 'update', label: 'Weather update' };
}

function setWeatherStatus(iconName, tempText, descText, locationText = 'Near you') {
  weatherEmojiEl.innerHTML = pinkWeatherIcon(iconName);
  weatherTempEl.textContent = tempText;
  weatherTextEl.textContent = descText;
  weatherLocationEl.textContent = locationText;
}

function setDisneyWeatherStatus(iconName, tempText, descText, locationText = 'Lake Buena Vista, FL') {
  disneyWeatherEmojiEl.innerHTML = pinkWeatherIcon(iconName);
  disneyWeatherTempEl.textContent = tempText;
  disneyWeatherTextEl.textContent = descText;
  disneyWeatherLocationEl.textContent = locationText;
}

function locationLabelFromTimezone(timezone, latitude, longitude) {
  if (!timezone || timezone === 'auto' || timezone === 'GMT' || timezone === 'UTC') {
    return `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;
  }

  const lastSegment = timezone.split('/').pop() || timezone;
  return lastSegment.replace(/_/g, ' ');
}

const usStateAbbreviations = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  'District of Columbia': 'DC'
};

function normalizeUsState(stateName, countryCode = '') {
  if (!stateName) return '';
  const normalizedCountry = String(countryCode).toUpperCase();
  const trimmed = String(stateName).trim();

  if (/^[A-Z]{2}$/.test(trimmed)) return trimmed;

  if (normalizedCountry === 'US') {
    return usStateAbbreviations[trimmed] || trimmed;
  }

  return trimmed;
}

async function locationLabelFromCoords(latitude, longitude, timezoneFallback) {
  function fallbackLabel() {
    return locationLabelFromTimezone(timezoneFallback, latitude, longitude);
  }

  try {
    const primaryUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const primaryResponse = await fetch(primaryUrl);
    if (primaryResponse.ok) {
      const primaryData = await primaryResponse.json();
      const city = primaryData.city || primaryData.locality || '';
      const countryCode = primaryData.countryCode || '';
      const subdivisionCode = String(primaryData.principalSubdivisionCode || '');
      const stateFromCode = subdivisionCode.includes('-') ? subdivisionCode.split('-').pop() : '';
      const stateFromName = normalizeUsState(primaryData.principalSubdivision || '', countryCode);
      const state = stateFromCode || stateFromName;

      if (city && state) return `${city}, ${state}`;
      if (city) return city;
    }

    const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;
    const reverseResponse = await fetch(reverseUrl);
    if (!reverseResponse.ok) throw new Error('Reverse geocoding failed');

    const reverseData = await reverseResponse.json();
    const place = reverseData.results && reverseData.results[0];
    if (!place) throw new Error('No reverse geocoding result');

    const city = place.name || '';
    const countryCode = place.country_code || '';
    const state = normalizeUsState(place.admin1 || '', countryCode) || place.country || '';

    if (city && state) return `${city}, ${state}`;
    if (city) return city;

    return fallbackLabel();
  } catch (error) {
    return fallbackLabel();
  }
}

async function loadWeather(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const current = data.current;
    if (!current) throw new Error('Missing weather data');

    const condition = weatherFromCode(current.weather_code);
    const temp = Math.round(current.temperature_2m);
    const locationLabel = await locationLabelFromCoords(latitude, longitude, data.timezone);
    setWeatherStatus(condition.icon, `${temp}°F`, condition.label, locationLabel);
  } catch (error) {
    setWeatherStatus('update', 'Weather unavailable', 'Please try again in a moment', 'Location unavailable');
  }
}

async function loadDisneyWeather() {
  try {
    const disneyLat = 28.3772;
    const disneyLon = -81.5707;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${disneyLat}&longitude=${disneyLon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Disney weather request failed');
    const data = await response.json();
    const current = data.current;
    if (!current) throw new Error('Missing Disney weather data');

    const condition = weatherFromCode(current.weather_code);
    const temp = Math.round(current.temperature_2m);
    setDisneyWeatherStatus(condition.icon, `${temp}°F`, condition.label, 'Lake Buena Vista, FL');
  } catch (error) {
    setDisneyWeatherStatus('update', 'Weather unavailable', 'Please try again in a moment', 'Lake Buena Vista, FL');
  }
}

function getBrowserPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function waitTextFromRideLiveData(data) {
  const live = data && data.liveData && data.liveData[0];
  if (!live) return 'Unavailable';

  const standbyWait = live.queue && live.queue.STANDBY && live.queue.STANDBY.waitTime;
  if (typeof standbyWait === 'number') {
    return `${standbyWait} min`;
  }

  if (live.status === 'DOWN') return 'Down';
  if (live.status === 'CLOSED') return 'Closed';
  return 'Unavailable';
}

async function loadDisneyRideWaits() {
  const rideConfigs = [
    { id: 'b2260923-9315-40fd-9c6b-44dd811dbe64', element: waitSpaceMountainEl },
    { id: '20b5daa8-e1ea-436f-830c-2d7d18d929b5', element: waitToyStoryManiaEl },
    { id: 'de3309ca-97d5-4211-bffe-739fed47e92f', element: waitBigThunderEl }
  ];

  rideWaitsNoteEl.textContent = 'Fetching live wait times...';

  try {
    const waitResults = await Promise.all(
      rideConfigs.map(async (ride) => {
        const url = `https://api.themeparks.wiki/v1/entity/${ride.id}/live`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ride wait request failed');
        const data = await response.json();
        return {
          element: ride.element,
          waitText: waitTextFromRideLiveData(data)
        };
      })
    );

    waitResults.forEach((item) => {
      item.element.textContent = item.waitText;
    });

    const updatedTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    rideWaitsNoteEl.textContent = `Updated ${updatedTime}`;
  } catch (error) {
    rideConfigs.forEach((ride) => {
      ride.element.textContent = 'Unavailable';
    });
    rideWaitsNoteEl.textContent = 'Wait times unavailable right now';
  }
}

async function loadApproximateWeatherFromTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const guessedCity = (tz.split('/').pop() || '').replace(/_/g, ' ');
    if (!guessedCity) throw new Error('No timezone city available');

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(guessedCity)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error('Geocoding failed');

    const geoData = await geoResponse.json();
    const place = geoData.results && geoData.results[0];
    if (!place) throw new Error('No geocoding result');

    await loadWeather(place.latitude, place.longitude);
  } catch (error) {
    setWeatherStatus('⚠️', 'Weather unavailable', 'Please try again in a moment', 'Location unavailable');
  }
}

async function requestWeatherFromBrowserLocation() {
  if (!navigator.geolocation) {
    loadApproximateWeatherFromTimezone();
    return;
  }

  if (!window.isSecureContext) {
    loadApproximateWeatherFromTimezone();
    return;
  }

  try {
    const firstTry = await getBrowserPosition({
      enableHighAccuracy: false,
      timeout: 4500,
      maximumAge: 900000
    });
    loadWeather(firstTry.coords.latitude, firstTry.coords.longitude);
    return;
  } catch (error) {
    if (error && error.code === 1) {
      loadApproximateWeatherFromTimezone();
    } else if (error && error.code === 2) {
      loadApproximateWeatherFromTimezone();
    } else {
      loadApproximateWeatherFromTimezone();
    }
  }
}

setWeatherStatus('update', 'Loading weather...', 'Checking your location', 'Near you');
setDisneyWeatherStatus('update', 'Loading weather...', 'Fetching current conditions', 'Lake Buena Vista, FL');

requestWeatherFromBrowserLocation();
loadDisneyWeather();
loadDisneyRideWaits();
