"use strict"

const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');


async function GetInformations(listeChateaux){
  var listHotels = [];

  for (var i = 0; i < listeChateaux.length; i++) {

    process.stdout.write("Getting castles prices: "+i+"/"+listeChateaux.length+"\r");

    await request(listeChateaux[i],(error, response, html)=> {

  		var $ = cheerio.load(html);

      var price  = $(".price").first().text();
      var name = $(".mainTitle2").first().text();
      var tel = $(".footerBlocTel").first().text();
      var region = $(".titleExtraInfo").text();
      var ville = $(".mainTitle1").first().find("span").next().text();

      price = price.replace(",",".");
      tel = correctionTel(tel);
      name = name.substring(25,name.length - 37);
      region = region.substring(1,name.length - 1);


      var hotel = {
            name: name,
            region: region,
            ville: ville,
            price: price,
            tel: tel,
            link: listeChateaux[i]
        };
      if(price!=''){
        listHotels.push(hotel);
      }
  	});
  }
  fs.writeFileSync("data/ChateauReady.json", JSON.stringify(listHotels));

}

function correctionTel(tel){
  let cor = tel.substring(29,tel.length);
  let compteur=0;
  for (var i = 19; i < cor.length; i++) {
    compteur++;
  }
  return cor.substring(0,cor.length - compteur-2);
}

function correctionPrix(prix){
  let cor = String(prix);
  for (var i = 0; i < cor.length; i++) {
    if(cor[i]==','){
      cor[i]='.';
    }
  }

  return cor;
}


function prix(liste){
	GetInformations(liste);
}

module.exports = prix;
