import {
    Template
} from 'meteor/templating';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    Meteor
}
from 'meteor/meteor';
import './main.html';
// Sets up the connection to the facebook sdk
window.fbAsyncInit = function() {
    FB.init({
        appId: '228910220826395',
        status: true,
        xfbml: true,
        version: 'v2.6'
    });
};

Meteor.subscribe('facebookPages');


// Adds the pages a user can post to the database
Template.body.events({
    'click .connect' (event, instance) {
        facebookFindPages(Meteor.userId());
    }
});
// Get's the user's pages
Template.pages.helpers({
    'pages': function() {
        return FacebookPages.find({
            userId: Meteor.userId()
        }, {
            fields: {
                'name': 1
            }
        });
    }
});
// Chooses the page to post to
Template.pageItem.events({
    "click [type=radio]": function() {
        Meteor.call('chooseConnected', this._id);
    },
    'click #select': function() {
        Router.go('/post');
    }
});
// updates the radio buttons
Template.pageItem.helpers({
    'checked': function() {
        var isConnected = this.connected;
        if (isConnected)
            return "checked";
        else
            return "";
    }
});
// submits the page post
Template.post.events({
    "click #submit": function() {
        Meteor.call('getPageAccessToken', Meteor.userId(), function(error, result) {
            if (error) {}
            if (result) {
                var message = $('#message').val();
                facebookPostAsPage(result, message);
                $('#message').val('');
            }
        });
    }
});
// Gets the user's managable pages and adds them to the database
function facebookFindPages(userId) {
    // Makes a call to the Facebook graph API and gets a list of all the pages the given userAccessToken has access to
    FB.api(
        '/me/accounts',
        'GET', {
            "fields": "access_token,name",
            // "access_token": userAccessToken
        },
        function(response) {
            // Adds all of the user's pages to the database
            for (page of response.data) {
                var pageItem = {
                    name: page.name,
                    pageAccessToken: page.access_token,
                    _id: page.id,
                    userId: Meteor.userId(),
                    connected: false
                };
                Meteor.call('addPage', pageItem)

            }
        }
    );
}
// Posts a message to the given page
function facebookPostAsPage(pageAccessToken, message) {
    // Makes a call to the facebook graph api and posts to the given message to the given page
    FB.api(
        '/feed',
        'POST', {
            "message": message,
            "access_token": pageAccessToken
        },
        function(response) {}
    );
}
