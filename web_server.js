const http = require("http");
let botReady = false;
let server;

function setBotReady(status) {
  botReady = status;
  // Start the server only when botReady becomes true
  if (botReady && !server) {
    const PORT = process.env.PORT || 3000;
    server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("DES-1405 Bot is active and running!");
    });
    server.listen(PORT, () => {
      console.log(
        `Discord Bot (DES-1405) server running on http://${process.env.HOST || "localhost"}:${PORT}`,
      );
    });
  }
}
module.exports = { setBotReady };
