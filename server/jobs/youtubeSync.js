const axios = require('axios');
const cron = require('node-cron');
const Sermon = require('../models/Sermon');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
// We consider anything under 10 minutes (600 seconds) to be a "short" or non-sermon
const MINIMUM_DURATION_SECONDS = parseInt(process.env.YOUTUBE_MIN_DURATION) || 600;

/**
 * Convert ISO 8601 duration (e.g., PT1H2M10S) to seconds
 */
const parseISO8601Duration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Fetch the latest videos from the channel and add them to the database
 */
const syncYouTubeSermons = async () => {
  try {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      console.log('Skipping YouTube Sync: Missing API Key or Channel ID in .env');
      return;
    }

    console.log('Starting YouTube Synchronization...');

    // 1. Fetch channel's "Uploads" playlist ID
    const channelRes = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
      params: {
        part: 'contentDetails',
        id: YOUTUBE_CHANNEL_ID,
        key: YOUTUBE_API_KEY
      }
    });

    if (!channelRes.data.items || channelRes.data.items.length === 0) {
      console.log('YouTube Sync Error: Channel not found.');
      return;
    }

    const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Fetch the latest 15 videos from the uploads playlist
    const playlistItemsRes = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 15,
        key: YOUTUBE_API_KEY
      }
    });

    const videoIds = playlistItemsRes.data.items.map(item => item.snippet.resourceId.videoId);

    if (videoIds.length === 0) {
      console.log('YouTube Sync: No videos found in the channel.');
      return;
    }

    // 3. Fetch detailed video stats to check the duration
    const videosRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: 'snippet,contentDetails',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY
      }
    });

    const videos = videosRes.data.items;
    let addedCount = 0;

    // 4. Filter out shorts/small videos and insert into DB
    for (const video of videos) {
      const durationSeconds = parseISO8601Duration(video.contentDetails.duration);
      
      // Skip if the video is too short (likely a Short or a teaser)
      if (durationSeconds < MINIMUM_DURATION_SECONDS) {
        continue;
      }

      const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
      
      // Check if it already exists in our database
      const existingSermon = await Sermon.findOne({ url: videoUrl });
      
      if (!existingSermon) {
        // Prepare new Sermon object
        const newSermon = new Sermon({
          title: video.snippet.title,
          preacher: process.env.YOUTUBE_DEFAULT_PREACHER || 'كنيسة خربة قنافار',
          date: new Date(video.snippet.publishedAt),
          type: 'video',
          url: videoUrl,
          category: process.env.YOUTUBE_DEFAULT_CATEGORY || 'عظات الأحد',
          description: video.snippet.description.substring(0, 500) // Keep description reasonable
        });

        await newSermon.save();
        addedCount++;
        console.log(`YouTube Sync: Added new sermon - ${newSermon.title}`);
      }
    }

    console.log(`YouTube Synchronization completed. Added ${addedCount} new sermons.`);
  } catch (error) {
    console.error('Error during YouTube Synchronization:', error?.response?.data || error.message);
  }
};

/**
 * Initialize the Cron Job
 * Default: Runs every day at 03:00 AM
 */
const initYouTubeSyncCron = () => {
  console.log('⏳ Initializing YouTube Sync Cron Job (Runs daily at 03:00 AM)...');
  cron.schedule('0 3 * * *', () => {
    syncYouTubeSermons();
  });

  // Also run it immediately once on startup if the user wants it to catch up right away
  if (process.env.NODE_ENV !== 'test') {
    setTimeout(syncYouTubeSermons, 5000); // run 5 seconds after startup
  }
};

module.exports = { syncYouTubeSermons, initYouTubeSyncCron };
