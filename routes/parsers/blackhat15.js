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

        var $ = cheerio.load(fs.readFileSync("./conference-archives/blackhat/us-14.html"));
        var items = {};

        $('.span-13').each(function (count, e) {
            var description = "";
            var title = "";
            var plaintextTitle = "";
            var author = "";
            var material = [];

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
            console.log("title", title);
            console.log("description", description);
            console.log("plaintextTitle", plaintextTitle);
            console.log("material", material);

            items[title] = {};
            items[title].author = author;
            items[title].description = description;
            items[title].plaintextTitle = plaintextTitle;
            items[title].material = material;

        });
        console.log($('.span-13').length);
        console.log($('.span-13').children().length);

        async.each(items, parseYoutube.getYoutubeVideos, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send(items);
            }
        });

    },


}