var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var async = require('async');
var parseYoutube = require('./../helpers/parse-youtube');
// var connection = require('./../helpers/connector')();
var mysql = require('mysql');

var parseBlackhat15 = module.exports = {

    response: function (req, res) {
        console.log("Running app");
        console.log("Request IP", req.connection.remoteAddress);
        var conferenceArchive = [
            {file:"./conference-archives/blackhat/us-14.html", conference: "Black Hat", location: "USA", year: "2014" },
            {file:"./conference-archives/blackhat/us-15.html", conference: "Black Hat", location: "USA", year: "2015" },
            {file:"./conference-archives/blackhat/us-16.html", conference: "Black Hat", location: "USA", year: "2016" },
            {file:"./conference-archives/blackhat/eu-14.html", conference: "Black Hat", location: "Europe", year: "2014" },
            {file: "./conference-archives/blackhat/eu-15.html", conference: "Black Hat", location: "Europe", year: "2015" },
            {file:"./conference-archives/blackhat/eu-16.html", conference: "Black Hat", location: "Europe" , year: "2016"},
            {file:"./conference-archives/blackhat/as-14.html", conference: "Black Hat", location: "Asia", year: "2014" },
            {file:"./conference-archives/blackhat/as-15.html", conference: "Black Hat", location: "Asia", year: "2015" },
            {file:"./conference-archives/blackhat/as-16.html", conference: "Black Hat", location: "Asia", year: "2016" }
        ];
        var items = {};
        console.log(conferenceArchive.length);
        for(var i = 0; i < conferenceArchive.length; i++){
            var $ = cheerio.load(fs.readFileSync(conferenceArchive[i].file));

            $('.span-13').each(function (count, e) {
                var description = "";
                var title = "";
                var plaintextTitle = "";
                var author = "";
                var material = [];
                var conference = conferenceArchive.conference;
                var year = conferenceArchive.year;
                var location = conferenceArchive.location;

                $(e).children().each(function (i, elem) {
                    // items[count] = $(elem).html();

                    if ($(elem).is('h2')) {
                        plaintextTitle = $(elem).text();
                    } else if ($(elem).attr('name') !== undefined) {
                        if (!title) {
                            title = $(elem).attr('name');
                        } else if (!author) {
                            author = $(elem).attr('name');
                        }

                    } else if ($(elem).attr('class') === "link-icon") {
                        material.push({link: $(elem).attr('href')});
                    } else if ($(elem).is('img')) {
                        material[material.length - 1].type = $(elem).attr('title');
                    } else if ($(elem).is('p')) {

                        description += $(elem).text();
                    }
                    if ($(elem).html().indexOf("img") > 0) {
                        var index = $(elem).html().indexOf("title");
                        var titleArray = $(elem).html().substring(index).split("\"");
                        var materialType = titleArray[1];
                        material[material.length - 1].type = materialType;
                    }

                });
                // console.log("title", title);
                // console.log("description", description);
                // console.log("plaintextTitle", plaintextTitle);
                // console.log("material", material);

                items[title] = {};
                items[title].author = author;
                items[title].description = description;
                items[title].plaintextTitle = plaintextTitle;
                items[title].material = material;
                items[title].year = year;
                items[title].location = location;
                items[title].conference = conference;


            });
            console.log($('.span-13').length);
            console.log($('.span-13').children().length);

        }

        async.eachOfLimit(items, 20, parseYoutube.getYoutubeVideos, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send(items);
            }
        });
    },


}