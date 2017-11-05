<template>
    <div class="header disable-select">
        <img :src="logoUrl" v-on:click="goToIndex()">
        <h3 class="glow">MOVELIST</h3>
    </div>
</template>

<style lang="scss">
.header {
    display: flex;
    align-content: center;
    align-items: center;
    padding: 15px;
    flex-direction: row;
    max-width: 100%;
    max-height: 100px;
    top: 0;
    left: 0;
    justify-content: flex-start;

    > img {
        margin: 0;
        max-width: 300px;
        min-width: 150px;
        height: auto;
        flex-grow: 1.2;
        flex-basis: 0;
    }

    > h3 {
        margin: 0;
        color: #ffffff;
        font-family: "Trump", Arial, sans-serif;
        font-size: 50px;
        margin-top: 5px;
        font-style: italic;
        margin-left: -15px;
        align-self: flex-start;
        flex-grow: 0.8;
        flex-basis: 0;
    }
}

@media only screen and (max-width: 801px) {
    .header {
        padding: 0;
    }

    .header > h3 {
        font-size: 45px;
        margin-top: 8px;
    }
}
</style>

<script>
export default {
    data() {
        return {
            logoUrl: './assets/img/logo.png',
        }
    },
    methods: {
        goToIndex() {
            this.$router.push({ name: 'index' });
        }
    }
};
</script>