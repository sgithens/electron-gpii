window.$ = window.jQuery = require("./static/jquery-2.1.4.js");

var curtoken = false;


var updateUI = function(curtoken) {
    if (curtoken) {
        $('.curuser').html(curtoken);
    }
    else {
        $('.curuser').html("No one logged in");
    }
};

/**
 *  There are three possible return values. The system is not running at all,
 *  the system is running and no one is logged in, or the system is running and
 *  someone is logged in.
 *
 *  You'll pass in a callback, taking one of these which are structured as:
 *  - Someone logged in: [ 'actual-user-token' ]
 *  - No one logged in: [ false ]
 *  - System not running: [ 404 ]
 *
 *  These are all the first item in the returned array so you should be able
 *  to check for false, 404, or the name of the user token.
 */
var checkSytem = function(callback) {
    $.ajax({
        url: "http://localhost:8081/userToken",
        dataType: "json",
        success: function(data) {
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseJSON) {
                var data = jqXHR.responseJSON;
                if (data.isError && data.message.indexOf("No user currently logged in to the system") == 0) {
                    callback([false]);
                }
                else if (data.isError) {
                    console.log("Some other correct error.");
                }
            }
            else {
                callback([404]);
            }
        }
    });
};

var loginWithUser = function(usertoken) {
    $.ajax({
        url: "http://localhost:8081/user/"+usertoken+"/login",
        success: function() {
            updateUI(usertoken);
            curtoken = usertoken;
        },
        error: function() {

        }
    });
};

var logout = function() {
    $.ajax({
        url: "http://localhost:8081/user/"+curtoken+"/logout",
        success: function() {
            curtoken = false;
            updateUI(token);
        },
        error: function() {

        }
    });
};

$(document).ready(function () {
    $(".userlogin").click(function () {
        var token = $(this).data('token');
        loginWithUser(token);
    });

    $(".userlogout").click(function () {
        logout();
    })

    var statusPing = function() {
        checkSytem(function(val) { console.log(val); });
        window.setTimeout(statusPing, 2500);
    };

    window.setTimeout(statusPing, 1000);
});
