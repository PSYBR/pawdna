import express from 'express';
import { connectDB } from './config/db.mjs';
import 'dotenv/config';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.js';
import petsRoutes from './routes/pets.js';
import postsRoutes from './routes/posts.js'; 
import feedRoutes from './routes/feed.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
let connection;

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/feed', feedRoutes);

app.listen(PORT, async () => {
    connection = await connectDB();
    console.log(`Server listening on port ${PORT}...`);
});

export default { connection, app};