const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },

  devServer: {
    allowedHosts: 'all', // Permite cualquier host, incluyendo los generados por ngrok
    client: {
      webSocketURL: {
        hostname: "a674-200-68-172-3.ngrok-free.app", // Cambia por tu URL generada por ngrok
        protocol: "wss", // Usa WebSocket seguro
        port: 443, // Puerto estándar para HTTPS
      },
    },
  },
});
