"use strict"

const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');


const michelin = require('../michelin');
const prix = require('../ChateauPrix');

async function getChateauxLink(){

	var urls = [];
	await request('https://www.relaischateaux.com/fr/site-map/etablissements',(error, response, html)=> {

		var $ = cheerio.load(html);


		$('#countryF').find("h3:contains('France')").parent().find('.listDiamond > li').each( function (index, value) {

			urls.push($(this).find("a").first()[0].attribs.href);
			});
			console.log();
	});
	fs.writeFileSync("data/UrlsChateauNonTrie.json", JSON.stringify(urls));
	}

async function filtrerChateauRestaurant(urls, michelin){
	var urlsTrie = []

	for (var i = 0; i < urls.length; i++) {
		process.stdout.write("Sorting Castles: "+i+"/"+urls.length+"                                      \r");

		var restaurant = false ;
		var hotel = false;
		await request(urls[i],(error,response,html)=>{
				var $ = cheerio.load(html);

				$('.jsSecondNav').find('.jsSecondNavMain > li').each( function (index, value) {
					var type =$(this).find("a").children().text();
					if(type.includes("Hôtel")){
						hotel = true;
					}
					if(type.includes("Restaurant")){
						restaurant = true;
					}
					});
					var name = $(".mainTitle2").first().text();
					name = name.substring(25,name.length - 37);
				if(hotel && restaurant && (rechercher(michelin,name) != -1)){
					urlsTrie.push(urls[i]);
				}
		});
	}
	process.stdout.write("                                                                                 \r");
	fs.writeFileSync("data/UrlsChateauTrie.json", JSON.stringify(urlsTrie));
}

function rechercher(tableau,element){
	for (var i = 0; i < tableau.length; i++) {
		if(tableau[i] == element){
			return i;
		}
	}
	return -1;
}








//lancer tout
async function main(){
	await getChateauxLink();
	await michelin();
	let json = require('../data/ChefsNames.json');
	let chateauNonTrie = require("../data/UrlsChateauNonTrie");
	await filtrerChateauRestaurant(chateauNonTrie,json);
	let chateauTrie = require('../data/UrlsChateauTrie');
	await prix(chateauTrie);
  let finalListe = require ('../data/ChateauReady.json');
  return finalListe;
}




module.exports = main;
