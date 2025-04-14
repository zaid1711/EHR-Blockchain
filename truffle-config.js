module.exports = {
  networks: {
      development: {
          host: "127.0.0.1", // Localhost
          port: 7545, // Ganache's default port
          network_id: "*" // Match any network ID
      }
  },
  compilers: {
      solc: {
          version: "0.8.0" // Use Solidity version 0.8.0
      }
  }
};