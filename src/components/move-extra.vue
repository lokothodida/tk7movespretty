<template>
    <div class="move-extra">
        <div class="mv-section">
            <div class="move-special">
                <p v-if="move.hasSpin()" class="spin">SPIN</p>
                <p v-if="move.hasArmor()" class="armor">ARMOR</p>
                <p v-if="move.hasTracking()" class="track">TRACK</p>
            </div>
            <table class="move-frames">
                <tr class="move-startf">
                    <td class="mv-id">Start</td>
                    <td class="mv-frames">
                        {{move.getStartUpFrames()}}F
                    </td>
                </tr>

                <tr v-if="move.getStartUpFrames() > 0" class="move-startf-seg">
                    <td>
                        {{ move.getStartUpFrames() }}F = {{ move.getSegmentedStartFrames().join("+") }}
                    </td>
                </tr>

                <tr class="move-blockf">
                    <td class="mv-id">Block</td>
                    <td :class="getBlockFrameCssClasses(move)">
                        {{ (move.getBlockFrames() > -1 ? "+" : "" ) + move.getBlockFrames() }}
                    </td>
                </tr>
                <tr class="move-hitf">
                    <td class="mv-id">Hit</td>
                    <td class="mv-frames">
                        {{ (move.getAdvantageFrames() > 0 ? "+" : "") + move.getAdvantageFrames() }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style lang="scss">
.move-extra {
    height: 100%;
    display: table;
}

.mv-section {
    display: flex;
    flex-direction: row;
    max-width: 185px;
    align-items: center;
}

.move-special {
    max-width: 100px;

    @media only screen and (max-width: 800px) {
        max-width: 50px;
    }
}

.move-special p {
    margin: 0;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: bold;
    text-shadow: 0px 0px 5px #000000;
    font-size: 18px;
    margin-left: 5px;

    @media only screen and (max-width: 800px) {
        font-size: 10px;
        margin-left: 1px;
        text-shadow: 0px 0px 2px #000000;
    }
}

p.spin {
    color:  #1a8000;
}

p.armor {
    color:  #cb0000;
}

p.track {
    color:  #0079ff;
}

.move-frames > div > p {
    margin: 0;
}

.move-frames {
    width: 100px;
    margin-left: 5px;
    margin-right: 5px;

    @media only screen and (max-width: 800px) {
        width: 75px;
        margin-left: 1px;
        margin-right: 1px;
        font-size: 12px;
    }
}

.move-frames .mv-id {
    text-transform: uppercase;
    width: 60px;
    text-align: left;
    font-weight: bold;
}

.move-frames .mv-frames {
    width: 30px;
    text-align: right;
}

.move-frames .blknegative {
    color:  #ff0000;
}

.move-frames .blkpositive {
    color:  #00ff00;
}

.move-frames .blkmild {
    color:  #ffff00;
}

.move-startf-seg td {
    background: linear-gradient(hsla(193, 77%, 20%, 0), hsla(193, 77%, 20%, 0.75));
    border-radius: 5px;
    font-size: 1.3vmin;

    @media only screen and (max-width: 800px) {
        font-size: 10px;
    }
}
</style>

<script>
export default {
    props: ['move'],

    methods: {
        getBlockFrameCssClasses(move) {
            let classes = ['mv-frames'];

            if (move.getBlockFrames() > -1) {
                classes.push('blkpositive');
            } else if (move.getBlockFrames() < -10 ) {
                classes.push('blknegative');
            } else {
                classes.push('blkmild');
            }

            return classes.join(' ');
        }
    }
};
</script>