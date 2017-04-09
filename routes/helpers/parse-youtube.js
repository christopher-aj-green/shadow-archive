var YouTube = require('youtube-node');

var youtube_key = process.env.YOUTUBE_KEY;

module.exports = {
    getYoutubeVideos: function (item, key, callback) {
        var searchQuery = item.author + " " + item.plaintextTitle;
        var youTube = new YouTube();
        youTube.setKey(youtube_key);
        console.log(searchQuery);
        youTube.search(searchQuery, 1, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                if (result.items.length > 0) {
                    if (result.items[0].id.videoId){
                        var youtubeAddress = "https://www.youtube.com/watch?v=" + result.items[0].id.videoId;
                        item.material.push({type: "YouTube", "link": youtubeAddress});
                        // console.log(result.items[0].snippet.description);

                        youTube.getById(result.items[0].id.videoId, function (error, result) {
                            if (error) {
                                console.log(error);
                            } else {
                                if(result.items.length > 0){
                                    // console.log(result.items[0].snippet);
                                    // console.log(result.items[0].snippet.description);
                                    item.youtubeDescription = result.items[0].snippet.description;
                                }
                            }
                            callback(null);

                        })
                    } else {
                        callback(null)
                    }
                } else {

                    callback(null);
                }
            }
        });
    }
};