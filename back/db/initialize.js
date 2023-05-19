const db = require('./db');

const initializeDatabase = async () => {

    const createRefreshTokenTable = `
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            token text PRIMARY KEY,
            user_id int REFERENCES users(id),
            expiry_date timestamptz,
            device_id text NOT NULL
        )
    `;

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            user_name VARCHAR(255) UNIQUE NOT NULL,
            is_authorized BOOLEAN DEFAULT false,
            is_approved BOOLEAN DEFAULT false,
            role VARCHAR(255) DEFAULT 'user'
        );    
    `;

    const createforgotPasswordTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            token VARCHAR(64) NOT NULL,
            expires_at TIMESTAMP NOT NULL
        );    
    `;
    
    const createClientTableQuery = `
        CREATE TABLE IF NOT EXISTS Client (
            id SERIAL PRIMARY KEY,
            child_nb INTEGER,
            sp_category VARCHAR(255)
        );
    `;

    const createCollecteTableQuery = `
        CREATE TABLE IF NOT EXISTS Collecte (
            id SERIAL PRIMARY KEY,
            client_id INTEGER,
            total_basket DECIMAL,
            category VARCHAR(255),
            price DECIMAL,
            FOREIGN KEY (client_id) REFERENCES Client(id)
        );
    `;
    
    db.none(createUsersTable)
    .then(() => {
        console.log('Table users created successfully')
        db.none(createforgotPasswordTable)
        .then(() => console.log('Table forgot password created successfully'))

        db.none(createRefreshTokenTable)
        .then(()=> console.log('Tables refresh_token created successfully'))
    })
    .catch((err) => console.log('Error creating users table', err));

    db.none(createClientTableQuery)
        .then(() => db.none(createCollecteTableQuery))
        .catch(error => console.log('ERROR:', error.message));
}

module.exports = initializeDatabase;
