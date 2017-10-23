<template>
    <div class="header disable-select">
        <img :src="logoUrl" v-on:click="goToIndex()">
        <h3 class="glow">MOVELIST</h3>
    </div>
</template>

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