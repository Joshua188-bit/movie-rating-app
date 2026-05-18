import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/watchlist', (req, res) => {
    const { movieId } = req.body;
    console.log('Movie to save:', movieId);
    res.status(201).json('recieved movie');
})

app.listen(3000, () => {
    console.log("Server running and working");
});