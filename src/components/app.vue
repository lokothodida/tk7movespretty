<template>
    <div>
        <app-header></app-header>
        <app-body></app-body>
        <app-footer></app-footer>
        <preferences-dialog></preferences-dialog>
        <filters-dialog></filters-dialog>
        <video autoplay loop id="video-background" muted plays-inline>
            <source src="./assets/video/background-smoke.mp4" type="video/mp4">
        </video>
    </div>
</template>

<script>
import AppHeader from './../components/app-header.vue';
import AppBody from './../components/app-body.vue';
import AppFooter from './../components/app-footer.vue';
import PreferencesDialog from './../components/preferences-dialog.vue';
import FiltersDialog from './../components/filters-dialog.vue';

export default {
    components: {
        AppHeader,
        AppBody,
        AppFooter,
        PreferencesDialog,
        FiltersDialog,
    }
}
</script>