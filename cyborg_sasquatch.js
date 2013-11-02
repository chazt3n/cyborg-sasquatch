var lib = require('./lib');
var AUTH = 'YcIimHUXWLPYfViMKRndGneS';
var USERID = '5273c2e1aaa5cd57a2df6aac';
var ROOMID = '526a8690aaa5cd07092217f0';

var bot = new lib.Bot(AUTH, USERID, ROOMID);

bot.on('speak', function (data) {
  var text = data.text;
  var dj = data.userid;
  console.log(data.name + ': ' + text);
  if (text == '/go') {
    if (lib.tools.checkAccess(dj, bot)) {
      bot.addDj();
    }
  } else if (text == '/stop') {
    if (lib.tools.checkAccess(dj, bot)) {
      bot.remDj();
    }
  } else if (text == '/skip') {
    if (lib.tools.checkAccess(dj, bot)) {
      bot.skip();
    }
  } else if (text == '/add') {
    if (lib.tools.checkAccess(dj, bot)) {
      bot.playlistAll(function (data) {
         bot.roomInfo(function(info){
           var song = info.room.metadata.current_song;
           console.log("adding " + song.metadata.song + ' by ' + song.metadata.artist);
           bot.playlistAdd(song._id, data.list.length);
           console.log("add song: success");
         });
       });
      bot.snag();
    }
  }
});

bot.on('newsong', function(data) {
  bot.bop();
});