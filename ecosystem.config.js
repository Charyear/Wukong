module.exports = {
  apps: [{
    name: "wukong-server",
    script: "./server.js",
    watch: true,
    env: {
      "NODE_ENV": "production",
    }
  }]
} 