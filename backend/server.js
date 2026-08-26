import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validator from 'validator';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();


app.post('/watchlist', requireAuth, async (req, res) => {
    const { movieId, movie_name, movie_description, poster_path } = req.body;
    console.log('Movie to save:', movieId);


    try {
        const result = await pool.query(
            'INSERT Into Watchlist (Movie_Id, Movie_name, Movie_description, poster_path, user_id) Values ($1, $2, $3, $4, $5) Returning *',
            [movieId, movie_name, movie_description, poster_path, req.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})
app.get('/watchlist', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [req.userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.delete('/watchlist/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM Watchlist WHERE Movie_Id = $1 AND user_id = $2 RETURNING *',
            [id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found or not yours' });
        }

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.post('/favourites', requireAuth, async (req, res) => {
    try {
        const { movieId, movie_name, poster_path } = req.body;

        const result = await pool.query('INSERT INTO FavouriteMovies (Movie_Id, Movie_name, poster_path, user_id) Values ($1, $2, $3, $4) Returning *', [movieId, movie_name, poster_path, req.userId])
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.get('/favourites', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM FavouriteMovies WHERE user_id = $1', [req.userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
});

app.delete('/favourites/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM favouritemovies WHERE movie_id = $1 AND user_id = $2 Returning *', [id, req.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.post('/ratings', requireAuth, async (req, res) => {
    try {
        const { movieId, movie_name, poster_path, rating, review } = req.body;

        const result = await pool.query(
            `INSERT INTO Rating (movie_id, movie_name, poster_path, rate, Rating_Description, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [movieId, movie_name, poster_path, rating, review, req.userId]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.get('/ratings', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Rating WHERE user_id = $1 Order by id DESC', [req.userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.delete('/ratings/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM Rating WHERE id = $1 AND user_id = $2 Returning *', [id, req.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        const userExists = await pool.query('SELECT user_id FROM Users WHERE user_email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO Users (user_email, password_Hash) VALUES ($1, $2) RETURNING user_id, user_email',
            [email, password_hash]
        );


        const newUser = result.rows[0];

        const accessToken = jwt.sign(
            { userId: newUser.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: newUser.user_id },
            process.env.REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        await pool.query(
            'INSERT INTO Refresh_Tokens (user_id, token) VALUES ($1, $2)',
            [newUser.user_id, refreshToken]
        );

        res.status(201).json({ accessToken, refreshToken, user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query('SELECT * FROM Users WHERE user_email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const accessToken = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.user_id },
            process.env.REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        await pool.query(
            'INSERT INTO Refresh_Tokens (user_id, token) VALUES ($1, $2)',
            [user.user_id, refreshToken]
        );
        res.status(200).json({ accessToken, refreshToken });

    } catch (error) {
        console.error(error);
        res.status(500).json('Database Error');
    }

})

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Sorry not Authorized' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenData.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}



app.listen(3000, () => {
    console.log("Server running and working");
});