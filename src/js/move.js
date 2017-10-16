import { isLetter } from './utils.js';

// impure
export function getMoveString(move, lang, ctrlsMap) {
    let moveString = "";
    let commands = move.command[lang].split(" ");

    for (let c = 0; c < commands.length; c++) {
        let command = commands[c];

        if (/[a-z]/.test(command.toLowerCase())) {
            moveString += "<p class=\"move-hint\">"+ command + "</p>";
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

export function getMoveThrowBreak(move) {
    switch (move.br[0].b) {
        case 1:
            return "1";
        case 2:
            return "2";
        case 3:
            return "1/2";
        case 4:
            return "1+2";
        default:
            return "";
    }
}

export function moveHasSpin(move) {
    return move.b9;
}

export function moveHasArmor(move) {
    return move.b8;
}

export function moveHasTracking(move) {
    return move.bB;
}