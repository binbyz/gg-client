<template>
  <aside
    class="flex flex-col min-w-[50px] max-w-[50px] bg-gray-200 border-r-[1px] border-gray-300 py-5 px-1.5 items-center justify-center select-none dark:bg-gray-800 dark:border-black"
  >
    <div class="flex flex-col w-full space-y-5">
      <span
        class="flex items-center justify-center h-[35px] bg-slate-800 dark:bg-slate-900 rounded-md border-none dark:border dark:border-black"
      >
        <AnchorText href="https://phpgg.kr" class="no-underline">
          <span class="text-lg tracking-normal text-white dark:text-white">GG</span>
        </AnchorText>
      </span>

      <span class="relative inline-flex">
        <SideNavigationBalloon :notice-count="noticeCount.logContainer"></SideNavigationBalloon>

        <button
          class="--nav-button"
          :class="{ active: selectedContainer === 'logContainer' }"
          @click="emitSelectContainer('logContainer')"
        >
          <fa-icon icon="code" class="text-base"></fa-icon>
        </button>
      </span>

      <span class="relative inline-flex">
        <SideNavigationBalloon :notice-count="noticeCount.throwableContainer"></SideNavigationBalloon>

        <button
          class="--nav-button"
          :class="{ active: selectedContainer === 'throwableContainer' }"
          @click="emitSelectContainer('throwableContainer')"
        >
          <fa-icon icon="bug" class="text-base"></fa-icon>
        </button>
      </span>

      <span class="relative inline-flex">
        <button
          class="--nav-button"
          :class="{ active: selectedContainer === 'shiftContainer' }"
          @click="emitSelectContainer('shiftContainer')"
        >
          <fa-icon icon="floppy-disk" class="text-base"></fa-icon>
        </button>
      </span>

      <span class="relative inline-flex">
        <SideNavigationBalloon :notice-count="noticeCount.httpContainer"></SideNavigationBalloon>

        <button
          class="--nav-button"
          :class="{ active: selectedContainer === 'httpContainer' }"
          @click="emitSelectContainer('httpContainer')"
        >
          <fa-icon icon="network-wired" class="text-base"></fa-icon>
        </button>
      </span>

      <span class="relative inline-flex">
        <SideNavigationBalloon :notice-count="noticeCount.sqlContainer"></SideNavigationBalloon>

        <button
          class="--nav-button"
          :class="{ active: selectedContainer === 'sqlContainer' }"
          @click="emitSelectContainer('sqlContainer')"
        >
          <fa-icon icon="database" class="text-base"></fa-icon>
        </button>
      </span>
    </div>

    <div class="relative mt-auto flex flex-col space-y-2.5">
      <button class="--nav-button" @click="isDataListening = !isDataListening">
        <fa-icon :icon="isDataListening ? 'pause' : 'play'" class="text-base"></fa-icon>
      </button>

      <button
        @mouseover="showZoomLayer = true"
        @mouseleave="showZoomLayer = false"
        class="--nav-button hover:opacity-100"
        @click="handleZoomInOut(true)"
      >
        <fa-icon icon="magnifying-glass-plus" class="text-base"></fa-icon>
      </button>

      <button
        @mouseover="showZoomLayer = true"
        @mouseleave="showZoomLayer = false"
        class="--nav-button hover:opacity-100"
        @click="handleZoomInOut(false)"
      >
        <fa-icon icon="magnifying-glass-minus" class="text-base"></fa-icon>
      </button>

      <div
        v-if="showZoomLayer"
        class="absolute bottom-16 -right-[65px] inline-flex bg-gray-900 rounded-xl text-white font-bold items-center justify-center p-2.5 z-50 shadow-sm opacity-80"
      >
        <span>{{ (currentZoomFactor * 100).toFixed(0) }}%</span>
      </div>

      <div class="-divider"></div>

      <button @click="this.$emit('toggleDarkMode')" class="--nav-button !opacity-100">
        <fa-icon icon="sun" class="text-base"></fa-icon>
      </button>
    </div>
  </aside>
</template>

<script>
import SideNavigationBalloon from '@/components/SideNavigationBalloon.vue';
import AnchorText from '@/components/fragments/AnchorShell.vue';
import { webFrame } from 'electron';
import { inject, ref } from 'vue';

export default {
  name: 'SideNavigation',
  components: {
    AnchorText,
    SideNavigationBalloon,
  },
  props: {
    selectedContainer: {
      type: String,
      required: true,
    },
    noticeCount: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const currentZoomFactor = ref(1.1);
    const showZoomLayer = ref(false);

    const isDataListening = inject('isDataListening');

    return {
      currentZoomFactor,
      showZoomLayer,
      isDataListening,
    };
  },
  methods: {
    emitSelectContainer(container) {
      this.$emit('selectContainer', container);
    },
    handleZoomInOut(zoomIn = true) {
      let changeZoom = this.currentZoomFactor + (zoomIn ? 0.1 : -0.1);

      if (changeZoom > 1.5) {
        changeZoom = 1.5;
      } else if (changeZoom < 1) {
        changeZoom = 1;
      }

      this.currentZoomFactor = parseFloat(changeZoom.toFixed(1));

      webFrame.setZoomFactor(this.currentZoomFactor);
    },
  },
  mounted() {
    webFrame.setZoomFactor(this.currentZoomFactor);
  },
};
</script>

<style lang="scss">
.-divider {
  @apply border-b-[1px] border-gray-400 my-2 dark:border-gray-700;
}
</style>
