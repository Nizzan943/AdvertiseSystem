const express = require('express');
const app = express();
const port = 8080;

console.log(`Server started `)

app.get('/', (req, res) => {
    res.send('yessss');
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port} :)`);
});
