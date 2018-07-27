const OverwatchLeague = require('overwatchleague');
const OWL = new OverwatchLeague();
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0].toLowerCase();
        
        args = args.splice(1);
        switch(cmd) {
            // retrieve information about Overwatch League
            case 'info': 
            	OWL.getInfo().then(response=>{bot.sendMessage({
                    to: channelID,
                    message: Object.values(response.data)[0] + ", " + Object.values(response.data)[1] + ", " + Object.values(response.data)[3]
                });})
            // case 'info': 
            // 	OWL.getInfo().then(response=>{bot.sendMessage({
            //         to: channelID,
            //         message: Object.values(response.data).join(', ')
            //     });})

            break;

            //retrieve current rankings
            case 'ranking': 
            	OWL.getRankings().then(response=>{bot.sendMessage({
                    to: channelID,
                    message: "1. " + Object.values(Object.values(Object.values(response.data)[0][0])[0])[3] + "\n2. " + Object.values(Object.values(Object.values(response.data)[0][3])[0])[3]  + "\n3. " + Object.values(Object.values(Object.values(response.data)[0][4])[0])[3] + "\n4. " + Object.values(Object.values(Object.values(response.data)[0][5])[0])[3] + "\n5. " + Object.values(Object.values(Object.values(response.data)[0][1])[0])[3] + "\n6. " + Object.values(Object.values(Object.values(response.data)[0][2])[0])[3] + "\n7. " + Object.values(Object.values(Object.values(response.data)[0][6])[0])[3] + "\n8. " + Object.values(Object.values(Object.values(response.data)[0][7])[0])[3] + "\n9. " + Object.values(Object.values(Object.values(response.data)[0][8])[0])[3] + "\n10. " + Object.values(Object.values(Object.values(response.data)[0][9])[0])[3] + "\n11. " + Object.values(Object.values(Object.values(response.data)[0][10])[0])[3] + "\n12. " + Object.values(Object.values(Object.values(response.data)[0][11])[0])[3]
                });});

            break;

            //retrieve schedule of matches
            case 'schedule':
            		bot.sendMessage({
                    to: channelID,
                    message: "https://overwatchleague.com/en-us/schedule"
                });
                
            break;

            // retrieve list of teams
            case 'teams':
             	OWL.getTeams().then(response => {
            		bot.sendMessage({
                    to: channelID,
                    message: Object.values(response.data)[4].map(p => p.competitor).map(a => a.name).join('\n')
                });});
                
            break;

            //retrieve game difference for a specific team
            case 'mapdiff':
            	OWL.getGameDiff(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break;

            //maps lost for a specific team
            case 'maploss':
            	OWL.getGameLoss(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break;

            //maps tied for a specific team
            case 'maptie':
            	OWL.getGameTie(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break;

            //maps won for a specific team
            case 'mapwin':
				OWL.getGameWin(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break; 

            //matches won for a specific team
            case 'matchwin':
            	OWL.getMatchWins(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break;

            //matches lost for a specific team
            case 'matchloss':
            	OWL.getMatchLoss(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data
                });});

            break;

            case 'winpercentage':
            	OWL.getWinPCT(args[0]).then(response => {bot.sendMessage({
                    to: channelID,
                    message: response.data + "%"
                });});

            break;

            // retrieve players for a specific team
            case 'players':
              OWL.getPlayers(args[0]).then(response => {
            		bot.sendMessage({
                    to: channelID,
                    message: response.data.map(p => p.name).join('\n')
                });});

            break;

            //live match data
            case 'livematch':
            	OWL.getLiveMatch().then(response => {
            		console.log(response.data);
            		bot.sendMessage({
                    to: channelID,
                    message: Object.values(response.data)
                });});

            break;


            //retrieve next match for specific team
            // case 'nextmatch':
            // 	OWL.nextMatchForTeam(args[0]).then(response => {bot.sendMessage({
            //         to: channelID,
            //         message: response.data
            //     });});

            // break;

            //retrieve previous match for specific team
            // case 'prevmatch':
            // 	OWL.lastMatchForTeam(args[0]).then(response => {bot.sendMessage({
            //         to: channelID,
            //         message: response.data
            //     });});

            // break;
            default:
            	bot.sendMessage({
                    to: channelID,
                    message: "Please enter a valid command."
                });

         }
     }
});