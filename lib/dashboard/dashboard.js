var file = require('fs'),
    http = require('http'),
    querystring = require('querystring'),
    mustache = require('mustache');

function Server(irc, options) {
    var __self = this;
    __self.options = options || {};

    __self.irc = irc;

    //config
    __self.root = __self.options.root || '';
    __self.channel = __self.options.channel.toLowerCase() || '';
    __self.bot = __self.options.bot_name || '';
    __self.port = __self.options.dashboard_id || '';
}

Server.prototype.start = function () {
    var __self = this;

    http.createServer(function (request, response) {
        var handle, patterns, rest_uri, match, mimes;

        mimes = [
            {css: 'text/css', encoding: 'utf8'},
            {js: 'application/javascript', encoding: 'utf8'},
            {html: 'text/html', encoding: 'utf8'},
            {jpg: 'image/jpeg', encoding: 'binary'},
            {png: 'image/png', encoding: 'binary'},
            {gif: 'image/gif', encoding: 'binary'},
            {eot: 'application/vnd.ms-fontobject', encoding: 'binary'},
            {otf: 'application/octet-stream', encoding: 'binary'},
            {ttf: 'application/octet-stream', encoding: 'binary'},
            {woff: 'application/x-font-woff', encoding: 'binary'}
        ];

        // remove start and end slashes
        rest_uri = request.url.replace(/^\/|\/$/i, '');

        // reg patterns
        patterns = {
            realtimechat: /get\/chat$/i,
            dashboard: /v1\/dashboard$/i,
            actions: /actions$/i,
            all: /(.*\/)(.*)\.(\w+)$|(.*)\.(\w+)$/i
        };

        // match with patterns
        for (var key in patterns) {
            if (patterns[key].test(rest_uri)) {
                match = rest_uri.match(patterns[key]);
                handle = key;
                break;
            }
        }

        // organize requests
        if (handle == 'realtimechat') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            file.exists(__self.log, function (exists) {
                if (exists) {
                    file.readFile(__self.log, 'utf8', function (err, data) {
                        if (data !== null) {
                            var json = [];
                            data = data.split('\r\n');
                            for (var i = 0; i < data.length - 1; i++) {
                                json[i] = {id: i, text: data[i]};
                            }
                            response.end(JSON.stringify(json));
                        }
                        // TODO: fix up the json request so it takes less memory
                        /*if (data !== null) {
                            var json = [], max_length;
                            data = data.split('\r\n');
                            max_length = data.length > 200 ? 200 : data.length;
                            for (var i = 0; i < max_length; i++) {
                                var check_length = data.length > 200 ? (data.length - 200) + i : i;
                                json[i] = {id: check_length, text: data[check_length]};
                            }
                            response.end(JSON.stringify(json));
                        }*/
                    });
                } else {
                    response.end('{"Error":"Chat does not exist"}');
                }
            });
        }

        if (handle == 'dashboard') {
            file.readFile(__self.root + '/dashboard.html', 'utf8', function (err, data) {
                var template = {botname: __self.bot, channelname: __self.channel, user: __self.channel.charAt(0).toUpperCase() + __self.channel.slice(0).toLowerCase()};
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(mustache.render(data, template));
            });
        }

        if (handle == 'actions') {
            if (request.method == 'POST') {
                var post_header = '';

                request.on('data', function (chunk) {
                    post_header += chunk.toString();
                });

                request.on('end', function () {
                    var decoded_header = querystring.parse(post_header);

                    response.writeHead(200, {'Content-Type': 'text/html'});

                    switch(decoded_header._method) {
                    case 'reconnect':
                        __self.irc.reconnect();
                        response.end();
                        break;
                    case 'auction_open':
                        __self.irc.msg('!arcoins auction open');
                        response.end();
                        break;
                    case 'auction_close':
                        __self.irc.msg('!arcoins auction close');
                        response.end();
                        break;
                    default:
                        response.end();
                    }
                });
            }
        }

        if (handle == 'all') {
            file.exists(__self.root + '/' + match[0], function (exists) {
                if (exists) {
                    var mime, encoding;
                    for (var i = 0; i < mimes.length; i++) {
                        for (var key in mimes[i]) {
                            if (match[3] == key || match[5] == key) {
                                mime = mimes[i][key];
                                encoding = mimes[i].encoding;
                                break;
                            }
                        }
                    }
                    file.readFile(__self.root + '/' + match[0], encoding, function (err, data) {
                        response.writeHead(200, {'Content-Type': mime});
                        if (encoding == 'binary') {
                            response.end(data, 'binary');
                        } else {
                            response.end(data);
                        }
                    });
                } else {
                    fourohfour();
                }
            });
        }

        if (handle === undefined) {
            fourohfour();
        }

        function fourohfour() {
            file.readFile(__self.root + '/404.html', 'utf8', function (err, data) {
                response.writeHead(404, {'Content-Type': 'text/html'});
                response.end(data);
            });
        }

    }).listen(__self.port);
    console.log('> Dashboard for ' + __self.bot + ' running on http://localhost:' + __self.port + '/v1/dashboard');
};

module.exports = function (irc, options) {
    return new Server(irc, options);
};