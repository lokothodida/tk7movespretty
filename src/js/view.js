import * as d3 from 'd3';
import * as utils from './utils.js';
import * as Move from './move.js';

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

function renderSpecialMoveCard(move, jap) {
    return `
    <td class="move-card">
        <div class="move-info">
            <div class="move-number">&#9733;</div>
            <div class="move-title">
                <div class="move-name" style="margin-bottom:5px;">
                    ${move.name[jap ? 0 : 1]}
                </div>
            </div>
        </div>
    </td>
    `;
}

function renderMoveCard(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout) {
    return `
    <td class="move-card">
        ${renderMoveInfo(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout)}
        ${renderMoveExtra(move)}
    </td>
    `;
}

function renderMoveInfo(selectedCharacterIndex, move, hitsMap, jap, lang, ctrlsMap, buttonLayout) {
    return `
    <div class="move-info">
        <div class="move-number">${move.number}</div>
        <div class="move-title">
            <div class="move-name">${move.name[jap ? 0 : 1]}</div>
            <div class="move-hitamount">${move.ds.length + (move.ds.length > 1 ? " Hits" : " Hit")}</div>
        </div>
        ${renderMoveString(move, lang, ctrlsMap, buttonLayout)}
        ${renderMoveHitDamage(selectedCharacterIndex, move, hitsMap)}
    </div>
    `;
}

function renderMoveString(move, lang, ctrlsMap, buttonLayout) {
    return `
    <div class="move-string">
        ${move.command[lang].split(" ").map((command) => {
            if (/[a-z]/.test(command.toLowerCase())) {
                return renderMoveHint(command);
            } else {
                return renderMoveCommand(command, ctrlsMap, buttonLayout);
            }
        }).join("")}
    </div>
    `;
}

function renderMoveHint(hint) {
    return `<p class="move-hint">${hint}</p>`;
}

function renderMoveCommand(command, ctrlsMap, buttonLayout) {
    return command.split("").map((char) => {
        let input = ctrlsMap[char];

        if (Move.commandInputIsMovement(input) || Move.commandInputIsNeutral(input)) {
            return `<img class="move-arrow" src="./assets/arrow/${input.toLowerCase()}.svg">`;
        } else if (Move.commandInputIsMovement(input) && Move.commandInputIsHeld(input)) {
            return `<img class="move-arrow" src="./assets/arrow/${input.toLowerCase()}p.svg">`;
        } else if (Move.commandInputIsAttack(input)) {
            return `<img class="move-button" src="./assets/button/${buttonLayout}/${input}.svg">`;
        } else if (input === ">") {
            return `
            <p class="move-hint" style="color:#37ff05;font-size:20px;">
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </p>`;
        } else {
            return renderMoveHint(char);
        }
    }).join("");
}

/**
 * @param selectedCharacterIndex
 * @param move
 * @param hitsMap
 * @return string
 */
function renderMoveHitDamage(selectedCharacterIndex, move, hitsMap) {
    return `
    <div class="move-hit-dmg">
        <div class="move-hitlvlstring">
            ${renderMoveHitLevels(move, hitsMap)}
            ${move.br.length > 0 ? renderThrowBreaks(move) : ``}
        </div>
        ${renderMoveDamage(move)}
    </div>
    `;
}

function renderMoveHitLevels(move, hitsMap) {
    return move.at
        .map((hit) => renderMoveHitLevel(hitsMap[hit.l], (hit.t > 0 ? "Throw" : "")))
        .join(`<i class="fa fa-chevron-right" aria-hidden="true"></i>`);
}

function renderMoveHitLevel(hitLevel, hitType) {
    return `
    <p class="mv-hitlvl hit${hitLevel.toLowerCase()}">
        ${hitLevel} ${hitType}
    </p>
    `;
}

function renderMoveDamage(move) {
    return `
    <div class="move-dmg">
        <p class="mv-frames">${move.d}</p>
        <p class="mv-id">Damage</p>
        <div class="move-hitdmg-section">
            <i id="dmgmove${move.number}" class="fa fa-plus-square" aria-hidden="true"></i>
            <div class="move-hitdmg">
                ${move.ds.map(damage => damage.d).join("+")}
            </div>
        </div>
    </div>
    `;
}

function renderThrowBreaks(move) {
    return `
    <i class="fa fa-caret-right" aria-hidden="true"></i>
    <p class="mv-hitlvl">
        ${move.br[0].f}F BREAK ${Move.getMoveThrowBreak(move)}
    </p>
    `
}

function renderMoveFrames(move) {
    return `
    <table class="move-frames">
        <tr class="move-startf">
            <td class="mv-id">Start</td>
            <td class="mv-frames">
                ${move.s}F
            </td>
        </tr>

        ${move.s > 0 ? renderStartFramesSegmented(move) : ""}

        <tr class="move-blockf">
            <td class="mv-id">Block</td>
            <td class="mv-frames ${move.blk > -1 ? "blkpositive" : move.blk < -10 ? "blknegative" : "blkmild"}">
                ${(move.blk > -1 ? "+" : "" ) + move.blk}
            </td>
        </tr>
        <tr class="move-hitf">
            <td class="mv-id">Hit</td>
            <td class="mv-frames">
                ${(move.adv > 0 ? "+" : "") + move.adv}
            </td>
        </tr>
    </table>
    `;
}

function renderStartFramesSegmented(move) {
    return `
    <tr class="move-startf-seg">
        <td>
            ${move.s}F = ${move.ss.slice(1).map(sfs => sfs.s).join("+")}
        </td>
    </tr>`;
}

function renderMoveExtra(move) {
    return `
    <div class="move-extra">
        <div class="mv-section">
            <div class="move-special">
                ${ Move.moveHasSpin(move) ? `<p class="spin">SPIN</p>` : `` }
                ${ Move.moveHasArmor(move) ? `<p class="armor">ARMOR</p>` : `` }
                ${ Move.moveHasTracking(move) ? `<p class="track">TRACK</p>` : `` }
            </div>
            ${renderMoveFrames(move)}
        </div>
    </div>
    `;
}

/**
 * @param int totalMoves
 */
function showHitDamageVisibilityOnMouseEnter(totalMoves) {
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
