import App from './App.svelte';

import {getInitialData} from './AppSharing/share-data';

const app = new App({
  target: document.body,
  props: {
    initialData: getInitialData(window.location.search)
  }
});

export default app;
