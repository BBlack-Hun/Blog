const app = require('./app.js');

PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('backend is running! ' + PORT);
});
