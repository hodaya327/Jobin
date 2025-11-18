import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes.js';
import downloadRoutes from "./routes/download.routes.js";

dotenv.config();



const app = express();
app.use(cors());
// 🟢 הגדלת מגבלת JSON כדי לאפשר שליחת תמונה מקודדת (Base64)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use(express.json());

app.use('/api', uploadRoutes);
app.use("/api", downloadRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));