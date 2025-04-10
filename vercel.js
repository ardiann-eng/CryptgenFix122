// This script helps Vercel handle SPA (Single Page Application) routing
// It redirects all requests to index.html so the client-side router can handle them

module.exports = (req, res) => {
  // Handle API routes normally
  if (req.url.startsWith('/api/')) {
    return;
  }
  
  // For all other routes, serve the SPA's index.html
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CryptGen</title>
      <meta http-equiv="refresh" content="0;URL='/'" />
    </head>
    <body>
      <p>Redirecting to the application...</p>
    </body>
    </html>
  `);
};