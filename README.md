# Scrapp

A community map of fish and chip shops that serve **scraps** — pieces of deep-fried batter left over in the fryer as a by-product of frying, served as an accompaniment to chips.

Live at: [hiyasteve.github.io/scrapp](https://hiyasteve.github.io/scrapp)

## What is it?

Scraps are a Northern English delicacy, but not every chippy does them. Scrapp lets you find and confirm which ones do. Click any shop on the map to mark whether it serves scraps or not — your vote is shared with everyone who uses the site.

## Features

- **Live shop data** — fish and chip shops pulled from OpenStreetMap via the Overpass API as you pan and zoom
- **Shared votes** — scraps status is stored in a shared database (Supabase), so everyone sees the same confirmed shops
- **Zoom to your plaice** — search by town, city, or postcode
- **Current location** — the map defaults to your location on load, shown as a pulsing blue dot
- **Add missing shops** — search for any business by name and add it to the map
- **Filter by status** — click the legend to show only the shops you care about
- **Mobile friendly** — collapsible sidebar on small screens

## Marker colours

| Colour | Meaning |
|--------|---------|
| Green | Confirmed serves scraps |
| Red | Confirmed no scraps |
| Grey | Unconfirmed |
| Blue dot | Your current location |

## Tech

Single HTML file — no frameworks, no build tools, no npm.

- [Leaflet.js](https://leafletjs.com/) for the map
- [CartoDB Voyager](https://carto.com/) for map tiles
- [OpenStreetMap](https://www.openstreetmap.org/) / [Overpass API](https://overpass-api.de/) for shop data
- [Nominatim](https://nominatim.org/) for place and business search
- [Supabase](https://supabase.com/) for shared votes and community-added shops

## Limitations

- Shop coverage depends on OSM tagging — not all chippies are tagged with `cuisine=fish_and_chips`; use "Add missing shop" for those
- The Overpass API is a free volunteer-run service and can occasionally be slow or unavailable
- Votes are not verified — anyone can mark anything

## Contributing to OSM

Found a chippy missing from the map? Add it directly on [openstreetmap.org](https://www.openstreetmap.org) — tag it as `cuisine=fish_and_chips` and it will appear on Scrapp automatically.

## Data credit

Shop data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, available under the Open Database Licence.
