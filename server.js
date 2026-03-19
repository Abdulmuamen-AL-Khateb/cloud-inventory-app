const express = require('express');
const os = require('os');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 80;

app.set('view engine', 'ejs');

// Database connection — matches db-service ClusterIP and secret.yaml
const db = mysql.createPool({
    host:     process.env.DB_HOST     || 'db-service',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'mypass',
    database: process.env.DB_NAME     || 'inventory'
});

// Get the first non-internal IPv4 address
function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
}

// Homepage — query all products including new fields
app.get('/', (req, res) => {
    const podName = os.hostname();
    const podIp   = getIPAddress();

    // Optional: filter by category via ?category=CPU
    const category = req.query.category || null;
    const sql = category
        ? 'SELECT * FROM products WHERE category = ? ORDER BY category, name'
        : 'SELECT * FROM products ORDER BY category, name';
    const params = category ? [category] : [];

    db.query(sql, params, (err, results) => {

        // Build unique category list for filter dropdown
        db.query('SELECT DISTINCT category FROM products ORDER BY category', (err2, cats) => {
            res.render('index', {
                inventory:   err ? [] : results,
                categories:  err2 ? [] : cats.map(r => r.category),
                selected:    category,
                podName:     podName,
                podIp:       podIp,
                dbError:     err ? 'Database unavailable' : null
            });
        });
    });
});

app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
});
