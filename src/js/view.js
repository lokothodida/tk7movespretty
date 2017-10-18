export function renderCharacterList(characters, selectedCharacter) {
    let characterListTable = document.querySelector(".char-menu > .inner-table > table");

    function renderCharacterCard(character) {
        let selected = character.getId() === selectedCharacter ? 'selected' : '';

        return `
        <tr>
            <td class="char-card ${selected}" id="${character.getSlug()}" onclick="fetchMoveList('${character.getId()}')">
                <img src="./assets/chars/${character.getThumbnailName()}_thumbnail.png">
                <p>${character.getName()}</p>
            </td>
        </tr>
        `;
    }

    characterListTable.innerHTML = characters.map(renderCharacterCard).join("");
}

export function renderSelectedCharacterName(characterName) {
    let characterTitle = document.querySelector('#selected-title');
    characterTitle.innerHTML = characterName;
}

export function renderMoveList(moves, buttonLayout) {
    let totalMoves = 0;
    let moveTable  = document.querySelector('.move-table');

    moveTable.innerHTML = moves.map((move) => {
        let isSpecialMove = !move.getNumber() > 0;

        if (isSpecialMove) {
            return renderSpecialMoveCard(move);
        } else {
            totalMoves++;
            return renderMoveCard(move, buttonLayout);
        }
    }).join('');

    // Scroll the list to the top
    let table = document.querySelector('#movelist_tab > table');
    let firstElementChild = table.firstElementChild;

    if (firstElementChild) {
        firstElementChild.scrollIntoView(true);
    }
}

function renderSpecialMoveCard(move, jap) {
    return `
    <tr>
        <td class="move-card">
            <div class="move-info">
                <div class="move-number">&#9733;</div>
                <div class="move-title">
                    <div class="move-name" style="margin-bottom:5px;">
                        ${move.getName()}
                    </div>
                </div>
            </div>
        </td>
    </tr>
    `;
}

function renderMoveCard(move, buttonLayout) {
    return `
    <tr>
        <td class="move-card">
            ${renderMoveInfo(move, buttonLayout)}
            ${renderMoveExtra(move)}
        </td>
    </tr>
    `;
}

function renderMoveInfo(move, buttonLayout) {
    return `
    <div class="move-info">
        <div class="move-number">${move.getNumber()}</div>
        <div class="move-title">
            <div class="move-name">${move.getName()}</div>
            <div class="move-hitamount">
                ${move.getTotalHits()} ${move.getHits().length ? " Hits" : " Hit"}
            </div>
        </div>
        ${renderMoveString(move, buttonLayout)}
        ${renderMoveHitDamage(move)}
    </div>
    `;
}

function renderMoveString(move, buttonLayout) {
    return `
    <div class="move-string">
        ${move.getCommands().map((command) => {
            if (command.hasLetter()) {
                return renderMoveHint(command.getSymbol() || "");
            } else {
                return renderMoveCommand(command, buttonLayout);
            }
        }).join("")}
    </div>
    `;
}

function renderMoveHint(hint) {
    return `<p class="move-hint">${hint}</p>`;
}

function renderMoveCommand(command, buttonLayout) {
    return command.getInputs().map((input) => {
        if (input.isMovement() || input.isNeutral()) {
            return `<img class="move-arrow" src="./assets/arrow/${input.getSymbol().toLowerCase()}.svg">`;
        } else if (input.isMovement() && input.isHeld()) {
            return `<img class="move-arrow" src="./assets/arrow/${input.getSymbol().toLowerCase()}p.svg">`;
        } else if (input.isAttack()) {
            return `<img class="move-button" src="./assets/button/${buttonLayout}/${input.getSymbol()}.svg">`;
        } else if (input.getSymbol() === ">") {
            return `
            <p class="move-hint" style="color:#37ff05;font-size:20px;">
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </p>`;
        } else {
            return renderMoveHint(input.getSymbol());
        }
    }).join("");
}

/**
 * @param selectedCharacterIndex
 * @param move
 * @param hitsMap
 * @return string
 */
function renderMoveHitDamage(move) {
    return `
    <div class="move-hit-dmg">
        <div class="move-hitlvlstring">
            ${renderMoveHitLevels(move)}
            ${move.hasThrow() ? renderThrowBreaks(move) : ``}
        </div>
        ${renderMoveDamage(move)}
    </div>
    `;
}

function renderMoveHitLevels(move) {
    return move.getHits()
        .map((hit) => renderMoveHitLevel(hit.getLevel(), (hit.isThrow() ? "Throw" : "")))
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
        <p class="mv-frames">${move.getTotalDamage()}</p>
        <p class="mv-id">Damage</p>
        <div class="move-hitdmg-section">
            <i id="dmgmove${move.getNumber()}" class="fa fa-plus-square" aria-hidden="true" onmouseenter="showHitDamage('${move.getNumber()}')" onmouseleave="hideHitDamage('${move.getNumber()}')"></i>
            <div class="move-hitdmg">
                ${move.getDamages().join("+")}
            </div>
        </div>
    </div>
    `;
}

function renderThrowBreaks(move) {
    return `
    <i class="fa fa-caret-right" aria-hidden="true"></i>
    <p class="mv-hitlvl">
        ${move.getThrowBreakFrames()}F BREAK ${move.getThrowBreak()}
    </p>
    `
}

function renderMoveFrames(move) {
    return `
    <table class="move-frames">
        <tr class="move-startf">
            <td class="mv-id">Start</td>
            <td class="mv-frames">
                ${move.getStartUpFrames()}F
            </td>
        </tr>

        ${move.getStartUpFrames() > 0 ? renderStartFramesSegmented(move) : ""}

        <tr class="move-blockf">
            <td class="mv-id">Block</td>
            <td class="mv-frames ${move.getBlockFrames() > -1 ? "blkpositive" : move.getBlockFrames() < -10 ? "blknegative" : "blkmild"}">
                ${(move.getBlockFrames() > -1 ? "+" : "" ) + move.getBlockFrames()}
            </td>
        </tr>
        <tr class="move-hitf">
            <td class="mv-id">Hit</td>
            <td class="mv-frames">
                ${(move.getAdvantageFrames() > 0 ? "+" : "") + move.getAdvantageFrames()}
            </td>
        </tr>
    </table>
    `;
}

function renderStartFramesSegmented(move) {
    return `
    <tr class="move-startf-seg">
        <td>
            ${move.getStartUpFrames()}F = ${move.getSegmentedStartFrames().join("+")}
        </td>
    </tr>`;
}

function renderMoveExtra(move) {
    return `
    <div class="move-extra">
        <div class="mv-section">
            <div class="move-special">
                ${ move.hasSpin() ? `<p class="spin">SPIN</p>` : `` }
                ${ move.hasArmor() ? `<p class="armor">ARMOR</p>` : `` }
                ${ move.hasTracking() ? `<p class="track">TRACK</p>` : `` }
            </div>
            ${renderMoveFrames(move)}
        </div>
    </div>
    `;
}

