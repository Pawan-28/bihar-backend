const News = require('../models/News');
const Content = require('../models/Content');

// OG Meta Page Controller
const getNewsOGMeta = async (req, res) => {
  try {
    const newsId = req.params.id;

    // First try to find in News model
    let news = await News.findById(newsId);

    // If not found in News, try to find in Content model
    if (!news) {
      const content = await Content.findOne();
      if (content && content.newsPosts) {
        news = content.newsPosts.find(post => post._id.toString() === newsId);
      }
    }

    if (!news) {
      return res.status(404).send('News not found');
    }

    const newsUrl = `https://harshit-ka-kalam-se.netlify.app/news/${newsId}`;
    const shortDescription = news.news ? news.news.slice(0, 160) + '...' : '';

    // Ensure image URL is absolute and properly encoded
    let imageUrl = news.image || '';
    if (!imageUrl.startsWith('http')) {
      imageUrl = `https://harshit-ka-kalam-se.netlify.app${imageUrl}`;
    }
    // Remove any spaces and encode the URL properly
    imageUrl = encodeURI(imageUrl.trim());

    const html = `
      <!DOCTYPE html>
      <html lang="hi" prefix="og: https://ogp.me/ns#">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <!-- Basic Meta Tags -->
        <title>${news.heading || news.title} - हर्षित के कलम से</title>
        <meta name="description" content="${shortDescription}" />
        
        <!-- Open Graph Meta Tags for Facebook, WhatsApp, etc. -->
        <meta property="og:title" content="${news.heading || news.title}" />
        <meta property="og:description" content="${shortDescription}" />
        <meta property="og:url" content="${newsUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="हर्षित के कलम से" />
        <meta property="og:locale" content="hi_IN" />
        
        <!-- Image Meta Tags - Prioritized for Social Media -->
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:url" content="${imageUrl}" />
        <meta property="og:image:secure_url" content="${imageUrl}" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="${news.heading || news.title}" />
        
        <!-- WhatsApp specific meta tags -->
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${news.heading || news.title}" />
        <meta name="twitter:description" content="${shortDescription}" />
        <meta name="twitter:image" content="${imageUrl}" />
        <meta name="twitter:site" content="@harshitkakalam" />
        
        <!-- Additional Meta Tags -->
        <meta name="author" content="हर्षित के कलम से" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="${newsUrl}" />
        
        <!-- Favicon - Added after OG tags -->
        <link rel="icon" type="image/x-icon" href="https://harshit-ka-kalam-se.netlify.app/favicon.ico" />
        <link rel="apple-touch-icon" href="https://harshit-ka-kalam-se.netlify.app/logo192.png" />
        
        <!-- Redirect to actual news page -->
        <meta http-equiv="refresh" content="0;url=${newsUrl}" />

        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${news.heading || news.title}</h1>
          ${imageUrl ? `<img src="${imageUrl}" alt="${news.heading || news.title}" />` : ''}
          <p>${shortDescription}</p>
          <p>Redirecting to <a href="${newsUrl}">${newsUrl}</a></p>
        </div>
        <script>
          window.location.href = "${newsUrl}";
        </script>
      </body>
      </html>
    `;

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    console.error('Error in getNewsOGMeta:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { getNewsOGMeta };