import App from './App.svelte';
import {mount} from 'svelte';

import {getInitialData} from './AppSharing/share-data';

const app = mount(App, {
  target: document.body,
  props: {
    initialData: getInitialData(window.location.search)
  }
});

export default app;
