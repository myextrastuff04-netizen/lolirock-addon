const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// LoliRock metadata database
const LOLIROCK_DATA = {
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
 * Manifest Endpoint
 */
app.get('/manifest.json', (req, res) => {
  res.json({
    id: 'com.lolirock.nuvio',
    version: '1.0.1',
    name: 'LoliRock',
    description: 'LoliRock series streaming addon',
    logo: 'https://m.media-amazon.com/images/M/MV5BOTc5ZjAxNGEtYmU1Yi00MDVkLWE5MzAtMTA5NTJjZDEyOWJkXkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
    background: 'https://m.media-amazon.com/images/M/MV5BMmI2NjQ3YTctNDczOC00ZTljLThkYS01OWI3ODc3OWJlMDY4XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_.jpg',
    resources: [
      {
        name: 'catalog',
        types: ['series'],
        idPrefixes: ['tt', 'lolirock']
      },
      {
        name: 'stream',
        types: ['series'],
        idPrefixes: ['tt', 'lolirock']
      },
      {
        name: 'meta',
        types: ['series'],
        idPrefixes: ['tt', 'lolirock']
      }
    ],
    types: ['series'],
    idPrefixes: ['tt', 'lolirock'],
    catalogs: [
      {
        type: 'series',
        id: 'lolirock_all',
        name: 'LoliRock Series'
      }
    ]
  });
});

/**
 * Catalog Endpoint - Returns list of available series
 */
app.get('/catalog/series/:id.json', (req, res) => {
  const { id } = req.params;
  
  // Return LoliRock in catalog
  res.json({
    metas: [
      {
        id: 'tt4506998',
        name: 'LoliRock',
        type: 'series',
        poster: LOLIROCK_DATA.poster,
        background: LOLIROCK_DATA.background,
        description: LOLIROCK_DATA.description,
        releaseInfo: LOLIROCK_DATA.releaseInfo
      }
    ]
  });
});

/**
 * Meta Endpoint - Returns detailed metadata with episodes
 */
app.get('/meta/series/:id.json', (req, res) => {
  const { id } = req.params;

  if (id === 'tt4506998' || id === 'lolirock') {
    return res.json({
      meta: {
        id: 'tt4506998',
        type: 'series',
        name: 'LoliRock',
        poster: LOLIROCK_DATA.poster,
        background: LOLIROCK_DATA.background,
        description: LOLIROCK_DATA.description,
        releaseInfo: LOLIROCK_DATA.releaseInfo,
        runtime: LOLIROCK_DATA.runtime,
        genres: LOLIROCK_DATA.genres,
        cast: LOLIROCK_DATA.cast,
        rating: LOLIROCK_DATA.rating,
        videos: YOUTUBE_EPISODES.map(ep => ({
          id: `${ep.season}:${ep.episode}`,
          title: `S${ep.season}E${ep.episode} - ${ep.title}`,
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
 * Stream Endpoint - Returns stream URLs
 */
app.get('/stream/series/:id.json', (req, res) => {
  const { id } = req.params;

  // Handle full series request
  if (id === 'tt4506998') {
    const streams = YOUTUBE_EPISODES.map(ep => ({
      title: `${ep.title}`,
      url: `https://www.youtube.com/watch?v=${ep.videoId}`,
      season: ep.season,
      episode: ep.episode
    }));

    return res.json({ streams });
  }

  // Handle individual episode request (format: season:episode)
  const parts = id.split(':');
  if (parts.length === 2) {
    const season = parseInt(parts[0]);
    const episode = parseInt(parts[1]);
    const ep = YOUTUBE_EPISODES.find(e => e.season === season && e.episode === episode);
    
    if (ep) {
      return res.json({
        streams: [
          {
            title: `${ep.title}`,
            url: `https://www.youtube.com/watch?v=${ep.videoId}`
          }
        ]
      });
    }
  }

  res.json({ streams: [] });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({ message: 'LoliRock Addon', version: '1.0.1' });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
