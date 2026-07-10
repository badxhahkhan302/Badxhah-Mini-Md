const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- PAIRING PAGE ----------
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Mosa MD Bot</title></head>
    <body style="background:#0d0d0d;color:white;font-family:Arial;text-align:center;padding:50px;">
        <h1 style="color:red;">🔥 Mosa MD Bot</h1>
        <h2>👑 Owner: Badxhah Khan</h2>
        <input type="text" id="number" placeholder="923015006314" style="padding:10px;width:300px;border-radius:6px;border:none;">
        <button onclick="getCode()" style="padding:10px 20px;background:red;color:white;border:none;border-radius:6px;">GET PAIR CODE</button>
        <div id="result" style="margin-top:20px;color:lime;"></div>
        <script>
        async function getCode() {
            const num = document.getElementById('number').value.replace(/[^0-9]/g, '');
            if (!num) return alert('Enter number');
            const res = await fetch('/pair?number=' + num);
            const data = await res.json();
            document.getElementById('result').innerText = data.code || 'Error';
        }
        </script>
    </body>
    </html>
    `);
});

// ---------- PAIRING CODE GENERATOR ----------
app.get('/pair', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.json({ error: 'Number required' });

    try {
        const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: ['Mosa MD Bot', 'Chrome', '1.0.0']
        });

        sock.ev.on('creds.update', saveCreds);

        const code = await sock.requestPairingCode(number);
        await sock.ws.close();
        res.json({ code });
    } catch (e) {
        res.json({ error: 'Pairing failed: ' + e.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Mosa MD Bot running on port ${port}`);
});
