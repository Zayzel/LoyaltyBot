//-------- Realtime Chat --------
(function ($) {
    var previous_chat = [], origin = window.location.origin;

    function get_chat() {
        $.ajax({
            url: origin + '/get/chat',
            success: function (data) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (data[key].id !== undefined || data[key].text !== undefined) {
                            if (previous_chat.indexOf(data[key].id) < 0) {
                                // add line id to array
                                previous_chat.push(data[key].id);

                                // separate words
                                var data_split = data[key].text.split(' ');

                                //-------- Raw IRC Module --------
                                update_raw_irc_module(data_split);
                                update_scrollbar();

                                //-------- Auction Module --------
                                update_auction_module(data_split);
                            }
                        }
                    }
                }
                get_chat();
            },
            error: function (x, t) {
                if (t === 'timeout') {
                    $('#chat_line_list').append('<li class="line jtv"><p><span class="chat_line">Server: Request timed out, trying to reconnect (server may be offline)</span></p></li>');
                    update_scrollbar();
                }
                get_chat();
            }, dataType: "json", timeout: 30000
        });
    }
    // start "realtime" chat
    get_chat();

    function update_scrollbar () {
        // update scrollbar
        $('.chat-scroll').mCustomScrollbar("update");
        $('.chat-scroll').mCustomScrollbar("scrollTo","#chat_line_end");
    }
    
    function update_raw_irc_module (data) {
        // raw irc status colors
        switch(data[0]) {
            case 'SENT':
                data.splice(0, 1, '<span class="nick" style="color:dodgerblue">' + data[0] + '&nbsp;</span>');
                break;
            case 'RECV':
                data.splice(0, 1, '<span class="nick" style="color:red">' + data[0] + '&nbsp;</span>');
                break;
        }

        // raw irc message / server response colors
        if (data[3] === 'PRIVMSG') {
            var user = data[2].split('!');
            if (user.length > 1) {
                data.splice(2, 1, '<span style="color:blueviolet;font-style:italic;font-weight:bold">' + user[0].slice(1).charAt(0).toUpperCase() + user[0].slice(2).toLowerCase() + '</span>');
            } else {
                data.splice(2, 1, '<span style="color:blueviolet;font-style:italic;font-weight:bold">' + user + '</span>');
            }
            data.splice(3, 1, '<span style="color:blueviolet;font-style:italic;font-weight:bold">' + data[3] + '</span>');
            data.splice(4, 1, '<span style="color:#666;font-style:italic">' + data[4] + '</span>');
            data.splice(5, 1, data[5].slice(1));
        } else {
            for (var i = 2; i < data.length; i++) {
                if (i === 2) {
                    data.splice(i, 1, '<span style="color:#666;font-style:italic">' + data[i]);
                } else if (i === data.length - 1) {
                    data.splice(i, 1, data[i] + '</span>');
                }
            }
        }

        // add chat line to view
        if (data[3] !== '352') {
            $('#chat_line_list').append('<li class="line jtv"><p><span class="chat_line">' + data.join(' ') + '</span></p></li>');
        }

        // remove first chat line if over limit
        if (previous_chat.length > 200 && $('#chat_line_list li').length > 200) {
            $('#chat_line_list li').first().remove();
            previous_chat = previous_chat.slice(1);
        }
    }

    function update_auction_module (data) {
        var data_text = '';

        for (var i = 6; i < data.length; i++) {
            data_text += i !== data.length - 1 ? data[i] + ' ' : data[i];
        }

        // set auction info
        if (data_text === 'Auction opened, accepting bids') {
            $('.auction_status').css({'opacity':'1', 'background-position': '-230px -268px'}).text('Opened');
            $('#auction_highest_bid').html('').text('Status: ').append('<span style="color: blueviolet">Checking Bids...</span>');
        }
        if (data[6] + ' ' + data[7] === 'Highest bid,') {
            $('#auction_highest_bid').html('').text('Highest Bid: ').append('<span style="color: blueviolet">' + data[8] + ' @ ' + data[10] + '</span>');
        }
        if (data[6] + ' ' + data[7] + ' ' + data[8] == 'Auction closed, Winner:') {
            $('.auction_status').css({'opacity': '.2', 'background-position': '-160px -268px'}).text('Closed');
            $('#auction_highest_bid').html('').text('Winner: ').append('<span style="color: blueviolet">' + data[9] + ' @ ' + data[11] + '</span>');
        }
        if (data_text === 'Auction closed, no bidders to pick a winner') {
            $('.auction_status').css({'opacity': '.2', 'background-position': '-160px -268px'}).text('Closed');
            $('#auction_highest_bid').html('').text('Status: ').append('<span style="color: blueviolet">Closed</span>');
        }
    }
})(jQuery);

//-------- Scrollbars --------
(function ($) {
    $(document).ready(function () {
        $('.auction-scroll').mCustomScrollbar({
            scrollInertia:0,
            advanced:{
                updateOnContentResize: true
            }
        });
        $('.chat-scroll').mCustomScrollbar({
            scrollInertia:0,
            advanced:{
                updateOnContentResize: true
            }
        });
    });
})(jQuery);

//-------- Form Actions --------
(function ($) {
    $(document).ready(function () {
        // reconnect to irc
        $('#irc_reconnect').submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: window.location.origin + '/actions',
                data: {_method: 'reconnect', auth_token: $(this).find('input[name="authenticity_token"]').val()}
            });
        });
        // open / close auction
        $('#auction_open').submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: window.location.origin + '/actions',
                data: {_method: 'auction_open', auth_token: $(this).find('input[name="authenticity_token"]').val(), user: $(this).find('input[name="user"]').val()}
            });
        });
        $('#auction_close').submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: window.location.origin + '/actions',
                data: {_method: 'auction_close', auth_token: $(this).find('input[name="authenticity_token"]').val(), user: $(this).find('input[name="user"]').val()}
            });
        });
    });
})(jQuery);