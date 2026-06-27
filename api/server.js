const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Manifest - this is what Stremio reads first
const manifest = {
  id: 'com.lolirock.addon',
  version: '1.0.0',
  name: 'LoliRock',
  description: 'Watch LoliRock series online',
  logo: 'https://m.media-amazon.com/images/M/MV5BOTc5ZjAxNGEtYmU1Yi00MDVkLWE5MzAtMTA5NTJjZDEyOWJkXkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
  resources: ['catalog', 'stream', 'meta'],
  types: ['series'],
  idPrefixes: ['tt'],
  catalogs: [
    {
      type: 'series',
      id: 'LoliRock',
      name: 'LoliRock'
    }
  ]
};

// Series data
const series = {
  'tt4506998': {
    id: 'tt4506998',
    type: 'series',
    name: 'LoliRock',
    description: 'LoliRock is a French-American animated television series',
    poster: 'https://m.media-amazon.com/images/M/MV5BOTc5ZjAxNGEtYmU1Yi00MDVkLWE5MzAtMTA5NTJjZDEyOWJkXkEyXkFqcGdeQXVyNzg5OTk2OA@@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
    background: 'https://m.media-amazon.com/images/M/MV5BMmI2NjQ3YTctNDczOC00ZTljLThkYS01OWI3ODc3OWJlMDY4XkEyXkFqcGdeQXVyMjk3NTUyOTc@._V1_.jpg',
    releaseInfo: '2014',
    videos: [
      { id: '1:1', season: 1, episode: 1, title: 'Episode 1' },
      { id: '1:2', season: 1, episode: 2, title: 'Episode 2' },
      { id: '1:3', season: 1, episode: 3, title: 'Episode 3' },
      { id: '1:4', season: 1, episode: 4, title: 'Episode 4' },
      { id: '1:5', season: 1, episode: 5, title: 'Episode 5' }
    ]
  }
};

// Manifest endpoint
app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

// Catalog endpoint - returns list of series
app.get('/catalog/series/LoliRock.json', (req, res) => {
  res.json({
    metas: [
      {
        id: 'tt4506998',
        type: 'series',
        name: 'LoliRock',
        poster: series['tt4506998'].poster,
        description: series['tt4506998'].description,
        releaseInfo: series['tt4506998'].releaseInfo
      }
    ]
  });
});

// Meta endpoint - returns detailed info including episodes
app.get('/meta/series/tt4506998.json', (req, res) => {
  const s = series['tt4506998'];
  res.json({
    meta: {
      id: s.id,
      type: s.type,
      name: s.name,
      description: s.description,
      poster: s.poster,
      background: s.background,
      releaseInfo: s.releaseInfo,
      videos: s.videos
    }
  });
});

// Stream endpoint - returns watch links
app.get('/stream/series/tt4506998.json', (req, res) => {
  res.json({
    streams: [
      {
        title: 'LoliRock - YouTube Playlist',
        url: 'https://www.youtube.com/playlist?list=PLO9nJwsXSIOEm2M3unQOzXwTL9B5QeeRs'
      },
      {
        title: 'Episode 1',
        url: 'https://www.youtube.com/watch?v=VIDEO1'
      },
      {
        title: 'Episode 2',
        url: 'https://www.youtube.com/watch?v=VIDEO2'
      },
      {
        title: 'Episode 3',
        url: 'https://www.youtube.com/watch?v=VIDEO3'
      },
      {
        title: 'Episode 4',
        url: 'https://www.youtube.com/watch?v=VIDEO4'
      },
      {
        title: 'Episode 5',
        url: 'https://www.youtube.com/watch?v=VIDEO5'
      }
    ]
  });
});

// Handle individual episode streams
app.get('/stream/series/:id.json', (req, res) => {
  const { id } = req.params;
  
  // For any episode request, return the playlist
  res.json({
    streams: [
      {
        title: 'LoliRock - YouTube Playlist',
        url: 'https://www.youtube.com/playlist?list=PLO9nJwsXSIOEm2M3unQOzXwTL9B5QeeRs'
      }
    ]
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ 
    name: 'LoliRock Addon',
    manifestUrl: 'https://lolirock-addon.vercel.app/manifest.json'
  });
});

module.exports = app;
