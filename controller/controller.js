const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 

// Registrar usuario
const registerUser = async (req, res) => {
    const { name, email, password, companyId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password, company_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, hashedPassword, companyId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Error registrando el usuario' });
    }
};

// Login de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Error al hacer login' });
    }
};

//traer compañias
const getCompanies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching companies:', err);
        res.status(500).json({ error: 'Error al obtener las compañías' });
    }
};


//traer proyectos
const getProyects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

// traer historias de usuario
const getStoryUsers = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await pool.query('SELECT * FROM user_stories WHERE project_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching user_stories:', err);
        res.status(500).json({ error: 'Error al obtener los user_stories' });
    }
};

// crear historias de usuario
const createStoriUser = async (req, res) => {
    const { name, project_id } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO user_stories (name, project_id) VALUES ($1, $2) RETURNING id, name, project_id',
            [name, project_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during create new story user:', err);
        res.status(500).json({ error: 'Error creando la historia de usuario' });
    }
};

    //traer lo tickets
    const getTickets = async (req, res) => {
        const { id } = req.query;
        try {
            const result = await pool.query('SELECT * FROM tickets WHERE user_story_id = $1', [id]);
            res.json(result.rows);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            res.status(500).json({ error: 'Error al obtener los tickets' });
        }
    };

    //crear Tickets
    const createTicket = async (req, res) => {
        const { name, status, user_story_id, comments } = req.body;
    
        try {
            const result = await pool.query(
                'INSERT INTO tickets (name, status, user_story_id, comments) VALUES ($1, $2, $3, $4) RETURNING id, name, status, user_story_id, comments',
                [name, status, user_story_id, comments]
            );
    
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error('Error during create new ticket', err);
            res.status(500).json({ error: 'Error creando el ticket' });
        }
    };

    //editar tickets
    const updateTicket = async (req, res) => {
        const { name, status, comments, ticketId } = req.body;
        try {
            const result = await pool.query(
                `UPDATE tickets SET name = $1, status = $2, comments = $3 WHERE id = $4 RETURNING *`,
                [name, status, comments, ticketId]
            );
            res.json(result.rows[0]);
        } catch (err) {
            console.error('Error updating ticket:', err);
            res.status(500).json({ error: 'Error updating ticket' });
        }
    };


module.exports = { registerUser, loginUser, getCompanies, getProyects, getStoryUsers, createStoriUser, getTickets, createTicket, updateTicket };
