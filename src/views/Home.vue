<template>
  <body>
    <div class="watermark">
      <!-- Watermark content goes here -->
      {{ this.username }} @ {{ this.hospitalName }}
    </div>
    <NavBar :visits="visits" @customEvent="parentMethod" />
    <div class="container-fluid pt-3" style="position: relative">
      <div class="row">
        <IsLoading v-if="loading" />
        <SideBar :visits="visits" />
        <Main :visits="visits" :toggles="toggle" />
      </div>
    </div>
  </body>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/Main.vue';
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import IsLoading from "@/components/Loading";

// import axios from "axios";
import io from 'socket.io-client';
// import $ from "jquery";

require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.VUE_APP_SECRET_KEY;
// import https from "https";

export default {
  name: 'Home',
  // async created() {
  //   const response = axios.get(process.env.API_ONEUSER_LOGIN, {
  //     headers: {
  //       'Authorization': 'Bearer ' + localStorage.getItem('token')
  //     }
  //   });
  //   console.log(response)
  // },

  components: {
    Main,
    SideBar,
    NavBar,
    IsLoading
  },
  data() {
    return {
      sendToggle: true,
      visits: null,
      loading: false,
      overlay: false,
      toggle: false,
      username: '',
      hospitalName: ''
    }
  },
  beforeCreate() {
    // check cookie if not redirect to login
    if (document.cookie.indexOf('username') > -1) {
      console.log("cookie => " + document.cookie);
    } else {
      this.$router.push("/login");
    }

  },
  methods: {
    parentMethod(myParam) {
      this.toggle = myParam;
    }
  },
  async mounted() {

    // watermark
    this.username = document.cookie.split(';').find(c => c.includes('username=')).split('=')[1];
    this.hospitalName = document.cookie.split(';').find(c => c.includes('hospitalName=')).split('=')[1];


    this.loading = true;
    const socket = io(process.env.VUE_APP_APIURL);
    await socket.on("connect", () => {

      const tokens = this.$route.params.token;
      let decode = '';
      try {
        decode = jwt.verify(tokens, secret);
        var patientCid = decode.patientCid;

        // console.log("Home_cid=>" + cids);
        // console.log("decoded => "+JSON.stringify(decode));
      } catch (err) {
        console.log("err => " + err);
      }

      // event get service
      let messages = '{"datatype": "service","data": {"CID":"' + patientCid + '","viewer_id": "' + socket.id + '","client_id":"","his_data":""}}';
      // console.log(messages);
      socket.emit('viewer', messages);
      socket.on('viewer', (message) => {
        try {
          this.visits = JSON.parse(message);
          // console.log('This Visits => ' + this.visits);
          console.log('This message => ' + message);
          this.loading = false
        } catch (error) {
          console.log(error);
        }
      });

    });
  }
}
</script>

<style scoped>
body {
  position: relative;
}

.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  z-index: 999;
  font-size: 1.8rem;
  opacity: 0.2;

}</style>
