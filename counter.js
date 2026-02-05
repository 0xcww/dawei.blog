const COUNTER_CACHE_KEY = 'visitor_counter_cache';

function getCachedCount() {
  try {
    const cached = localStorage.getItem(COUNTER_CACHE_KEY);
    if (cached) {
      return cached;
    }
  } catch (e) {
    // localStorage not available
  }
  return null;
}

function setCachedCount(count) {
  try {
    localStorage.setItem(COUNTER_CACHE_KEY, count);
  } catch (e) {
    // localStorage not available
  }
}

function displayCount(count) {
  const counterElement = document.getElementById('visitor-counter');
  if (counterElement && count) {
    counterElement.textContent = String(count).padStart(6, '0');
  }
}

async function incrementAndDisplayCounter() {
  const counterElement = document.getElementById('visitor-counter');

  // Display cached count immediately to avoid "000000" flash
  const cachedCount = getCachedCount();
  if (cachedCount) {
    displayCount(cachedCount);
  }

  try {
    const response = await fetch('/api/counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Counter fetch failed');
    }

    const data = await response.json();

    if (data.count) {
      const countValue = String(data.count);
      setCachedCount(countValue);
      displayCount(countValue);
    }
  } catch (error) {
    // Silent fail: if no cached count, hide the counter or show cached value
    // Counter already shows cached value if available, or stays at default
    console.error('Counter error:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', incrementAndDisplayCounter);
} else {
  incrementAndDisplayCounter();
}
