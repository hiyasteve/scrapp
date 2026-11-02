// Builds towns.json — every UK city and town centre from OpenStreetMap, used to find the scrapital city.
// Towns rarely change, so run this manually now and then: node scripts/build-towns.js

const fs   = require('fs');
const path = require('path');

const OVERPASS_URLS = [
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

// UK boundary rather than a bounding box, so Ireland and northern France aren't included
const QUERY = `[out:json][timeout:120];
area["ISO3166-1"="GB"][admin_level=2]->.uk;
node["place"~"^(city|town)$"](area.uk);
out body;`;

async function fetchOverpass(retries = 4, delayMs = 15000) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const url = OVERPASS_URLS[(attempt - 1) % OVERPASS_URLS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'scrapp-towns/1.0 (https://github.com/scrapp)',
          'Accept': 'application/json',
        },
        body: 'data=' + encodeURIComponent(QUERY),
      });
      if (res.ok) return res;
      const retryable = res.status === 504 || res.status === 503 || res.status === 429;
      if (!retryable || attempt === retries) throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
      lastErr = new Error(`Overpass error: ${res.status} ${res.statusText}`);
    } catch (err) {
      if (attempt === retries) throw err;
      lastErr = err;
    }
    console.log(`Attempt ${attempt} failed (${lastErr.message}) — retrying in ${delayMs / 1000}s...`);
    await new Promise(r => setTimeout(r, delayMs));
    delayMs *= 2;
  }
  throw lastErr;
}

async function main() {
  console.log('Querying Overpass API for UK cities and towns...');
  const res  = await fetchOverpass();
  const data = await res.json();

  const towns = data.elements
    .filter(el => el.tags?.name && el.lat != null && el.lon != null)
    .map(el => ({
      n:   el.tags.name,
      lat: +el.lat.toFixed(4),
      lon: +el.lon.toFixed(4),
      pop: parseInt(String(el.tags.population || '').replace(/\D/g, ''), 10) || 0,  // often missing; kept for reference
    }))
    .sort((a, b) => a.n.localeCompare(b.n));

  if (towns.length < 1000) throw new Error(`Only ${towns.length} towns returned — refusing to overwrite towns.json`);

  const out = path.join(__dirname, '..', 'towns.json');
  fs.writeFileSync(out, JSON.stringify(towns));
  console.log(`✓ Wrote ${towns.length} towns to towns.json`);
}

main().catch(err => { console.error('Build failed:', err); process.exit(1); });
