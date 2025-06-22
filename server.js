const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/log', async (req, res) => {
    try {

        const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let clientIp = rawIp.includes('::ffff:') ? rawIp.split('::ffff:')[1] : rawIp;
        if (clientIp === '::1') clientIp = '127.0.0.1';

        const clientPort = req.socket.remotePort;
        const currentTime = new Date().toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let clientData = {};
        try {
            const data = await fs.readFile('client.json', 'utf8');
            clientData = JSON.parse(data);
        } catch (error) {
            clientData = {};
        }

        const newKey = Object.keys(clientData).length + 1;
        clientData[newKey] = {
            IpAddrClient: clientIp,
            port: clientPort,
            Time: currentTime
        };

        await fs.writeFile('client.json', JSON.stringify(clientData, null, 2));
        res.send(`Дані успішно записані у client.json! Ваш IP: ${clientIp}, порт: ${clientPort}`);
    } catch (error) {
        res.status(500).send('Помилка при записі даних: ' + error.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
