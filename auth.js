const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
        return res.redirect('https://si-verification-site-production.up.railway.app');
    }

    const params = new URLSearchParams({
        client_id: "1377205378181496852",
        client_secret: process.env.CLIENT_SECRET,
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

        if (!data.access_token) {
            console.error("Ошибка получения токена:", data);
            return res.redirect('https://si-verification-site-production.up.railway.app');
        }

        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${data.access_token}` }
        });

        const userData = await userResponse.json();

        if (!userData.id) {
            console.error("Ошибка получения данных пользователя:", userData);
            return res.redirect('https://si-verification-site-production.up.railway.app');
        }

        console.log(`✅ Авторизован: ${userData.username}#${userData.discriminator} (ID: ${userData.id})`);

        res.redirect(`https://si-verification-site-production.up.railway.app/verification.html?username=${encodeURIComponent(state)}&discord_id=${userData.id}`);
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        res.redirect('https://si-verification-site-production.up.railway.app');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Auth сервер запущен на порту ${PORT}!`));
