const Content = require('../models/Content');


const contentController = {
  // Get public content (no auth required)
  getPublicContent: async (req, res) => {
    try {
      const content = await Content.findOne();
      
      // Get latest news from Content model
      const latestNews = content?.latestNews || [];
      
      const publicContent = {
        heroBanner: content?.heroBanner || {
          title: "Welcome to News Portal",
          subtitle: "Latest Updates from Bihar and Jharkhand",
          button1Text: "Read More",
          button2Text: "Subscribe",
          images: ["https://via.placeholder.com/1200x600"]
        },
        latestNewsTitle: "Latest News",
        latestNewsArticles: latestNews.map(news => ({
          image: news.image || 'https://via.placeholder.com/300x200',
          category: news.category || 'general',
          title: news.title || 'Loading...',
          description: news.description || 'Loading...',
          author: news.author || 'Anonymous',
          date: news.date || new Date().toISOString(),
          location: news.location || 'Bihar',
          time: news.time || new Date(news.date).toLocaleTimeString('hi-IN'),
          views: news.views || 0,
          link: news.link || '#'
        })),
        featuredArticlesTitle: "Featured Articles",
        featuredArticles: content?.featuredArticles?.map(article => ({
          image: article.image || 'https://via.placeholder.com/300x200',
          title: article.title || 'Loading...',
          description: article.description || 'Loading...',
          date: article.date || new Date().toISOString(),
          readTime: article.readTime || '5 min',
          videoId: article.videoId || null,
          videoThumbnail: article.videoId 
            ? `https://img.youtube.com/vi/${article.videoId}/maxresdefault.jpg`
            : 'https://via.placeholder.com/300x200'
        })) || [],
        photoGalleryTitle: content?.photoGallery?.title || "Photo Gallery",
        galleryPhotos: content?.photoGallery?.photos?.map(photo => ({
          url: photo.url || 'https://via.placeholder.com/300x200',
          alt: photo.alt || 'News Photo'
        })) || [],
        popularTags: content?.popularTags || [],
        newsletterTitle: content?.newsletter?.title || "Subscribe to Newsletter",
        newsletterDescription: content?.newsletter?.description || "Get daily updates in your inbox",
        videoNewsTitle: content?.videoNews?.title || "Video News",
        videos: content?.videoNews?.videos || [],
        localNewsTitle: content?.localNews?.title || "Local News",
        localNewsArticles: content?.localNews?.articles || [],
        marqueeItems: content?.marqueeItems || [],
        newsPosts: content?.newsPosts || []
      };
      
      res.json(publicContent);
    } catch (error) {
      console.error('Error in getPublicContent:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get all content (requires auth)
  getAllContent: async (req, res) => {
    try {
      const content = await Content.findOne().sort({ updatedAt: -1 });
      res.json(content || {});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create or update content
  createOrUpdateContent: async (req, res) => {
    try {
      const updates = req.body;

      // First check if content exists
      let content = await Content.findOne();
      
      if (!content) {
        // If no content exists, create new content
        content = new Content(updates);
        await content.save();
        return res.status(201).json({
          success: true,
          message: 'Content created successfully',
          data: content
        });
      }

      // If content exists, update it
      content = await Content.findOneAndUpdate(
        {},  // Empty filter means update the first document found
        updates,
        { new: true, runValidators: true }
      );

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      res.json({
        success: true,
        message: 'Content updated successfully',
        data: content
      });
    } catch (error) {
      console.error('Error in createOrUpdateContent:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Delete content
  deleteContent: async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      await content.deleteOne();
      res.json({ message: 'Content deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Post a news item (for admin)
  postNews: async (req, res) => {
    console.log('Received data for new news post:', JSON.stringify(req.body, null, 2));
    try {
      const { category, heading, news } = req.body;
      
      let image = req.body.image;
if (image === null || image === undefined) {
  image = '';
} else if (Array.isArray(image)) {
  image = image.join('');
} else if (typeof image !== 'string') {
  image = String(image);
}


      if (!category || !heading || !news) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
      let content = await Content.findOne();
      if (!content) {
        content = new Content({ newsPosts: [{ category, heading, news, image }] });
      } else {
        content.newsPosts = content.newsPosts || [];
        content.newsPosts.push({ category, heading, news, image });
      }
      await content.save();
      res.status(201).json({ message: 'News posted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a news item
  updateNews: async (req, res) => {
    console.log(`Received data for updating news post ${req.params.id}:`, JSON.stringify(req.body, null, 2));
    try {
        const { id } = req.params;
        const { category, heading, news } = req.body;
        let image = req.body.image;
        if (image === null || image === undefined) {
            image = '';
        } else if (Array.isArray(image)) {
            image = image.join('');
        } else if (typeof image !== 'string') {
            image = String(image);
        }
        
        if (!category || !heading || !news) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const content = await Content.findOne();
        if (!content) {
            return res.status(404).json({ message: 'Content document not found.' });
        }

        const newsPost = content.newsPosts.id(id);
        if (!newsPost) {
            return res.status(404).json({ message: 'News post not found.' });
        }

        newsPost.category = category;
        newsPost.heading = heading;
        newsPost.news = news;
        newsPost.image = image;

        await content.save();
        res.json({ message: 'News post updated successfully.', newsPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  },

  // Delete a news item
  deleteNews: async (req, res) => {
      try {
          const { id } = req.params;
          const content = await Content.findOne();
          if (!content) {
              return res.status(404).json({ message: 'Content document not found.' });
          }
  
          const newsPost = content.newsPosts.id(id);
          if (!newsPost) {
              return res.status(404).json({ message: 'News post not found.' });
          }
  
          // Use the pull method to remove the subdocument
          content.newsPosts.pull({ _id: id });
          await content.save();
          
          res.json({ message: 'News post deleted successfully.' });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }
};

module.exports = contentController;
