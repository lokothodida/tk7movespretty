import { isLetter } from './utils.js';

// impure
export function getMoveString(move, lang, ctrlsMap) {
    let moveString = "";
	let commands = move.command[lang].split(" ");

	for (let c = 0; c < commands.length; c++) {
		let command = commands[c];

		if (/[a-z]/.test(command.toLowerCase())) {
			//html_string += "<p class=\"move-hint\">"+ command + "</p>";
		} else {
			for (let m = 0; m < command.length; m++) {
				let input = "";
				try {
					if (isLetter(ctrlsMap[command.charAt(m)])) {
						if (
							ctrlsMap[command.charAt(m)] === ctrlsMap[command.charAt(m)].toLowerCase() ||
							ctrlsMap[command.charAt(m)] === "N"
						) {
							input = ctrlsMap[command.charAt(m)].toLowerCase();
						} else {
							input = ctrlsMap[command.charAt(m)].toLowerCase();
						}
					} else if (!isNaN(ctrlsMap[command.charAt(m)].charAt(0))) {
						input = ctrlsMap[command.charAt(m)];
					}
				} catch (exception) {
				}

				moveString += input;
			}
		}
	}

	return moveString;
}