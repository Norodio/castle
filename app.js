"use strict"

const fs = require('fs');
const request = require('request-promise');
const colors = require('./node_modules/colors/safe');
const Readline = require('readline'); //for reading inputs
const rl = Readline.createInterface({ //for reading inputs
  input : process.stdin,
  output: process.stdout,
  terminal:false
})


const castle = require('./Castle');


function compare(a, b) {
	try {
		if (parseFloat(a.price) < parseFloat(b.price))
	     return -1;
	  if (parseFloat(a.price) > parseFloat(b.price))
	     return 1;
	} catch (e) {

	} finally {

	}
	return 0;
}

async function choixMode() {
  return new Promise(function(resolve, reject) {
    var ask = function() {
      rl.question(colors.yellow('==> '), function(answer) {
        let mode = parseInt(answer);
        if (mode == 1) {
          resolve(mode, reject);
        } else {
          if(mode == 2){
            resolve(mode, reject);
          }
          else{
            console.log("Votre commande n'a pas été comprise, veuillez la retaper");
            ask();
          }
        }
      });
    };
    ask();
  });
}

function afficherChateau(liste){
  for (var i = 0; i < 9; i++) {
    console.log(colors.yellow(liste[i].name));
    console.log(colors.green("A partir de ")+ colors.yellow(liste[i].price+"€"));
    console.log(colors.green(liste[i].ville +", "+liste[i].departement));
    console.log(colors.green("téléphone: "+liste[i].tel));
    console.log(colors.green("link: ") + colors.blue(liste[i].link));
    console.log();
  }
}

async function main(){
	console.clear();
	console.log("Bienvenue dans cette application qui vous permettra de sélectionner L'Hôtel restaurant de vos rèves !");
	console.log();
	console.log();
	console.log("Afin de vous faciliter la sélection, je vous propose deux options:");
	console.log();
	console.log(" - 1: Lancer la sélection parmi les proposition de RelaisChateaux en ligne (chargement long)");
	console.log(" - 2: Lancer la sélection à partir de fichier JSON généré avec le dernier chargement (chargement rapide)");
	console.log();

  var mode = await choixMode();

  let listeChateau;
  let finalListe;
	switch (mode) {
		case 1:
			listeChateau = await castle();
			finalListe = listeChateau.sort(compare);
      afficherChateau(finalListe);
			break;
		case 2:
      listeChateau = require('./data/ChateauReady.json');
      finalListe = listeChateau.sort(compare);
      afficherChateau(finalListe);
      //console.log(finalListe);
			break;


	}
  process.exit();
}


main();
