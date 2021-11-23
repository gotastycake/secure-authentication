import path from 'path';
const __dirname = path.resolve(path.dirname(''));

import express from 'express';
import { isLogged } from '../controllers/middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/views/index.html');
});

router.get('/dashboard', isLogged, (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <div class="container-md" style="padding-top: 1rem">
            <p class="h1">Hello ${req.user.username}</p>
            <br>
            <a class="btn btn-primary" href="/logout">Log Out</a>
        </div>
    </body>
</html>`);
});

export default router;