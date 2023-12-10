<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><font-awesome-icon icon="laptop-medical" /> ประวัติการรักษา</a>
      <div class="pdpa-noti marquee"><font-awesome-icon icon="exclamation-triangle" class="m-r-1 text-red" />
        <span class="text-red fw-bold me-1">warning!</span>
        <span>การเผยแพร่ ส่งต่อ หรือเข้าถึงข้อมูลผู้ป่วยโดยไม่มีสิทธิ เป็นความผิดตาม พรบ.คุ้มครองข้อมูลส่วนบุคคล</span>
        <span> / เหลือเวลาดูอีก {{ countdown }}</span>
      </div>
      <button class="navbar-toggler navbar-dark" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar navbar-dark">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">ประวัติการรักษา</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/search"><font-awesome-icon icon="search"
                  class="m-r-1" /> ค้นหาผู้ป่วยด้วย HN</a>
            </li>
            <!-- <li class="nav-item">
              <a class="nav-link active" href="#"><font-awesome-icon icon="address-card" class="m-r-1" />เกี่ยวกับระบบ</a>
            </li> -->
          </ul>
          <!-- <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form> -->
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <a class="nav-link active text-red" href="/login"><font-awesome-icon icon="sign-out-alt" class="m-r-1" />
                ออกจากระบบ</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <header class="mt-1">
    <div class="row g-4 py-2 row-cols-1 row-cols-lg-3">
      <div class="col">
        <div class="row">
          <div class="col-3 text-center">
            <img class="ms-2 img-width" alt="" :src="'data:image/png;base64,' + patient_img" height="95"
              v-if="patient_img != null && patient_img != ''">
            <img alt="" src="../assets/person_avatar.jpg" height="95" v-else>
          </div>
          <div class="col">
            <div class="d-block"><span class="fw-bold">ชื่อ-สกุล:</span> {{ patient.pname }}{{ patient.fname }}
              {{ patient.lname }}
            </div>
            <div class="d-block"><span class="fw-bold">เพศ:</span> {{ patient.sex }}</div>
            <div class="d-block"><span class="fw-bold">อายุ:</span> <span class="me-1">{{ patient.age }}</span> ปี</div>
            <div class="d-block"><span class="fw-bold">วันเกิด:</span> {{ getThaiDate(patient.birthday) }}</div>
          </div>
        </div>

      </div>
      <div class="col ps-4">
        <div class="d-block" id="telemed"><span class="fw-bold">เลขบัตรประชาชน:</span> {{ patient.cid }}

        </div>
        <span v-show="isToggle"></span>
        <div class="d-block">
          <button :class="addBtnClass()" @click="childMethod">
            <font-awesome-icon icon="fa-solid fa-camera" />
            {{ msgTele }}
          </button>
        </div>
      </div>
      <div class="col-12 col-sm-12 ps-4">
        <div class="my-box my-scroll-side col-12">
          <div class="drug_arg">
            <span class="text-red">{{ drug_allergy_none }}</span>
            <span style="font-size: 0.95rem!important;" class="fw-bold">{{ drug_allergy_length }}</span><br>
            <span style="font-size: 0.8rem" class="ms-1 badge bg-dang1 rounded-pill" v-for="(drug, index) in drug_allergy"
              :key="drug.id">{{ index + 1 }}.{{ drug }}</span>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<script>
import axios from "axios";
import io from 'socket.io-client';
import $ from 'jquery'

const jwt = require('jsonwebtoken');
const secret = process.env.VUE_APP_SECRET_KEY;

require('dotenv').config();

export default {
  name: "NavBar",
  el: '#telemed',
  data() {
    return {
      isToggle: false,
      getVisits: null,
      imms: null,
      patient: [],
      patient_img: '',
      max_date_vac: '',
      msgTele: 'Tele-Medicine',
      drug_allergy: [],
      drug_allergy_length: '',
      drug_allergy_none: '',
      username: '',
      cid: '',
      doctor_hoscode: '',
      patientHosCode: '',
      patientCid: '',
      tele_token: '',
      ip: '',
      countdown: '30:00',
      timer: null
    }
  },
  props: {
    visits: Array,
    hosCode: String
  },
  mounted() {
    let defaultTime = 30; // 30 minutes
    this.countDownToClose(defaultTime);

    const tokens = this.$route.params.token;
    this.tele_token = tokens;
    let decode = '';
    try {
      decode = jwt.verify(tokens, secret);
    } catch (err) {
      console.log(err);
    }
    this.patientHosCode = decode.patientHosCode;
    this.patientCid = decode.patientCid;
    this.username = decode.username;
    this.cid = decode.cid; // user cid
    this.doctor_hoscode = decode.hosCode; // user hoscode
    // this.patientHosCode = patientHosCode;
    // this.patientCid = patientCid;

    // let url = process.env.VUE_APP_VACCINEURL + "/?c=" + this.patientCid;
    // console.log("navbar_url=>" + url);

    // axios.get(url)
    //   .then(response => {
    //     this.imms = response.data;
    //     let dose_arr = response.data;
    //     let maxDose = Math.max.apply(Math, dose_arr.map(function (o) {
    //       return o.vaccine_dose_no;
    //     }));
    //     this.max_date_vac = dose_arr.find(x => x.vaccine_dose_no === maxDose).vaccine_date;
    //     // console.log(this.visits);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    // .then(function () {
    //   // always executed
    // });

    axios.get(process.env.VUE_APP_DRUGALLERGY_URL + "/" + this.patientCid + "/t/" + tokens)
      .then(response => {
        // alert(response.status);
        if (response.status === 200) {
          this.drug_allergy = response.data.drug_allergy;
          this.drug_allergy_length = "มีประวัติแพ้ยา " + this.drug_allergy.length + " รายการ";
          this.showAlert(this.drug_allergy_length, this.drug_allergy);
        } else {
          alert(response.status);
          this.drug_allergy = null;
        }
      }).catch((error) => {
        console.log("error => " + error);
        if (error.response.status === 500) {
          axios.get(process.env.VUE_APP_DRUGALLERGY_URL + "/" + this.patientCid + "/t/" + tokens)
            .then(response => {
              if (response.status === 200) {
                this.drug_allergy = response.data.drug_allergy;
                this.drug_allergy_length = "มีประวัติแพ้ยา " + this.drug_allergy.length + " รายการ";
                this.showAlert(this.drug_allergy_length, this.drug_allergy);
              } else {
                alert(response.status);
                this.drug_allergy = null;
              }
            }).catch(function (error) {
              console.log(error.response.data);
            });
        } else if (error.response.status === 404) {
          this.drug_allergy_none = "ไม่พบประวัติแพ้ยา: โปรดตรวจสอบกับผู้ป่วยอีกครั้ง";
        }
      }); // end axios

    const sockets = io(process.env.VUE_APP_APIURL);
    sockets.on("connect", () => {

      // event get patient
      let message = '{"datatype": "patient","cid":"' + this.patientCid + '","hcode":"' + this.patientHosCode + '"}';
      // console.log("message=>" + message);
      sockets.emit('patient', message);
      sockets.on('patient', (message) => {
        try {
          let resObj = JSON.parse(message);
          this.patient = resObj[0];
          this.patient_img = resObj[0].image;
        } catch (error) {
          console.log(error);
        }
      });
    });

  },
  emits: [
    'sendData'
  ],
  methods: {
    countDownToClose(n, reset) {
      if (reset) {
        clearInterval(this.timer);
        this.startCountdown(n);
      } else {
        this.startCountdown(n);
      }
    },
    startCountdown(n) {
      let seconds = n * 60; // 30 minutes
      this.timer = setInterval(() => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        this.countdown = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

        if (seconds === 0) {
          clearInterval(this.timer);
          // Perform logout action or redirect to logout page
          document.location.href = "/page401";
        } else {
          seconds--;
        }
      }, 1000); // Update every second (1000ms)
    },
    showAlert(drug_length, drug_allergy) {
      // eslint-disable-next-line no-unused-vars
      var items = [];
      drug_allergy.forEach(function (item) {
        items += item + ',' + '\n';
      });
      this.$swal.fire({
        "title": drug_length,
        "text": items,
        "icon": 'warning',
        "confirmButtonColor": '#026C6AFF',
      }
      );
    },
    addBtnClass() {
      if (this.isToggle === true) {


        return "px-4 mt-2 btn btn-danger rounded-pill";
        // return "ms-3 px-4 btn btn-outline-danger rounded-pill";
      } else {
        return "mt-2 btn btn-outline-primary rounded-pill myButton";
        // return "ms-3 btn btn-outline-primary rounded-pill myButton";
      }
    },

    childMethod() {
      // save telemed log
      try {
        let url_ip = "https://api.ipify.org?format=json";
        fetch(url_ip)
          .then(response => response.json())
          .then(data => {
            this.ip = data.ip;
            console.log("ip=>" + this.ip);
            let url = process.env.VUE_APP_TELELOG_URL + '/telelog/?jwt_str=' + this.tele_token + '&ip=' + this.ip
            fetch(url, {
              method: 'POST',
            }).then(response => {
              console.log(response);
            }).catch(error => {
              console.log(error);
            });
          })
          .catch(error => console.log(error));
      } catch (error) {
        console.log(error);
      }
      // end save telemed log

      let CefSharp;
      this.isToggle = !this.isToggle;
      // if (this.isToggle) {
      //   this.sendData()
      // }
      this.$emit('customEvent', this.isToggle);
      if (this.isToggle === true) {
        this.msgTele = 'โปรดกดวางสายที่นี่';
        // ต่อเวลา
        const reset = true;
        this.countDownToClose(30, reset);

        // send data to webview
        CefSharp.PostMessage("start_telemed");

      } else {
        // send data to webview
        this.msgTele = 'Tele-Medicine';
        CefSharp.PostMessage("stop_telemed");
      }
      // send data to webview
      // let CefSharp;
      // let sc;
      // CefSharp.PostMessage({"data_type": "Telamed", "value": true})
      this.$emit(this.isToggle);

      $("html, body").animate({ scrollDown: 0 }, "slow");
      // return false;

      // {"data_type":"Telamed","value",true}
    },
    getThaiDate(thd) {
      let ymd = new Date(thd);
      let year = ymd.getFullYear();
      let month = ymd.getMonth();
      let day = ymd.getDate();
      const date = new Date(year, month, day);
      const resultd = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        // month: '2-digit',
        day: '2-digit',
      });
      return resultd;
    }
  }
}
</script>

<style scoped>
header {
  background: white;
}

.img-width {
  max-width: 105px;
}

/*.red-tab {*/
/*  background: #FEF0F0;*/
/*  color: red;*/
/*  text-align: center;*/
/*}*/

.my-box {
  /*height: 6rem;*/
  height: 100%;
  border-radius: 5px;
  max-width: 100%;
  padding-left: 1rem;
  border: 1px solid #e6b3b3;
  /*margin-right: 1rem;*/
  /*width: 49rem;*/
}

.drug_arg {
  /*font-size: 1.2rem;*/
  color: red;

}

.border-bottom {
  border-bottom: 1px solid #dee2e6 !important;
}

.myButton-unused {
  animation-duration: 1750ms;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-name: button-shadow-throb;
  animation-timing-function: linear;
}

@keyframes button-shadow-throb {
  0% {
    box-shadow: 0px 0px 0px 0px #16b99d,
      /* Ring three - hidden. */
      0px 0px 0px 0px #13a289,
      /* Ring two - hidden. */
      0px 0px 0px 0px #13a289
      /* Ring one - hidden. */
    ;
  }

  15% {
    box-shadow: 0px 0px 0px 0px #13a289,
      0px 0px 0px 0px #13a289,
      0px 0px 0px 5px #13a289
      /* Ring one - enter. */
    ;
  }

  30% {
    box-shadow: 0px 0px 0px 0px #13a289,
      0px 0px 0px 5px #13a289,
      /* Ring two - enter. */
      0px 0px 0px 10px #13A28940;
  }

  45% {
    box-shadow: 0px 0px 0px 5px #13a289,
      /* Ring three - enter. */
      0px 0px 0px 10px #13A28940,
      0px 0px 0px 15px #13A28921;
  }

  /**
  * Once each ring reaches its outer spread-radius, it's going to fade out using
  * the alpha-channel on the RGB(A) hex color definition. Notice that the alpha-
  * channels go from "80" to "00" over the next couple of keyframes.
  */
  60% {
    box-shadow: 0px 0px 0px 10px #13A28940,
      0px 0px 0px 15px #13A28921,
      0px 0px 15px 15px #007cff00;
  }

  75% {
    box-shadow: 0px 0px 0px 15px #13A28921,
      0px 0px 15px 15px #13A28900,
      0px 0px 15px 15px #007cff00;
  }

  90% {
    box-shadow: 0px 0px 15px 15px #13A28900,
      0px 0px 15px 15px #13A28900,
      0px 0px 15px 15px #13A28900;
  }

  100% {
    box-shadow: 0px 0px 15px 15px #13A28900,
      0px 0px 15px 15px #13A28900,
      0px 0px 15px 15px #13A28900;
  }
}

.bg-light {
  background-color: #026C6A !important;
}

.navbar-brand {
  color: white !important;
}

.text-red {
  color: rgb(248, 93, 93) !important;
}

.m-r-1 {
  margin-right: 0.3rem;
}

.pdpa-noti {
  /* animation pulse */
  animation-duration: 1.5s;
  animation-name: pulse;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
  color: white;
}
</style>
