import * as d3 from 'd3';
import * as utils from './utils.js';

export function renderMoveList(characterIndex, moves, hitsMap, jap, lang, ctrlsMap, buttonLayout) {
	let totalMoves = 0;

	for (let i = 0; i < moves.length; i++) {
		let move          = moves[i];
		let isSpecialMove = !move.number > 0;
		let tableRow      = d3.select(".move-table").append("tr");

		if (isSpecialMove) {
			tableRow.html(renderSpecialMoveCard(move, jap));
		} else {
			totalMoves++;
			tableRow.html(renderMoveCard(characterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout));
		}
	}

	// Hit damage
	showHitDamageVisibilityOnMouseEnter(totalMoves);

	// Scroll the list to the top
	let table = document.querySelector("#movelist_tab > table");
	let firstElementChild = table.firstElementChild;

	if (firstElementChild) {
		firstElementChild.scrollIntoView(true);
	}
}

export function renderSpecialMoveCard(move, jap) {
	let html_string = "<td class=\"move-card\"><div class=\"move-info\"><div class=\"move-number\">&#9733;</div>"+
					  "<div class=\"move-title\"><div class=\"move-name\" style=\"margin-bottom:5px;\">"+ move.name[jap ? 0 : 1] + "</div>"+
					  "</div></div></td>";
	return html_string;
}


// pure
export function renderMoveCard(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout) {
	let html_string = "<td class=\"move-card\">";

	html_string += renderMoveInfo(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout);

	html_string += renderMoveExtra(move);

	html_string += "</td>";

	return html_string;
}


// pure
export function renderMoveInfo(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout) {
	let html_string = "<div class=\"move-info\">";

	html_string += "<div class=\"move-number\">" + move.number + "</div>" +
				   "<div class=\"move-title\"><div class=\"move-name\">"+ move.name[jap ? 0 : 1] + "</div>"+
				   "<div class=\"move-hitamount\">"+ move.ds.length + (move.ds.length > 1 ? " Hits" : " Hit") + "</div></div>";

	html_string += renderMoveString(move, lang, ctrlsMap, buttonLayout);
	html_string += renderMoveHitDamage(selectedCharacterIndex, move, hitsMap);
	html_string += "</div>";

	return html_string;
}

export function renderMoveString(move, lang, ctrlsMap, buttonLayout) {
	let html_string = "<div class=\"move-string\">";
	let commands    = move.command[lang].split(" ");

	for (let c = 0; c < commands.length; c++) {
		let command = commands[c];

		if (/[a-z]/.test(command.toLowerCase())) {
			html_string += "<p class=\"move-hint\">"+ command + "</p>";
		} else {
			for (let m = 0; m < command.length; m++) {
				try {
					/** @todo extract this logic out */
					if (utils.isLetter(ctrlsMap[command.charAt(m)])) {
						if (
							ctrlsMap[command.charAt(m)] === ctrlsMap[command.charAt(m)].toLowerCase() ||
							ctrlsMap[command.charAt(m)] === "N"
						) {
							html_string += "<img class=\"move-arrow\" src=\"./assets/arrow/"+ctrlsMap[command.charAt(m)].toLowerCase() + ".svg\">";
						} else {
							html_string += "<img class=\"move-arrow\" src=\"./assets/arrow/"+ctrlsMap[command.charAt(m)].toLowerCase() + "p"+".svg\">";
						}
					} else if (!isNaN(ctrlsMap[command.charAt(m)].charAt(0))) {
						html_string += "<img class=\"move-button\" src=\"./assets/button/"+ buttonLayout +"/"+ctrlsMap[command.charAt(m)]+".svg\">";
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

/**
 * @param selectedCharacterIndex
 * @param move
 * @param hitsMap
 * @return string
 */
export function renderMoveHitDamage(selectedCharacterIndex, move, hitsMap) {
	let html_string = "<div class=\"move-hit-dmg\"><div class=\"move-hitlvlstring\">";

	for (let h = 0; h < move.at.length; h++) {
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

	html_string += "</div>"; // move-hitlvlstring

	html_string += renderMoveDamage(move);

	html_string += "</div>";

	return html_string;
}

export function renderMoveDamage(move) {
	let html_string = "<div class=\"move-dmg\"><p class=\"mv-frames\">" + move.d + "</p><p class=\"mv-id\">Damage</p><div class=\"move-hitdmg-section\"><i id=\"dmgmove" + move.number + "\" class=\"fa fa-plus-square\" aria-hidden=\"true\"></i><div class=\"move-hitdmg\">";

	for (let d = 0; d < move.ds.length; d++) {
		html_string += move.ds[d].d;
		if (d + 1 < move.ds.length) {
			html_string += "+";
		}
	}

	html_string += "</div></div></div>";

	return html_string;
}

export function renderThrowBreaks(move) {
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

export function renderMoveFrames(move) {
	// Start F
	let html_string = "<table class=\"move-frames\">"+
		"<tr class=\"move-startf\"><td class=\"mv-id\">Start</td><td class=\"mv-frames\">"+
		move.s + "F</td></tr>";
	//Start Frames Segmented
	if (move.s > 0) {
		html_string += "<tr class=\"move-startf-seg\"><td>" + move.s + "F = ";

		for (var sfs = 1; sfs < move.ss.length; sfs++) {
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

	return html_string;
}

export function renderMoveExtra(move) {
	let html_string = "<div class=\"move-extra\"><div class=\"mv-section\"><div class=\"move-special\">";

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
	html_string += renderMoveFrames(move);
	html_string += "</div>";
	html_string += "</div>";

	return html_string;
}

/**
 * @param int totalMoves
 */
export function showHitDamageVisibilityOnMouseEnter(totalMoves) {
	/** @note this isn't visible on mobile width */
	for (let moveid = 1; moveid <= totalMoves; moveid++) {
		d3.select("#dmgmove" + moveid).on("mouseenter", function() {
			d3.select("i#"+this.id+" + div.move-hitdmg").style('display', 'initial');
		});
		d3.select("#dmgmove" + moveid).on("mouseleave", function() {
			setTimeout(() => {
				d3.select("i#"+ this.id + " + div.move-hitdmg").style('display', 'none');
			}, 3000);
		});
	}
}
