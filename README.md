# LoliRock Addon for Stremio/Nuvio

**Version:** 1.0.0

A Stremio/Nuvio addon for streaming LoliRock series.

## Manifest URL

```
https://lolirock-addon.vercel.app/manifest.json
```

## Features

✅ Series catalog support
✅ Movie catalog support  
✅ Stream endpoints for video playback
✅ IMDb ID compatibility (tt4506998)
✅ Custom ID prefix support (lolirock)
✅ YouTube playlist integration

## Installation

1. Open Stremio or Nuvio
2. Go to **Add-ons** → **Install Add-on**
3. Paste the manifest URL above
4. Click **Install**

## API Endpoints

- `GET /manifest.json` - Addon manifest
- `GET /catalog/:type/:id.json` - Catalog endpoint
- `GET /stream/:type/:id.json` - Stream endpoint
- `GET /health` - Health check

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel at: https://lolirock-addon.vercel.app

## LoliRock Info

- **IMDb ID:** tt4506998
- **Type:** Animated Series
- **Released:** 2014
- **Description:** A French animated series about a teenage girl who joins a magical girl group to fight evil forces.
