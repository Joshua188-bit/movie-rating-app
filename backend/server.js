import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/watchlist', async (req, res) => {
    const { movieId, movie_name, movie_description, poster_path } = req.body;
    console.log('Movie to save:', movieId);


    try {
        const result = await pool.query(
            'INSERT Into Watchlist (Movie_Id, Movie_name, Movie_description, poster_path) Values ($1, $2, $3, $4) Returning *',
            [movieId, movie_name, movie_description, poster_path]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})
app.get('/watchlist', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM watchlist');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.delete('/watchlist/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM Watchlist WHERE Movie_Id = $1',
            [id]
        )
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.post('/favourites', async (req, res) => {
    try {
        const { movieId, movie_name, poster_path } = req.body;

        const result = await pool.query('INSERT INTO FavouriteMovies (Movie_Id, Movie_name, poster_path) Values ($1, $2, $3) Returning *', [movieId, movie_name, poster_path])
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.get('/favourites', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM FavouriteMovies');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
});

app.delete('/favourites/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM favouritemovies WHERE movie_id = $1', [id]);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.post('/ratings', async (req, res) => {
    try {
        const { movieId, movie_name, poster_path, rating, review } = req.body;

        const result = await pool.query(
            `INSERT INTO Rating (movie_id, movie_name, poster_path, rate, Rating_Description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [movieId, movie_name, poster_path, rating, review]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.get('/ratings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Rating Order by id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.delete('/ratings/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM Rating WHERE id = $1', [id]);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.listen(3000, () => {
    console.log("Server running and working");
});