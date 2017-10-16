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

export class Move {
    constructor(moveData, language, isJapanese, controlsMap) {
        this._moveData = moveData;
        this._language = language;
        this._isJapanese = isJapanese;
        this._controlsMap = controlsMap;
    }

    getCommands() {
        return this._moveData.command[this._language].split(" ");
    }

    getString() {
        return getMoveString(this._moveData);
    }

    getThrowBreak() {
        switch (this._moveData.br[0].b) {
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

    hasSpin() {
        return this._moveData.b9;
    }

    hasArmor() {
        return this._moveData.b8;

    }

    hasTracking() {
        return this._moveData.bB;
    }
}

export function commandInputIsMovement(input) {
    return input && isLetter(input);
}

export function commandInputIsNeutral(input) {
    return input === "N";
}

export function commandInputIsHeld(input) {
    return input && input === input.toUpperCase();
}

export function commandInputIsAttack(input) {
    return input && !isNaN(input.charAt(0));
}

export class Command {
    constructor(command, controlsMap) {
        this._command = command;
        this._controlsMap = controlsMap;
        //ctrlsMap[command.charAt(m)]
    }

    isHeld() {

    }

    get() {

    }
}