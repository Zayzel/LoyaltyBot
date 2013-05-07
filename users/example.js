var loyaltybot = require('./../lib/initialize.js');

loyaltybot.initialize({
    // twitch info
    twitch : {
        channel     : 'loyaltybot',
        bot         : {name: 'LoyaltyBot', password: 'password'},
        subscribers : 'https://spreadsheets.google.com/feeds/list/****/od6/public/basic?alt=json'
    },

    // currency info
    currency : {
        name     : 'Points',
        payrate  : 15,
        host     : '1.1.1.1',
        user     : 'loyalty',
        password : 'pass',
        database : 'loyaltypoints',
        website  : 'http://www.loyaltypoints.com'
    },

    // optional features
    commands: true
});