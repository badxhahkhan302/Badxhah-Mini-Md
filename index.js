const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mosa MD Bot Running! 🔥');
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
