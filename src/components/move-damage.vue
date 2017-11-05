<template>
    <div class="move-dmg">
        <p class="mv-frames">{{ move.getTotalDamage() }}</p>
        <p class="mv-id">Damage</p>
        <div class="move-hitdmg-section">
            <i :id="getCssId(move)" class="fa fa-plus-square" aria-hidden="true" v-on:mouseenter="showHitDamage" v-on:mouseleave="hideHitDamage()"></i>
            <div class="move-hitdmg" :style="{ display : visible ? 'initial' : 'none' }">
                {{ move.getDamages().join('+') }}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.move-dmg {
    margin-right: 5px;
    justify-content: flex-end;
    margin-top: 1px;

    @media only screen and (max-width: 800px) {
        margin: 0;
    }
}

.move-dmg p {
    margin: 0;
    margin-right: 2px;
    color: #dace00;
    text-shadow: 0px 0px 5px #000000;
    font-size: 16px;
    font-weight: bold;

    @media only screen and (max-width: 800px) {
        font-size: 12px;
    }
}

.move-dmg .fa-arrow-right {
    margin-left: 4px;
    margin-right: 4px;
}

.move-dmg::before {
    margin-left: 10px;
    margin-right: 10px;
    content: "\007C";
    align-self: baseline;
    font-weight: bold;
    color: hsl(193, 77%, 20%);
}

.move-hitdmg {
    background-color: rgba(0,0,0,0.75);
    border: 1px solid hsla(193, 77%, 20%, 0.75);
    padding: 0px 10px 0 10px;
    margin-left: 10px;
    border-radius: 4px;
    max-width: 100%;
    font-size: 1.5vmin;
    display: none;
}

.move-hitdmg-section {
    display: flex;
    flex-direction: initial;
    align-items: center;
    justify-content: flex-start;

    @media only screen and (max-width: 800px) {
        display: none;
    }
}
</style>

<script>
export default {
    props: ['move'],

    data() {
        return { visible: false };
    },

    methods: {
        getCssId(move) {
            return `dmgmove${move.getNumber()}`;
        },

        showHitDamage() {
            this.visible = true;
        },

        hideHitDamage() {
            setTimeout(() => this.visible = false, 3000);
        }
    }
}
</script>