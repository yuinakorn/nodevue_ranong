<style>
.custom-title {
  font-size: 1.4rem !important;
}

.custom-icon {
  font-size: 0.7rem !important;
}
</style>
<template>
  <section>
    <div class="content d-flex justify-content-center align-items-center" style="height: 100vh">
      <div class="container">
        <div class="box d-flex justify-content-center">
          <div class="card my-card">
            <div class="card-body">
              <div class="row py-4">
                <div class="col-6 px-5">
                  <div class="text-center">
                    <div class="title">ลงชื่อใช้งานด้วย ThaID</div>
                  </div>
                  <!-- <div class="mt-3 text-center">สแกน QR Code ด้วยแอปพลิเคชั่น ThaID</div> -->
                  <div v-if="rememberHospital" class="mt-3 text-center">
                    <div class="alert alert-secondary rounded-4" role="alert">{{ hospitalHame }}
                      <span class="fs-bold setting" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">[⚙เปลี่ยน]</span>
                    </div>

                  </div>
                  <div v-else class="mt-3 text-center">โปรดเลือกหน่วยบริการที่สังกัด
                    <a href="#" class="setting ms-1" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      <span>[⚙เลือก]</span>
                    </a>
                  </div>
                  <div class="box-thaid d-flex justify-content-center mt-5">
                    <div v-if="rememberHospital" @click="openThaid()" class="image-container">
                      <img class="thaid-icon" src="../assets/thaid.webp">
                    </div>
                    <div v-else @click="alertSelectHos()" class="image-container">
                      <img class="thaid-icon" src="../assets/thaid.webp">
                    </div>
                  </div>
                  <div>
                    <div class="text-center" style="margin-top: 2.5rem !important;">คลิกเพื่อสแกน QR Code ด้วยแอปพลิเคชั่น
                      ThaID</div>
                    <div class="text-center mt-1">โปรดสแกนภายใน {{ countdown
                    }} วินาที</div>
                  </div>
                </div>
                <div class="col-6 px-5 box-right">
                  <div v-if="waiting" class="d-flex justify-content-center align-items-center pt-5">
                    <div class="text-center mt-5">
                      <div class="d-flex justify-content-center text-center">
                        <div class="spinner"></div>
                      </div>
                      <div class="mt-2">โปรดรอสักครู่...</div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-center">
                      <span class="title">ลงชื่อเข้าใช้งาน</span>
                    </div>
                    <div class="mt-3">โปรดเลือกหน่วยบริการที่สังกัด</div>
                    <div class="mt-3">
                      <form @submit.prevent="handleSubmit">
                        <div>
                          <v-select v-model="selectedHospital" :options="options"></v-select>
                        </div>

                        <div class="input-group mb-3 mt-3">
                          <span class="input-group-text" id="username"><font-awesome-icon icon="user-alt" /></span>
                          <input v-model="username" type="text" class="form-control" placeholder="Username"
                            aria-label="Username" required>
                        </div>
                        <div class="input-group mb-3 mt-3">
                          <span class="input-group-text" id="passwordd"><font-awesome-icon icon="lock" /></span>
                          <input v-model="password" type="password" class="form-control" placeholder="Password"
                            aria-label="Password" required>
                        </div>
                        <div v-if="loading">
                          <div class="text-center">
                            <div><img src="../assets/loading2.gif" height="30" alt=""></div>
                          </div>
                          <div class="text-center">
                            <button type="submit" class="btn btn-primary mt-3 w-100 disabled"
                              @click="handleSubmit">กำลังตรวจสอบ...</button>
                          </div>
                        </div>
                        <!-- v-else -->
                        <div v-else>
                          <div class="text-center">- <font-awesome-icon icon="lock" /> -</div>
                          <div class="text-center">
                            <button type="submit" class="btn btn-primary mt-3 w-100"
                              @click="handleSubmit">เข้าสู่ระบบ</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">เลือกหน่วยบริการที่สังกัด</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div>
              <v-select v-model="selectedHospital" :options="options"></v-select>
            </div>
          </div>
          <div class="modal-footer justify-content-between">
            <div>
              <!-- check box to remember it -->
              <input type="checkbox" id="remember" name="remember" value="remember" v-model="isChecked" disabled>
              <label class="ms-1" for="remember">จำค่าไว้ 14 วัน</label>
            </div>
            <div>
              <button @click="saveModal" type="button" class="btn btn-primary" data-bs-dismiss="modal">บันทึก</button>
              <button @click="clearAll" type="button" class="btn btn-secondary ms-2"
                data-bs-dismiss="modal">ยกเลิก</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
import qs from "qs";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import 'vue-select/dist/vue-select.css';

import vSelect from 'vue-select'

// axios.defaults.baseURL = process.env.VUE_APP_URL_AUTH;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // Adjust this based on your server's configuration


// Add the solid style icons to the library
library.add(fas);
require('dotenv').config();

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    FontAwesomeIcon,
    vSelect
  },
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      fullname: "",
      hcodeSelect: "",
      countdown: 20,
      options: [],
      selectedHospital: "",
      loading: false,
      waiting: true,
      hospitalHame: "",
      rememberHospital: false,
      isChecked: true,
      province: "",
      account_token: process.env.VUE_APP_ACCOUNT_TOKEN,
      serviceId: process.env.VUE_APP_SERVICE_ID,
      client_id_random: "",
      thaid_id: process.env.VUE_APP_THAID_ID,
    };
  },
  beforeCreate() {
    // delete cookie
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // document.cookie = "hcode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "position=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.removeItem('token');

  },
  computed: {
    filteredOptions() {
      return this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },
  mounted() {
    // Fetch options from the API
    this.fetchHcode();

    // check cookie hosname
    if (document.cookie.split(';').find(c => c.includes('hname='))) {
      this.hospitalHame = document.cookie.split(';').find(c => c.includes('hname=')).split('=')[1];
      this.rememberHospital = true;
    }

  },

  methods: {
    clearAll() {
      // delete cookie
      document.cookie = "hcode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "hname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "hospitalName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "provcode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      this.selectedHospital = "";
      this.rememberHospital = false;

    },
    async saveModal() {
      console.log("save modal");
      // create cookie and limit time 14 day
      const d = new Date();
      d.setTime(d.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 day
      let expires = "expires=" + d.toUTCString();
      document.cookie = "hcode=" + this.selectedHospital.value + ";" + expires + ";path=/;";
      document.cookie = "hname=" + this.selectedHospital.label + ";" + expires + ";path=/;";

      this.rememberHospital = true;
      this.hospitalHame = document.cookie.split(';').find(c => c.includes('hname=')).split('=')[1];

      // use axios to get province
      try {
        this.provcode = await this.getProvince(this.selectedHospital.value);
        document.cookie = "provcode=" + this.provcode + ";" + expires + ";path=/;";

      } catch (error) {
        console.log(error);
      }

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: this.selectedHospital.label,
        showConfirmButton: false,
        // font size
        customClass: {
          title: 'custom-title',
          icon: 'custom-icon',
        },
        timer: 1500
      })
    },
    // helper function
    async getProvince(hcode) {
      try {
        let url = process.env.VUE_APP_URL_AUTH + `/hoscode_all/`;
        console.log(url);
        const response = await axios.get(url);
        let data = response.data.filter(item => item.hoscode == hcode);
        return data[0].provcode;
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    },
    alertSelectHos() {
      Swal.fire({
        icon: 'error',
        title: 'ไม่ได้เลือกหน่วยบริการ',
        text: 'กรุณาเลือกหน่วยบริการให้ถูกต้อง',
      })
    },
    async openThaid() {
      console.log("open thaid");
      this.countDown(this.countdown);
      this.showToastAlert(this.countdown * 1000, "info", "กำลังเปิดหน้าต่างสแกน QR Code เพื่อตรวจสอบสิทธิ");

      // Step 0. make a logger client
      try {
        const response = await axios.get(`${process.env.VUE_APP_URL_AUTH}/client/`);
        // Set the received data to the component's data property
        this.data_client = response.data;
        console.log(this.data_client);
      } catch (error) {
        console.log(error);
      }

      // Step 1: Generate QR Code
      try {
        this.client_id_random = process.env.VUE_APP_SERVICE_NAME + '-' + Math.random().toString(36).substring(2, 10);
        this.hcode = document.cookie.split(';').find(c => c.includes('hcode=')).split('=')[1];
        this.provcode = document.cookie.split(';').find(c => c.includes('provcode=')).split('=')[1];

        const ipAddress = this.data_client.client_ip;
        const os = (this.data_client.os.trim() + this.data_client.browser.trim());

        this.province = document.cookie.split(';').find(c => c.includes('provcode=')).split('=')[1];
        const state = {
          state: `${this.serviceId}|${this.client_id_random}|${this.province}|${this.hcode}|${ipAddress}|${os}`,
        };

        console.log("provice " + this.province);
        const state_encode = qs.stringify(state);
        const url = `${process.env.VUE_APP_URL_AUTH}/gen_qrcode/?${state_encode}`;
        // console.log('url ที่ขออนุญาต ' + url)()

        let body = JSON.stringify({
          "account_token": this.account_token,
        });

        let config = {
          method: 'post',
          url: url,
          headers: {
            'Content-Type': 'application/json'
          },
          data: body
        };
        // Step 2: open new window
        await axios.request(config)
          .then((response) => {

            this.openAndCloseTab(response.data.url);

            // Step 3: check active from database
            // do after 7 sec pass wait for user scan QR code after that check database
            setTimeout(() => {
              this.callApi(this.client_id_random);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
          });

      } catch (error) {
        console.log(error);
      }
    },
    // Step 4: Check active from api
    async callApi(client_id) {
      // do every 2 sec until get data
      this.interval = setInterval(() => {
        this.checkActive(client_id);
      }, 2000);

    },
    // 4.1: check active by client id from database
    async checkActive(client_id) {
      try {
        let data = JSON.stringify({
          "account_token": this.account_token,
        });

        let config = {
          method: 'post',
          url: `${process.env.VUE_APP_URL_AUTH}/active_by_id/?client_id=${client_id}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        // Step 4.2: if active get data from database
        await axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            if (response.status !== 200) {
              // still not get data
              throw new Error('Cannot get data');
            } else {
              // until get data and api will remove client id from database for security

              this.checkPermiss(response.data.active, response.data.level);
              // ปิดการเช็ค active
              clearInterval(this.interval);
            }
          })
        // .catch((error) => {
        //   console.log(error);
        // });

      } catch (error) {
        // console.log(error);
      }
    },
    // Step 5 last: check permission 
    // async checkPermiss(cid) {
    async checkPermiss(is_active, is_level) {
      // show loading...
      this.isLoading = true;

      // Step 5.1: Check position allow
      if (is_active == "1" && is_level !== 0) {
        // create cookie and limit time 8 hours
        const d = new Date();
        d.setTime(d.getTime() + 8 * 60 * 60 * 1000); // 8 hours

        let expires = "expires=" + d.toUTCString();
        document.cookie = "username=" + this.username + ";" + expires + ";path=/";
        document.cookie = "cid=" + this.cid + ";" + expires + ";path=/";
        document.cookie = "position=" + this.position + ";" + expires + ";path=/";

        // redirect to search page
        this.$router.push("/search");
      } else {
        this.showRedAlert();
      }
      
    },
    showToastAlert(time, icon, title) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: icon,
        title: title,
      });
    },
    showRedAlert() {
      Swal.fire({
        title: 'ไม่สามารถเข้าใช้งานได้!!!',
        text: 'กรุณาแจ้งผู้ดูแลระบบ ตรวจสอบสิทธิในระบบ HIS ของท่าน',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#016b5f',
      });
    },
    openAndCloseTab(url) {
      const url_open = url
      // Open a new tab
      const newTab = window.open(url_open, '_blank');

      setTimeout(() => {
        newTab.close();
        // will close at setTimeout 20000 ms. and clear interval
        clearInterval(this.interval);
      }, this.countdown * 1000);
    },
    countDown(n) {
      // แสดงตัวนับถอยหลัง
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--; // Decrement countdown value
        } else if (this.countdown === 0) {
          // set timeout 3 sec.
          setTimeout(() => {
            this.countdown = n;
            clearInterval(this.countdownInterval);
          }, 3000);
        }
        else {
          clearInterval(this.countdownInterval);
        }
      }, 1000); // Update every second (1000 milliseconds)
    },
    // end of ThaID
    // start of login
    async fetchHcode() {
      try {
        const response = await axios.get(process.env.VUE_APP_URL_HOSCODE);
        // console.log(response.data);
        this.options = response.data.map(item => ({
          value: item.hoscode,
          label: '[' + item.hoscode + '] ' + item.hosname,
        }));
        this.waiting = false;
        if (document.cookie.split(';').find(c => c.includes('hname='))) {
          // selected 
          this.selectedHospital = {
            value: document.cookie.split(';').find(c => c.includes('hcode=')).split('=')[1],
            label: document.cookie.split(';').find(c => c.includes('hname=')).split('=')[1],
          };
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }

    },
    async handleSubmit() {
      console.log("submit");
      // check input is empty
      if (this.username == "" || this.password == "") {
        // focus input
        document.getElementById("username").focus();
        if (this.selectedHospital == "") {
          Swal.fire({
            icon: 'error',
            title: 'ไม่ได้เลือกหน่วยบริการ',
            text: 'กรุณาเลือกหน่วยบริการให้ถูกต้อง',
          })
        }
        return;
      }
      // Show loading screen
      this.loading = true;


      // check secure password
      let cnf = {
        method: 'post',
        url: process.env.VUE_APP_URL_AUTH + `/check_login/`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "account_token": this.account_token,
          "username": this.username,
          "password": this.password,
          "hoscode": this.selectedHospital.value,
          "thaid_id": this.thaid_id
        })
      };

      console.log(cnf);
      

      await axios.request(cnf)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.data.status == "success" && response.data.result == 1) {
            console.log("is true");
            // create cookie and limit time 8 hours
            const d = new Date();
            d.setTime(d.getTime() + 8 * 60 * 60 * 1000); // 8 hours

            let expires = "expires=" + d.toUTCString();
            document.cookie = "username=" + this.username + ";" + expires + ";path=/";
            document.cookie = "cid=" + response.data.detail[0].cid + ";" + expires + ";path=/";
            document.cookie = "position=" + response.data.detail[0].entryposition + ";" + expires + ";path=/";


            d.setTime(d.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
            expires = "expires=" + d.toUTCString();
            document.cookie = "hcode=" + this.selectedHospital.value + ";" + expires + ";path=/"; // 14 days
            document.cookie = "hospitalName=" + this.selectedHospital.label + ";" + expires + ";path=/"; // 14 days

            // print cookie username
            let c_username = document.cookie.split(';').find(c => c.includes('username='));
            console.log("username => " + c_username.split('=')[1]);

            // redirect to search page
            this.$router.push("/search");
          } else if (response.data.error == "1" || response.data.error == "2" || response.data.error == "3") {
            console.log("error 1 or 2 or 3");
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Username หรือ Password ไม่ปลอดภัย',
              text: response.data.detail,
              confirmButtonColor: '#016b5f',
            })
          } else {
            console.log("username or password is wrong");
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'เข้าสู่ระบบไม่สำเร็จ',
              text: 'กรุณาตรวจสอบ Username และ Password อีกครั้ง',
              confirmButtonColor: '#016b5f',
            })
          }
        })
        .catch((error) => {
          console.log(error);

        });

    },
  },
};
</script>

<style scoped>
section {
  background: linear-gradient(to bottom right, #1b016b, #52b7a8);
  height: 100vh;
}

.btn-primary {
  background-color: #016b5f;
  border-color: #016b5f;
}

.btn-primary:active {
  background-color: #52b7a8 !important;
  border-color: #52b7a8 !important;
}

.btn-primary:hover {
  background-color: #388377;
  border-color: #388377;
}

.btn-primary:focus {
  background-color: #388377;
  border-color: #388377;
}


.card {
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.my-card {
  width: 60rem;
}

.title {
  font-size: 1.2rem;
  font-weight: bold;
}

.box-right {
  border-left: solid 1px #ccc;
}

.thaid-icon {
  width: 7rem;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* CSS for Image and Animation */
.image-container {
  /* position: relative; */
  /* overflow: hidden; */
  cursor: pointer;
  /* border-radius: 20px; */
}

.image-container img {
  height: auto;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.image-container:hover img {
  transform: scale(1.0);
  transform: rotate(-10deg) translate(4px, 10px) scale(1.0);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.disabled {
  background-color: grey !important;
  border-color: grey !important;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.setting {
  color: #6262de;
  cursor: pointer;
  text-decoration: underline;
}

.alert {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
