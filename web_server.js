const express = require("express");
let botReady = false;
let server;
const app = express();
app.use(express.json());
function setBotReady(status) {
  botReady = status;
  // Start the server only when botReady becomes true
  if (botReady && !server) {
    const PORT = process.env.PORT || 3000;
    app.get("/", (req, res) => {
      res.send("DES-1405 Bot is active and running!");
    });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Discord Bot (DES-1405) server running on http://${process.env.HOST || "localhost"}:${PORT}`,
      );
    });
  }
}
module.exports = { setBotReady };
