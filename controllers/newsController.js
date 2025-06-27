const News = require('../models/News');

// OG Meta Page Controller
const getNewsOGMeta = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).send('News not found');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta property="og:title" content="${news.title}" />
        <meta property="og:description" content="${news.description}" />
        <meta property="og:image" content="${news.imageUrl}" />
        <meta property="og:url" content="https://harshit-backend-18mr.onrender.com/og/news/${news._id}" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>${news.title}</title>
      </head>
      <body>
        <script>
          window.location.href = "https://harshit-ka-kalam-se.netlify.app/news/${news._id}";
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { getNewsOGMeta };