const http = require("http");
let botReady = false; // flag to track bot status
// Export a function so your bot can update the flag
function setBotReady(status) {
  botReady = status;
}

const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    if (botReady) {
      res.end("DES-1405 Bot is active and running!");
    } else {
      res.end("DES-1405 Bot is starting up, not ready yet...");
    }
  })
  .listen(PORT, () => {
    console.log(
      `Discord Bot (DES-1405) server running on port http://${process.env.HOST || "localhost"}:${PORT}`,
    );
  });

module.exports = { setBotReady };
