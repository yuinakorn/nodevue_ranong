<template>
<!--  <NavBar />-->
  <router-view/>
</template>

<script>
// @ is an alias to /src
// import NavBar from '@/components/NavBar'
import $ from 'jquery';

export default {
  name: 'Home',
  components: {
    // NavBar
  },
  methods: {
    getThaiDate(thd) {
      let ymd = new Date(thd);
      let year = ymd.getFullYear();
      let month = ymd.getMonth();
      let day = ymd.getDate();
      const date = new Date(year, month, day)
      const resultd = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        // month: '2-digit',
        day: '2-digit',
      });
      return resultd;
    }
  },
  mounted() {
    $(function() {
      $(this).bind("contextmenu", function(e) {
        e.preventDefault();
      });
    });
  }
}
</script>

<style>
:root {
  /*--main-color: #007672;*/
  --main-color: #026c6a;
  /*--border-color: #016460;*/
  --border-color: #20afaa;

  --color-1: #026c6a;
  /*--color-warning1: #fad565;*/
  --color-warning1: #ffc61b;
}
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  font-family: 'Kanit', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

* {
  font-family: 'Kanit', sans-serif !important;

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.list-group-item.active {
  background-color: var(--main-color) !important;
  border-color: var(--main-color) !important;
}

.btn-outline-primary {
  color: var(--main-color) !important;
  border-color: var(--border-color) !important;
}

.btn-outline-primary:hover {
  color: white !important;
  background-color: var(--main-color) !important;
  border-color: var(--border-color) !important;
}

.bg-primary-my {
  background-color: #08a188 !important;
  /*background-color: #03a1e6 !important;*/
  /*background-color: #6bd2ff !important;*/
}

.bg-danger-my {
  background-color: #DD4FB1 !important;
}

.bg-warning-my {
  background-color: var(--color-warning1) !important;
  color: black !important;
}

.bg-soft1 {
  background-color: var(--color-1) !important;
}

.bg-dang1 {
  background-color: #ffe6e6 !important;
  color: #e80505 !important;
}

.my-scroll-side {
  /*height: 82vh;*/
  overflow-y: scroll;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  /*scrollbar-width: none; !* for Firefox *!*/
}

.my-scroll-side::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

</style>
