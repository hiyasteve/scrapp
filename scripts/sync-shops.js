// Syncs all UK fish & chip shops from OpenStreetMap into the Supabase shops table.
// Runs weekly via GitHub Actions, or manually via: node scripts/sync-shops.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Bounding box covering the UK (and a little beyond — harmless)
const QUERY = `[out:json][timeout:120];
(
  node["cuisine"="fish_and_chips"](49.5,-8.0,61.5,2.5);
  way["cuisine"="fish_and_chips"](49.5,-8.0,61.5,2.5);
  relation["cuisine"="fish_and_chips"](49.5,-8.0,61.5,2.5);
);
out center tags;`;

function buildAddress(tags) {
  const parts = [
    tags['addr:housenumber'] && tags['addr:street']
      ? `${tags['addr:housenumber']} ${tags['addr:street']}`
      : tags['addr:street'],
    tags['addr:city'],
    tags['addr:postcode'],
  ].filter(Boolean);
  return parts.join(', ') || 'Address unknown';
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  }

  console.log('Querying Overpass API for UK fish & chip shops...');
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(QUERY),
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  console.log(`Found ${data.elements.length} elements from Overpass`);

  const shops = [];

  for (const el of data.elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const tags    = el.tags || {};
    const address = buildAddress(tags);
    const name    = tags.name || (address !== 'Address unknown' ? `Fish & chip shop, ${address}` : 'Unnamed chip shop');
    shops.push({ id: String(el.id), name, address, lat, lon });
  }

  console.log(`Upserting ${shops.length} shops to Supabase...`);

  const BATCH = 500;
  for (let i = 0; i < shops.length; i += BATCH) {
    const batch    = shops.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const total    = Math.ceil(shops.length / BATCH);
    const upsert   = await fetch(`${SUPABASE_URL}/rest/v1/shops`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(batch),
    });
    if (!upsert.ok) {
      const err = await upsert.text();
      throw new Error(`Supabase upsert failed (batch ${batchNum}): ${upsert.status} ${err}`);
    }
    console.log(`  Batch ${batchNum}/${total} done (${batch.length} shops)`);
  }

  console.log(`✓ Sync complete — ${shops.length} shops upserted`);
}

main().catch(err => { console.error('Sync failed:', err); process.exit(1); });
