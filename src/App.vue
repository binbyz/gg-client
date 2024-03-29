<template>
  <div class="h-full flex flex-row relative" :class="{ dark: isDarkMode }">
    <SideNavigation
      :selectedContainer="currentContainer"
      :notice-count="noticeCount"
      @selectContainer="handleSelectContainer"
      @toggleDarkMode="toggleDarkMode"
    ></SideNavigation>

    <ScrollableView
      ref="logContainer"
      v-show="currentContainer === 'logContainer'"
      :data="mediator.logContainer"
    ></ScrollableView>

    <ScrollableView
      ref="throwableContainer"
      v-show="currentContainer === 'throwableContainer'"
      :data="mediator.throwableContainer"
    ></ScrollableView>

    <ScrollableView
      ref="shiftContainer"
      :is-local-data="true"
      :current-container="currentContainer"
      v-show="currentContainer === 'shiftContainer'"
    >
    </ScrollableView>

    <ScrollableView
      ref="httpContainer"
      v-show="currentContainer === 'httpContainer'"
      :data="mediator.httpContainer"
    ></ScrollableView>

    <ScrollableView
      ref="sqlContainer"
      v-show="currentContainer === 'sqlContainer'"
      :data="mediator.sqlContainer"
    ></ScrollableView>

    <NewVersion :meta="meta"></NewVersion>
  </div>
</template>

<script>
import SideNavigation from '@/components/SideNavigation.vue';
import ScrollableView from '@/components/ScrollableView.vue';
import NewVersion from '@/components/fragments/NewVersion.vue';
import http from '@/utilities/http';

import { ipcRenderer } from 'electron';
import { inject, reactive, ref } from 'vue';

export default {
  name: 'App',
  components: {
    SideNavigation,
    ScrollableView,
    NewVersion,
  },
  setup() {
    const logMediator = reactive({});
    const mediator = reactive({
      logContainer: [],
      throwableContainer: [],
      httpContainer: [],
      sqlContainer: [],
    });
    const currentContainer = ref('logContainer');
    const noticeCount = reactive({
      logContainer: 0,
      throwableContainer: 0,
      httpContainer: 0,
      sqlContainer: 0,
    });

    const meta = inject('meta');

    const isDarkMode = inject('isDarkMode');

    const isDataListening = inject('isDataListening');

    return {
      logMediator,
      mediator,
      currentContainer, // logContainer or throwableContainer or shiftContainer
      noticeCount,
      meta,
      isDarkMode,
      isDataListening,
    };
  },
  watch: {
    currentContainer: function (selectContainer) {
      if (selectContainer === 'logContainer') {
        this.noticeCount.logContainer = 0;
      } else if (selectContainer === 'throwableContainer') {
        this.noticeCount.throwableContainer = 0;
      } else if (selectContainer === 'httpContainer') {
        this.noticeCount.httpContainer = 0;
      } else if (selectContainer === 'sqlContainer') {
        this.noticeCount.sqlContainer = 0;
      }
    },
  },
  methods: {
    handleSelectContainer(container) {
      this.currentContainer = container;
    },
    handleKeydown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        this.currentContainer = 'logContainer';
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        this.currentContainer = 'throwableContainer';
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        this.currentContainer = 'shiftContainer';
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '4') {
        this.currentContainer = 'httpContainer';
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '5') {
        this.currentContainer = 'sqlContainer';
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
        if (window.confirm('Do you want to erase all data?')) {
          this.$refs[this.currentContainer].clearLogs(this.currentContainer === 'shiftContainer');
        }
      }
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    getMeta() {
      http.get('/version').then((response) => {
        const { latestVersion, publicRepositoryUrl, releaseNotes } = response.data;
        const packageJson = require('../package.json');

        this.meta.latestVersion = latestVersion;
        this.meta.publicRepositoryUrl = publicRepositoryUrl;
        this.meta.releaseNotes = releaseNotes;
        this.meta.clientVersion = packageJson.version;

        this.setDocumentTitle(this.meta.clientVersion);
      });
    },
    setDocumentTitle(clientVersion) {
      document.title = `GG Client v${clientVersion}`;
    },
  },
  mounted() {
    this.getMeta();

    setInterval(this.getMeta, 1000 * 60 * 60);

    window.addEventListener('keydown', this.handleKeydown);

    ipcRenderer.on('is-native-dark-mode', (event, isNativeDarkMode) => {
      this.isDarkMode = isNativeDarkMode;
    });

    ipcRenderer.on('gg', (event, message) => {
      if (!this.isDataListening) {
        return;
      }

      const logItems = message.filter((item) => item.type.startsWith('log'));
      const throwableItems = message.filter((item) => item.type === 'throwable');
      const httpItems = message.filter((item) => item.type === 'http.request');
      const sqlItems = message.filter((item) => item.type === 'sql.model');

      if (throwableItems.length > 0) {
        this.mediator.throwableContainer = throwableItems;

        if (this.currentContainer !== 'throwableContainer') {
          this.noticeCount.throwableContainer += throwableItems.length;
        }
      }

      if (logItems.length > 0) {
        this.mediator.logContainer = logItems;

        if (this.currentContainer !== 'logContainer') {
          this.noticeCount.logContainer += logItems.length;
        }
      }

      if (httpItems.length > 0) {
        this.mediator.httpContainer = httpItems;

        if (this.currentContainer !== 'httpContainer') {
          this.noticeCount.httpContainer += httpItems.length;
        }
      }

      if (sqlItems.length > 0) {
        this.mediator.sqlContainer = sqlItems;

        if (this.currentContainer !== 'sqlContainer') {
          this.noticeCount.sqlContainer += sqlItems.length;
        }
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
};
</script>
