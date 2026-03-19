[README.md](https://github.com/user-attachments/files/26113014/README.md)
# 🐟 Scrapp

A community map for finding fish and chip shops that serve **scraps** — the crispy batter bits that are a Northern English delicacy.

## What is it?

Scrapp lets you find, confirm, and community-curate fish and chip shops across the UK. If your local chippy serves scraps, mark it. If they don't, mark that too. Help others know before they go.

## Features

- **Live map** — fish and chip shops pulled from OpenStreetMap via the Overpass API, updated as you pan and zoom
- **Scraps status** — mark any shop as "Serves scraps ✓" or "No scraps ✗", with the date you confirmed it
- **Filter by status** — click the legend to show only the shops you care about
- **Add missing shops** — search OpenStreetMap for any business (even if it's not tagged as a chippy) and add it to the map
- **Zoom to your plaice** — search by town, city, or postcode to navigate the map
- **Persistent** — your votes are saved in your browser's local storage

## Marker colours

| Colour | Meaning |
|--------|---------|
| 🟢 Green | Confirmed serves scraps |
| 🔴 Red | Confirmed no scraps |
| ⚫ Grey | Unconfirmed (from OpenStreetMap) |
| 🟠 Orange | Community added |

## Tech

Single HTML file — no frameworks, no build tools, no npm. Just open it in a browser.

- [Leaflet.js](https://leafletjs.com/) for the map
- [OpenStreetMap](https://www.openstreetmap.org/) / [Overpass API](https://overpass-api.de/) for shop data
- [Nominatim](https://nominatim.org/) for place search
- [CARTO](https://carto.com/) for map tiles
- `localStorage` for persisting scraps votes

## Limitations

- Scraps votes are stored locally in your browser — they aren't shared between users (yet)
- Shop coverage depends on OSM tagging — not all chippies are tagged as `cuisine=fish_and_chips`; use the "Add missing shop" feature for those
- The Overpass API is a free volunteer-run service and can occasionally be slow

## Contributing

Found a chippy missing from OSM? You can add it directly on [openstreetmap.org](https://www.openstreetmap.org) — tag it as `amenity=fast_food` and `cuisine=fish_and_chips` and it'll appear on Scrapp automatically.
