"use strict"

const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'

async function getChefNames(){

	var names = [];

	for(var i = 1; i <= 35;i++){
		process.stdout.write("Fetching restaurants page: "+i+"/"+35+"                      \r");
		await request((url + i.toString()), function(err, resp, html){
			if(!err){
				const $ = cheerio.load(html);
				$('div[class=poi_card-display-title]').each(function(i, elm){
					let name = $(this).text();
					name = name.substring(11,name.length - 8);
					names.push(name);
				});
			}
		});
	}
	process.stdout.write("                                                               \r");
	fs.writeFileSync("data/ChefsNames.json", JSON.stringify(names));
}


function michelin(){
	getChefNames();
}

module.exports = michelin;
