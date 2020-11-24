const path = require('path');
const express = require('express');
const appHttps = express();
const publicPath = path.join(__dirname, '..', 'public');
const https = require('https');
const fs = require('fs');
const appHttp = express();

appHttps.use(express.static(publicPath));

appHttp.get('*', (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`)
})
appHttps.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});

// Certificate
const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/peru-iot4.com/privkey.pem',
    'utf8',
);
const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/peru-iot4.com/cert.pem',
    'utf8',
);
const ca = fs.readFileSync(
    '/etc/letsencrypt/live/peru-iot4.com/chain.pem',
    'utf8',
);

const httpsServer = https.createServer(
    {
       key: privateKey,
       cert: certificate,
       ca,
    },
    appHttps,
);



httpsServer.listen(443, () => {
   console.log('Server Https is up!');
});

appHttp.listen(80, ()=>{
    console.log('Server Http is up!');
})
