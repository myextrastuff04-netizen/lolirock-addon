const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// LoliRock metadata database with extended catalog
const LOLIROCK_DATA = {
  series: [
    {
      id: 'tt4506998',
      name: 'LoliRock',
      type: 'series',
      poster: 'https://m.media-amazon.com/images/M/MV5BOTc5ZjAxNGEtYmU1Yi00MDVkLWE5MzAtMTA5NTJjZDEyOWJkXkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
      background: 'https://m.media-amazon.com/images/M/MV5BMmI2NjQ3YTctNDczOC00ZTljLThkYS01OWI3ODc3OWJlMDY4XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_.jpg',
      description: 'LoliRock is a French animated series about a teenage girl who joins a magical girl group to fight evil forces.',
      releaseInfo: '2014-2017',
      imdbId: 'tt4506998',
      runtime: '22 min',
      genres: ['Animation', 'Action', 'Adventure', 'Comedy', 'Fantasy'],
      cast: ['Olivia Moore', 'Amy Stiles', 'Iris Wilson'],
      rating: 7.5
    }
  ],
  movies: []
};

// YouTube playlist episodes
const YOUTUBE_EPISODES = [
  { season: 1, episode: 1, title: 'The Lolis of Rock', videoId: 'dQw4w9WgXcQ' },
  { season: 1, episode: 2, title: 'A Very Special Episode', videoId: 'dQw4w9WgXcQ' },
  { season: 1, episode: 3, title: 'Magical Mystery Cruise', videoId: 'dQw4w9WgXcQ' },
  { season: 1, episode: 4, title: 'A Girl Band', videoId: 'dQw4w9WgXcQ' },
  { season: 1, episode: 5, title: 'Mystic Fate', videoId: 'dQw4w9WgXcQ' },
  { season: 2, episode: 1, title: 'Season 2 Premiere', videoId: 'dQw4w9WgXcQ' },
  { season: 2, episode: 2, title: 'New Challenges', videoId: 'dQw4w9WgXcQ' },
  { season: 3, episode: 1, title: 'Season 3 Premiere', videoId: 'dQw4w9WgXcQ' }
];

/**
 * Manifest Endpoint - Required by Stremio
 */
app.get('/manifest.json', (req, res) => {
  res.json({
    id: 'com.lolirock.nuvio',
    version: '1.0.0',
    name: 'LoliRock',
    description: 'LoliRock series and movie streaming addon',
    logo: 'https://m.media-amazon.com/images/M/MV5BOTc5ZjAxNGEtYmU1Yi00MDVkLWE5MzAtMTA5NTJjZDEyOWJkXkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
    background: 'https://m.media-amazon.com/images/M/MV5BMmI2NjQ3YTctNDczOC00ZTljLThkYS01OWI3ODc3OWJlMDY4XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_.jpg',
    resources: [
      {
        name: 'catalog',
        types: ['series', 'movie'],
        idPrefixes: ['tt', 'lolirock']
      },
      {
        name: 'stream',
        types: ['series', 'movie'],
        idPrefixes: ['tt', 'lolirock']
      },
      {
        name: 'meta',
        types: ['series', 'movie'],
        idPrefixes: ['tt', 'lolirock']
      }
    ],
    types: ['series', 'movie'],
    idPrefixes: ['tt', 'lolirock'],
    catalogs: [
      {
        type: 'series',
        id: 'lolirock_series',
        name: 'LoliRock Series',
        extra: [
          {
            name: 'search',
            isRequired: false
          }
        ]
      },
      {
        type: 'movie',
        id: 'lolirock_movies',
        name: 'LoliRock Movies',
        extra: [
          {
            name: 'search',
            isRequired: false
          }
        ]
      }
    ],
    behaviorHints: {
      configurable: true,
      configurationRequired: false
    },
    contactEmail: 'support@lolirock.addon',
    author: 'LoliRock Community'
  });
});

/**
 * Meta Endpoint - Returns detailed metadata
 */
app.get('/meta/:type/:id.json', (req, res) => {
  const { type, id } = req.params;

  if (id === 'tt4506998' || id === 'lolirock') {
    const series = LOLIROCK_DATA.series[0];
    return res.json({
      meta: {
        id: series.id,
        type: series.type,
        name: series.name,
        poster: series.poster,
        background: series.background,
        description: series.description,
        releaseInfo: series.releaseInfo,
        runtime: series.runtime,
        genres: series.genres,
        cast: series.cast,
        imdbRating: series.rating,
        videos: YOUTUBE_EPISODES.map(ep => ({
          id: `lolirock_s${ep.season}e${ep.episode}`,
          title: ep.title,
          season: ep.season,
          episode: ep.episode,
          released: '2014-01-01T00:00:00Z'
        }))
      }
    });
  }

  res.json({ meta: null });
});

/**
 * Catalog Endpoint
 */
app.get('/catalog/:type/:id/:extra?.json', (req, res) => {
  const { type, id } = req.params;
  const query = req.query;

  // Handle search queries
  if (query.search) {
    const searchQuery = query.search.toLowerCase();
    const results = LOLIROCK_DATA[type] || [];
    const filtered = results.filter(item =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery)
    );
    return res.json({ metas: filtered });
  }

  // Return full catalog
  const catalogData = LOLIROCK_DATA[type] || [];
  
  res.json({
    metas: catalogData.map(item => ({
      id: item.id,
      type: item.type,
      name: item.name,
      poster: item.poster,
      background: item.background,
      description: item.description,
      releaseInfo: item.releaseInfo,
      imdbId: item.imdbId
    }))
  });
});

/**
 * Stream Endpoint
 */
app.get('/stream/:type/:id.json', (req, res) => {
  const { type, id } = req.params;

  // Handle LoliRock series streams
  if (id === 'tt4506998' || id === 'lolirock') {
    const streams = YOUTUBE_EPISODES.map(ep => ({
      title: `${ep.title} (S${ep.season}E${ep.episode})`,
      url: `https://www.youtube.com/embed/${ep.videoId}`,
      externalUrl: `https://www.youtube.com/watch?v=${ep.videoId}`,
      behaviorHints: {
        bingeGroup: `lolirock_s${ep.season}`,
        autoNext: true
      }
    }));

    // Also add the full playlist
    streams.push({
      title: 'LoliRock - Full Series Playlist',
      url: 'https://www.youtube.com/playlist?list=PLO9nJwsXSIOEm2M3unQOzXwTL9B5QeeRs',
      externalUrl: 'https://www.youtube.com/playlist?list=PLO9nJwsXSIOEm2M3unQOzXwTL9B5QeeRs'
    });

    return res.json({ streams });
  }

  // Handle individual episode streams
  if (id.startsWith('lolirock_s')) {
    // Parse season/episode from ID
    const match = id.match(/lolirock_s(\d+)e(\d+)/);
    if (match) {
      const season = parseInt(match[1]);
      const episode = parseInt(match[2]);
      const ep = YOUTUBE_EPISODES.find(e => e.season === season && e.episode === episode);
      
      if (ep) {
        return res.json({
          streams: [{
            title: `${ep.title} (S${ep.season}E${ep.episode})`,
            url: `https://www.youtube.com/embed/${ep.videoId}`,
            externalUrl: `https://www.youtube.com/watch?v=${ep.videoId}`
          }]
        });
      }
    }
  }

  // No streams found
  res.json({ streams: [] });
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', addon: 'LoliRock' });
});

/**
 * Root Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'LoliRock Addon Server',
    version: '1.0.0',
    manifestUrl: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/manifest.json`
      : 'http://localhost:3000/manifest.json'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LoliRock Addon Server running on port ${PORT}`);
});

module.exports = app;
