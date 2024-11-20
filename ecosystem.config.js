module.exports = {
  apps : [{
    name: "qqapp",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3000 // Or another port if you prefer
    }
  }]
};