import {
    Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
    // Resets the database of pages
    FacebookPages.remove({});
});

Meteor.publish('facebookPages', function() {
    return FacebookPages.find();
});



Meteor.methods({
    // Adds pages to the FacebookPages collection
    'addPage': function(pageItem) {
        // Checks to make sure duplicates aren't addeds
        if (FacebookPages.findOne({
                _id: pageItem._id
            }) === undefined)
            FacebookPages.insert(pageItem);
    },
    // Gets the pageAccessToken of the connected page for the user
    'getPageAccessToken':function(userId) {
        var accessToken = FacebookPages.findOne({userId:userId,connected:true},{fields:{pageAccessToken: 1}});
        return accessToken.pageAccessToken;
    },
    //  Selects the page to be connected
    'chooseConnected':function(connectedId) {
        // Gets a list of all the user's pages
        var listOfPages = FacebookPages.find({
            userId: Meteor.userId()
        }).fetch();
        // Sets all the unconnected pages to false
        for (page of listOfPages) {
            if (page._id === connectedId) continue;
            var currId = page._id;
            FacebookPages.update({
                _id: currId
            }, {
                $set: {
                    connected: false
                }
            })
        }
        // sets connected page to true
        FacebookPages.update({
            _id: connectedId
        }, {
            $set: {
                connected: true
            }
        })
    }
});
