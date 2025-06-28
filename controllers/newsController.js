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
    
    // Ensure image URL is absolute
    const imageUrl = news.image && news.image.startsWith('http') 
      ? news.image 
      : `https://harshit-ka-kalam-se.netlify.app${news.image}`;

    const html = `
      <!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <!-- Basic Meta Tags -->
        <title>${news.heading || news.title} - हर्षित के कलम से</title>
        <meta name="description" content="${shortDescription}" />
        
        <!-- Open Graph Meta Tags for Facebook, WhatsApp, etc. -->
        <meta property="og:title" content="${news.heading || news.title}" />
        <meta property="og:description" content="${shortDescription}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content="${imageUrl}" />
        <meta property="og:image:alt" content="${news.heading || news.title}" />
        <meta property="og:url" content="${newsUrl}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="हर्षित के कलम से" />
        <meta property="og:locale" content="hi_IN" />
        
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
        
        <!-- Redirect to actual news page -->
        <meta http-equiv="refresh" content="0;url=${newsUrl}" />
      </head>
      <body>
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <h1>${news.heading || news.title}</h1>
          <p>${shortDescription}</p>
          <p>Redirecting to <a href="${newsUrl}">${newsUrl}</a></p>
        </div>
        <script>
          window.location.href = "${newsUrl}";
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    console.error('Error in getNewsOGMeta:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { getNewsOGMeta };