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
    const apiResponse = await fetch('https://tiktok-scraper-all-in-one.p.rapidapi.com/user/info?unique_id=sewa_hairmpire', {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'tiktok-scraper-all-in-one.p.rapidapi.com'
      }
    });

    if (!apiResponse.ok) {
      throw new Error(`RapidAPI returned status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    
    // Extract followers and heart (likes) counts
    const stats = data?.userInfo?.stats || {};
    const followers = stats.followerCount || 0;
    const likes = stats.heartCount || 0;

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
      return num.toString();
    };

    if (followers === 0 && likes === 0) {
      throw new Error('API returned zero stats or unexpected format');
    }

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
