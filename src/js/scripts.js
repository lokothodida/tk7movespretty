/*!
 * =============================
 * =	Mike Pinto             =
 * =	mspkvp@github.com      =
 * =	©2017 tk7movespretty   =
 * ============================= */
/* global d3, Cookies */
;(function(exports) {

'use strict';

var characterData = [],
	ctrlsMap,
	hitsMap = [];

/** States **/
var selectedCharacter = "32",
	lang = 1,
	langIndex = 0,
	jap = false,
	prefDialog = false,
	charMenuDialog = false,
	buttonLayouts = ["STEAM", "PS4","XBOX"],
	buttonLayoutChoice = 2;

function getCookie() {
	if (typeof Cookies.get('tk7moves') != 'undefined') {
		d3.select("#platf-select > option:nth-child("+(buttonLayoutChoice+1)+")").attr("selected",false);
		d3.select("#lang-select > option:nth-child("+(langIndex+1)+")").attr("selected",false);

		var vals = JSON.parse(Cookies.get('tk7moves'));
		selectedCharacter = vals.selected_char;
		lang = vals.lang;
		langIndex = vals.lang_index;
		jap = vals.jap;
		buttonLayoutChoice = vals.bl_choice;

		d3.select("#platf-select > option:nth-child("+(buttonLayoutChoice+1)+")").attr("selected",true);
		d3.select("#lang-select > option:nth-child("+(langIndex+1)+")").attr("selected",true);
	} else {
		setCookie();
	}
}

function setCookie() {
	Cookies.set('tk7moves', JSON.stringify({
		selected_char: selectedCharacter,
		lang: lang,
		lang_index: langIndex,
		jap: jap,
		bl_choice: buttonLayoutChoice
	}), { expires: 30, path: '' });
}

function isLetter(char) {
	return char.toLowerCase() != char.toUpperCase();
}

String.prototype.hexEncode = function() {
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result;
}

String.prototype.hexDecode = function() {
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function toHexArr(str) {
	var result = [];
	for (var i=0; i<str.length; i++) {
	  result.push("\\u"+str.charCodeAt(i).toString(16));
	}
	return result;
}

function setLang(val){
	lang = parseInt(val);

	if(lang === 0)
		jap = true;
	else jap = false;

	d3.select("#lang-select").selectAll("option").each(function(){
		if(parseInt(this.value) === lang){
			langIndex = this.index;
		}
	});
	setCookie();
	fetchmovelist(selectedCharacter);
}

function selectChar(index){
	//remove other moves
	d3.select(".move-table").remove();
	d3.select(".char-movelist .inner-table").html("<table class=\"move-table\"></table>");
	//de-select card
	var id_string = characterData[selectedCharacter].c.split(" ");
	d3.select("#"+id_string[0]).classed("selected", false);
	selectedCharacter = index;
	id_string = characterData[selectedCharacter].c.split(" ");
	d3.select("#"+id_string[0]).classed("selected", true);
	d3.select("#selected-title").text(characterData[selectedCharacter].n);
	setCookie();

	if(charMenuDialog) toggleCharMenu();
}

var togglePreferences = function() {
	if (prefDialog) {
		d3.select("#preferences").style('visibility', 'hidden');
	} else {
		d3.select("#preferences").style('visibility', 'visible');
	}

	prefDialog = !prefDialog;
};

var toggleCharMenu = function() {
	if (charMenuDialog) {
		d3.select("#charmenu").style('display', 'none');
	} else {
		d3.select("#charmenu").style('display', 'initial');
	}

	charMenuDialog = !charMenuDialog;
};

var changePlatform = function(index) {
	buttonLayoutChoice = index;
	setCookie();
	fetchmovelist(selectedCharacter);
};

var importdata = function() {
	getCookie();

	loadJson("./assets/data/map_hits.json").then(function(data) {
		for(var h in data) {
			hitsMap[data[h].i] = data[h].h;
		}

		return loadJson("./assets/data/map_ctrls.json");
	}).then(function(data) {
		ctrlsMap = data;

		return loadJson("./assets/data/map_chars.json");
	}).then(function(data) {
		for (let h in data) {
			characterData[data[h].i] = {c: data[h].c, n: data[h].n};
		}

		for (let i = 0; i < data.length; i++) {
			let tname = data[i].c_index.split(" ");

			if(data[i].i == "11") {
				tname = data[i].c.split("-");
			}

			d3.select(".char-menu > .inner-table > table").append("tr")
				.html("<td class=\"char-card\" id=\""+data[i].c.split(" ")[0]+"\"><img src=\"./assets/chars/"+tname.join("").toLowerCase()+"_thumbnail.png\"><p>"+data[i].c+"</p></td>");
			d3.select("#"+data[i].c.split(" ")[0]).on("click", function() {
				fetchmovelist(data[i].i);
			});
		}
		let id_string = characterData[selectedCharacter].c.split(" ");
		d3.select("#"+id_string[0]).classed("selected", true);
		d3.select("#selected-title").text(characterData[selectedCharacter].n);

		fetchmovelist(selectedCharacter);
	});
};

var fetchmovelist = function fetchmovelist(selectedCharacterIndex) {
	d3.json("./assets/data/movelists/MOVELIST_"+selectedCharacterIndex+".json", function(err, data) {
		selectChar(selectedCharacterIndex);

		let mov_count = 0;
		for (let i = 0; i < data.moves.length; i++) {
			let move = data.moves[i];

			// Number + Move Name
			// Special
			if (!move.number > 0) {
				let html_string = "<td class=\"move-card\"><div class=\"move-info\"><div class=\"move-number\">&#9733;</div>"+
					"<div class=\"move-title\"><div class=\"move-name\" style=\"margin-bottom:5px;\">"+ move.name[jap?0:1] + "</div>"+
					"</div></div></td>";
				d3.select(".move-table").append("tr").html(html_string);
				continue;
			}
			mov_count++;
			var html_string = "<td class=\"move-card\"><div class=\"move-info\"><div class=\"move-number\">" + move.number + "</div>" +
			"<div class=\"move-title\"><div class=\"move-name\">"+ move.name[jap ? 0 : 1] + "</div>"+
			"<div class=\"move-hitamount\">"+ move.ds.length + (move.ds.length > 1 ? " Hits" : " Hit") + "</div></div>";

			html_string += renderMoveString(move);

			html_string += renderMoveHitDamage(selectedCharacterIndex, move);

			// Move Damage
			html_string += "<div class=\"move-dmg\"><p class=\"mv-frames\">" + move.d + "</p><p class=\"mv-id\">Damage</p><div class=\"move-hitdmg-section\"><i id=\"dmgmove" + move.number + "\" class=\"fa fa-plus-square\" aria-hidden=\"true\"></i><div class=\"move-hitdmg\">";

			for (let d = 0; d < move.ds.length; d++) {
				html_string += move.ds[d].d;
				if (d + 1 < move.ds.length) {
					html_string += "+";
				}
			}
			html_string += "</div></div></div></div></div>";

			// extra section
			html_string += "<div class=\"move-extra\"><div class=\"mv-section\"><div class=\"move-special\">";

			// special effects/move properties
			/** @todo extract this logic into functions (e.g. hasSpin(move) */
			if (move.b9) {
				html_string += "<p class=\"spin\">SPIN</p>";
			}

			if (move.b8) {
				html_string += "<p class=\"armor\">ARMOR</p>";
			}

			if (move.bB) {
				html_string += "<p class=\"track\">TRACK</p>";
			}

			html_string +="</div>";

			// Move Frames
			// Start F
			html_string += "<table class=\"move-frames\">"+
				"<tr class=\"move-startf\"><td class=\"mv-id\">Start</td><td class=\"mv-frames\">"+
				move.s + "F</td></tr>";
			//Start Frames Segmented
			if (move.s > 0 ) {
				html_string += "<tr class=\"move-startf-seg\"><td>" + move.s + "F = ";

				for(var sfs = 1; sfs < move.ss.length; sfs++) {
					html_string += move.ss[sfs].s;

					if (sfs + 1 < move.ss.length) {
						html_string += "+";
					}
				}

				html_string +="</td></tr>";
			}

			// Block Frame
			html_string += "<tr class=\"move-blockf\"><td class=\"mv-id\">Block</td><td class=\"mv-frames " + (move.blk > -1 ? "blkpositive\">+" : move.blk < -10 ? "blknegative\">" : "blkmild\">" ) + move.blk + "</td></tr>";
			// Hit Adv Frame
			html_string += "<tr class=\"move-hitf\"><td class=\"mv-id\">Hit</td>"+"<td class=\"mv-frames\">"
				+ (move.adv > 0 ? "+" + move.adv : move.adv ) + "</td></tr></table>";
			html_string += "</div>";
			// ----- mv section

			html_string += "</div></td>";

			d3.select(".move-table").append("tr").html(html_string);
		}

		// Hit damage
		/** @note this isn't visible on mobile width */
		for (let moveid = 1; moveid <= mov_count; moveid++) {
			d3.select("#dmgmove" + moveid).on("mouseenter", function() {
				d3.select("i#"+this.id+" + div.move-hitdmg").style('display', 'initial');
			});
			d3.select("#dmgmove" + moveid).on("mouseleave", function() {
				setTimeout(() => {
					d3.select("i#"+ this.id + " + div.move-hitdmg").style('display', 'none');
				}, 3000);
			});
		}

		// Scroll the list to the top
		document.querySelector("#movelist_tab > table ").firstElementChild.scrollIntoView(true);
	});
};

function renderMoveString(move) {
	let html_string = "<div class=\"move-string\">";
	let commands = move.command[lang].split(" ");

	for (let c = 0; c < commands.length; c++) {
		let command = commands[c];
		if (/[a-z]/.test(command.toLowerCase())) {
			html_string += "<p class=\"move-hint\">"+ command + "</p>";
		} else {
			for (let m = 0; m < command.length; m++) {
				try {
					/** @todo extract this logic out */
					if (isLetter(ctrlsMap[command.charAt(m)])) {
						if (
							ctrlsMap[command.charAt(m)] === ctrlsMap[command.charAt(m)].toLowerCase() ||
							ctrlsMap[command.charAt(m)] === "N"
						) {
							html_string += "<img class=\"move-arrow\" src=\"./assets/arrow/"+ctrlsMap[command.charAt(m)].toLowerCase() + ".svg\">";
						} else {
							html_string += "<img class=\"move-arrow\" src=\"./assets/arrow/"+ctrlsMap[command.charAt(m)].toLowerCase() + "p"+".svg\">";
						}
					} else if (!isNaN(ctrlsMap[command.charAt(m)].charAt(0))) {
						html_string += "<img class=\"move-button\" src=\"./assets/button/"+buttonLayouts[buttonLayoutChoice]+"/"+ctrlsMap[command.charAt(m)]+".svg\">";
					} else if (ctrlsMap[command.charAt(m)] === ">") {
						html_string += "<p class=\"move-hint\" style=\"color:#37ff05;font-size:20px;\"><i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i></p>";
					} else {
						 console.log("1. Not added: " + command.charAt(m));
						 console.log("2. Not added map: " + ctrlsMap[command.charAt(m)]);
					}
				} catch (exception) {
					if (command.charAt(m) === "(" || command.charAt(m) === ")") {
						html_string += "<p class=\"move-hint\">"+command.charAt(m)+"</p>";
					} else {
						html_string += "<p class=\"move-hint\">"+command.charAt(m)+"</p>";
					}
				}
			}
		}
	}

	html_string += "</div>";

	return html_string;
}

function renderMoveHitDamage(selectedCharacterIndex, move) {
	let html_string = "<div class=\"move-hit-dmg\"><div class=\"move-hitlvlstring\">";

	for (let h = 0; h < move.at.length;h++) {
		try {
			html_string += "<p class=\"mv-hitlvl hit"+hitsMap[move.at[h].l].toLowerCase()+"\">"
			+ hitsMap[move.at[h].l] + "" + (move.at[h].t > 0 ? " Throw" : "" ) + "</p>";
		} catch(exception) {
			console.log(move.at[h].l);
			console.log(hitsMap[move.at[h].l]);
			console.log("Fighter: " + selectedCharacterIndex);
			console.log(move.number);
			throw exception;
		}

		if (h + 1 < move.at.length) {
			html_string += "<i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i>";
		}
	}

	html_string += renderThrowBreaks(move);

	html_string += "</div>";

	return html_string;
}

function renderThrowBreaks(move) {
	let html_string = '';

	if (move.br.length > 0) {
		let breakt = "";
		/** @todo extract the magic numbers into constants? */
		switch (move.br[0].b) {
	        case 1:
	            breakt = "1";
	            break;
	        case 2:
	            breakt = "2";
	            break;
	        case 3:
	            breakt = "1/2";
	            break;
	        case 4:
	            breakt = "1+2";
	            break;
	        default:
	            breakt = "";
	            break;
	    }
		html_string += "<i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i>";
		html_string += "<p class=\"mv-hitlvl\">" + move.br[0].f + "F BREAK " + breakt + "</p>";
	}

	return html_string;
}

function loadMoveList() {

}

/**
 * Promise wrapper around d3.json
 * @param string path
 * @return Promise
 */
function loadJson(path) {
	return new Promise(function(resolve, reject) {
		d3.json(path, function(error, response) {
			if (error) {
				reject(error);
			}

			resolve(response);
		});
	});
}

exports.importdata = importdata;
exports.toggleCharMenu = toggleCharMenu;
exports.togglePreferences = togglePreferences

})(window);