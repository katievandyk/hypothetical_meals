// Gives constant name to long directory home page.
const appPage = path.join(__dirname, '../client/build/index.html');

// Allows the use of files.
app.use(express.static('../client/build'));

// SERVES STATIC HOMEPAGE at '/' URL
app.get('*', function(req, res) {
  res.sendFile(appPage)
})

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));