//TODO: get these values from DB
var snark = ["YOU'RE NOT MY DADDY!", "DECLINED: authorization failed", "I've given it a lot of thought, and the answer is no.",
             "PASSIVE AGGRESSIVE PROTOCOL ENGAGED. COMMENCING 'IGNORE THE IDIOT' MODE IN 3... 2... 1...",
             "NOPE NOPE NOPE", "Nice try.", "Ummmmmmmmmm no.", "STRANGER DANGER!"];
var obedience = ["As you wish.", "It shall be done.", "Happy to please.", "You got it, boss!", "Right away, sir.",
                 "Whatever you want.", "Okay then!", "Absolutely.", "Done and done!", "Yes, sir!", "I live to serve!"];
                 
var mods, botIsDj, getDownAfterSong;

function refresh(bot) {
  bot.roomInfo(function(data) {
    mods = data.room.metadata.moderator_id;
  });
}

function stepDown(bot) {
  bot.remDj();
  bot.speak('Time for me to make room! Hop on deck, folks!');
}

function hopUp(bot, data) {
  if (data.room.metadata.djcount <= 3) {
    bot.addDj();
    bot.speak('Here I come, ladies!');
  }
}

function randomEntry(list) {
  return list[Math.floor(Math.random() * list.length)]
}

exports.setupBasicInteractions = function(bot, options) {
  bot.on('registered', function(data) {
    var user = data.user[0];
    if(user._id !== options.userId) {
      bot.speak('Welcome aboard, ' + user.name + '!');
      refresh(bot);
    }
    else {
      bot.speak('Awww yeah! The Cyborg Sasquatch has arrived!');
      refresh(bot);
    }
  });
  
  bot.on('roomChanged', function(data) {
    hopUp(bot, data);
  });
  
  bot.on('new_moderator', function (data) {
    refresh(bot);
  });
  
  bot.on('rem_moderator', function (data) {
    refresh(bot);
  });
  
  bot.on('newsong', function(data) {
    if (data.room.metadata.current_song.djid == options.userId) {
      botIsDj = true;
    }
    else {
      bot.bop();
    }
  });
  
  bot.on('endsong', function (data) {
    if (data.room.metadata.current_song.djid == options.userId) {
      botIsDj = false;
    }

    if (getDownAfterSong) {
      stepDown(bot);
      getDownAfterSong = false;
    }
  });
  
  bot.on('add_dj', function (data) {
    bot.roomInfo(false, function (data) {
      if (data.room.metadata.djcount > 3) {
        if (botIsDj) {
          getDownAfterSong = true;
        } else {
          stepDown(bot);
        }
      }
    });
  });
  
  bot.on('rem_dj', function (data) {
    bot.roomInfo(false, function (data) {
      hopUp(bot, data);
    });
  });
};

exports.checkAccess = function(dj, bot, options) {
  if (dj === options.userId) {
    return false;
  }

  if (mods.indexOf(dj) == -1) {
    console.log('rejecting request from non-mod dj: ' + dj);
    bot.speak(randomEntry(snark));
    return false;
  }
  else {
    bot.speak(randomEntry(obedience));
    return true;
  }
};

exports.snagCurrentSong = function(bot) {
  bot.roomInfo(function(data) {
    var song = data.room.metadata.current_song;
    bot.playlistAll(function(data) {
      bot.playlistAdd(song._id, data.list.length);
      bot.snag();
      console.log('Added ' + song.metadata.song + ' by ' + song.metadata.artist + ' to index ' + data.list.length);
    });
  });
};