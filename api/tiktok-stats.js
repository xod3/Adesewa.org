module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Cache response on Vercel Edge for 2 hours (7200 seconds)
  res.setHeader('Cache-Control', 's-maxage=7200, stale-while-revalidate=1800');

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return res.status(200).json({ 
      error: 'RAPIDAPI_KEY is not configured in Vercel Environment Variables.',
      fallback: true
    });
  }

  try {
    const apiResponse = await fetch('https://tiktok-data-scraper-fast-reliable.p.rapidapi.com/user/info/sewa_hairmpire', {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'tiktok-data-scraper-fast-reliable.p.rapidapi.com'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`RapidAPI returned status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    
    // Extremely robust recursive parser to find follower/like counts regardless of JSON structure
    const findField = (obj, keys) => {
      if (!obj || typeof obj !== 'object') return null;
      for (const key of keys) {
        if (key in obj && (typeof obj[key] === 'number' || typeof obj[key] === 'string')) {
          const parsed = parseInt(obj[key], 10);
          if (!isNaN(parsed)) return parsed;
        }
      }
      for (const k in obj) {
        if (obj[k] && typeof obj[k] === 'object') {
          const val = findField(obj[k], keys);
          if (val !== null) return val;
        }
      }
      return null;
    };

    const followers = findField(data, ['followerCount', 'follower_count', 'followers', 'followersCount', 'followers_count']);
    const likes = findField(data, ['heartCount', 'heart_count', 'likesCount', 'likes_count', 'heart', 'hearts', 'likes', 'diggCount', 'digg_count']);

    if (followers === null || likes === null) {
      throw new Error('API returned data but could not find follower or like counts in the response structure.');
    }

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
      return num.toString();
    };

    return res.status(200).json({
      success: true,
      followers: formatNumber(followers),
      likes: formatNumber(likes),
      raw: { followers, likes }
    });
  } catch (error) {
    console.error('Error fetching TikTok stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch TikTok stats',
      message: error.message,
      fallback: true
    });
  }
};
