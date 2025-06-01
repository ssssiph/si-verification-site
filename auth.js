const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Загружаем переменные из .env

const app = express();

app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;
    if (!code) return res.redirect('https://si-verification-site-production.up.railway.app'); // Если отказ

    const params = new URLSearchParams({
        client_id: "1377205378181496852",
        client_secret: process.env.CLIENT_SECRET, // Берём из .env
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://si-verification-site-production.up.railway.app/auth/callback"
    });

    try {
        const response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const data = await response.json();

        if (data.access_token) {
            res.redirect(`https://si-verification-site-production.up.railway.app/verification.html?username=${encodeURIComponent(state)}`);
        } else {
            res.redirect('https://si-verification-site-production.up.railway.app'); // Ошибка авторизации
        }
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        res.redirect('https://si-verification-site-production.up.railway.app');
    }
});

app.listen(3000, () => console.log("Auth сервер запущен!"));
