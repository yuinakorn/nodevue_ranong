import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* Set up using Vue 3 */
// import { createApp } from 'vue'
// import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faCamera,faSkullCrossbones)

createApp(App).use(router).use(VueSweetalert2).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
