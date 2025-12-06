module.exports = {
  resolve: {
    fallback: {
      zlib: require.resolve("browserify-zlib"),
      querystring: require.resolve("querystring-es3"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      fs: false, // fs is not available in the browser
      net: false, // net is not available in the browser
    },
  },
};
