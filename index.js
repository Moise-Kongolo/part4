// Importation
// Load the app module
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

// Start the application
const { PORT } = config;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
