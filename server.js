require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/about', (req, res) => {
    res.end('Welcome to the Seren bot');
})

app.get('/auth/callback', (req, res) => {
    console.log('GET CALLBACK ', req)
    res.end('Hi')
})
app.post('/auth/callback', (req, res) => {
    console.log('POST CALLBACK ', req)
    res.end('Hi')
})

app.get('/messages', (req, res) => {
    console.log('GET MESSAGES ', req)
    res.end('Hi')
})
app.post('/messages', (req, res) => {
    console.log('POST MESSAGES ', req)
    res.end('Hi')
})

app.listen(port, () => console.log('App Server running on port: ', port))