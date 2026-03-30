name: Sync shops from OpenStreetMap

on:
  schedule:
    - cron: '0 3 * * 0'  # Every Sunday at 3am UTC
  workflow_dispatch:       # Allow manual trigger from GitHub Actions tab

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Sync shops from Overpass to Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: node scripts/sync-shops.js
