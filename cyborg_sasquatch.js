var app = require("./app");

//TODO: read options from DB
var options = {
  auth: 'XXXXXXXXXXXXXXXXXXXXXXX',
  userId: 'XXXXXXXXXXXXXXXXXXXXXXX',
  roomId: 'XXXXXXXXXXXXXXXXXXXXXXX',
  version: '1.0-beta.7'
};

var bot = new app.Bot(options.auth, options.userId, options.roomId);

app.tools.setupBasicInteractions(bot, options);

bot.on('speak', function(data){
  console.log(data.name + ': ' + data.text);
  if (data.text === '/who') {
    bot.speak('I am Cyborg Sasquatch, version ' + options.version + '. I fight for the users.');
  }
  else if (data.text === '/skip' && app.tools.checkAccess(data.userid, bot, options)) {
    bot.skip();
  }
  else if (data.text === '/add' && app.tools.checkAccess(data.userid, bot, options)) {
    app.tools.snagCurrentSong(bot);
  }
});