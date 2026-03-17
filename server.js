const express = require('express');
const os = require('os');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'mypass',
  database: process.env.DB_NAME || 'inventory',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function getIPAddress() {
  const interfaces = os.networkInterfaces();

  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }

  return '0.0.0.0';
}

app.get('/', (req, res) => {
  const podName = os.hostname();
  const podIp = getIPAddress();
  const category = req.query.category || '';

  const productSql = category
    ? 'SELECT * FROM products WHERE category = ? ORDER BY category, name'
    : 'SELECT * FROM products ORDER BY category, name';

  const productParams = category ? [category] : [];

  db.query(productSql, productParams, (err, products) => {
    if (err) {
      db.query('SELECT DISTINCT category FROM products ORDER BY category', (err2, categories) => {
        return res.render('index', {
          inventory: [],
          categories: err2 ? [] : categories.map(row => row.category),
          selected: category,
          podName,
          podIp,
          dbError: 'Database unavailable'
        });
      });
      return;
    }

    db.query('SELECT DISTINCT category FROM products ORDER BY category', (err2, categories) => {
      res.render('index', {
        inventory: products,
        categories: err2 ? [] : categories.map(row => row.category),
        selected: category,
        podName,
        podIp,
        dbError: null
      });
    });
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});