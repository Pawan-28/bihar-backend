const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      try {
        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password (simple comparison)
        if (admin.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
          { id: admin._id, username: admin.username },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          token,
          admin: {
            id: admin._id,
            username: admin.username
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ message: 'Database error occurred' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error occurred' });
    }
  }
};

module.exports = authController;