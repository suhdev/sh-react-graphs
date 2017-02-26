module.exports = {
  entry:{
      "app":"./src/app.tsx",
  },
  resolve: {
   extensions: [".tsx", ".ts", ".js"]
 },
  output: {
    filename: '[name].js',
    path: __dirname
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        loader: 'ts-loader'
      }
    ]
  }
}