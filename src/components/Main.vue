<template>
  <div class="col-md-9 col-lg-9" id="main">
    <!--  <div class="col" id="main">-->
    <!--    <div class="pb-4 border-bottom">-->
    <div class="pb-4">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" data-bs-toggle="tab" href="#all">ทั้งหมด</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#screen">ซักประวัติ</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#diag">วินิจฉัย</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#drug">ยา</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#lab">Lab.</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="tab" href="#procedure">หัตถการ</a>
        </li>
      </ul>
    </div>

    <div class="col-12">
      <div class="row">
        <div id="myScrollBox" class="col my-scroll-box" data-bs-spy="scroll" data-bs-target="#scrollspy-list"
          data-bs-offset="180" data-bs-smooth-scroll="true" tabindex="0">

          <div class="tab-content">

            <div class="tab-pane active" id="all">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">

                <div class="my-3 p-3 card bg-body rounded shadow-sm">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex pt-3 justify-content-between px-3 mb-3">
                    <div><font-awesome-icon icon="wave-square" /><span class="m-left-1 fw-bold">ความดัน:</span> {{ formatNum0(visit0.bps) }}/{{ formatNum0(visit0.bpd) }}
                    </div>
                    <div><font-awesome-icon icon="heart" /><span class="m-left-1 fw-bold">ชีพจร:</span> {{ formatNum1(visit0.pulse) }}</div>
                    <div><font-awesome-icon icon="thermometer" /><span class="m-left-1 fw-bold">อุณหภูมิ:</span> {{ formatNum1(visit0.temperature) }} °C</div>
                    <div><font-awesome-icon icon="weight" /><span class="m-left-1 fw-bold">น้ำหนัก:</span> {{ formatNum0(visit0.weight) }} กก.</div>
                    <div><font-awesome-icon icon="ruler-vertical" /><span class="m-left-1 fw-bold">ส่วนสูง:</span> {{ formatNum0(visit0.height) }} ซม.</div>
                  </div>
                  <h6 class="border-top pb-2 mb-0 pt-3"><strong>Symptom</strong></h6>
                  <div class="d-flex">
                    <span>{{ visit0.symptom !== null ? visit0.symptom : 'ไม่มีข้อมูล' }}</span>
                  </div>
                </div>

                <div :class="diagClass(visit0.data.drug.length)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>รหัสโรค (ICD10)</th>
                          <th>ชื่อโรค</th>
                          <th>ประเภท</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="diag in visit0.data.diag" :key="diag.id">
                          <td>{{ diag.icd10 }}</td>
                          <td>{{ diag.diagname }}</td>
                          <td>{{ diag.diagtype }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div :class="drugClass(visit0.data.drug.length)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อยา</th>
                          <th>วิธีใช้</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="drug in visit0.data.drug" :key="drug.id">
                          <td>{{ drug.drugname }} <span v-if="drug.strength != null">({{ drug.strength }})</span></td>
                          <td>{{ drug.drugusage }}</td>
                          <td>{{ drug.qty }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div :class="labClass(visit0.data.lab)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อ Lab</th>
                          <th>ผล</th>
                          <th>unit</th>
                          <th>ref.</th>
                          <th>remark</th>
                          <th>วันที่</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="lab in visit0.data.lab" :key="lab.id">
                          <td>{{ lab.labname }}</td>
                          <td>{{ lab.result }}</td>
                          <td>{{ lab.unit }}</td>
                          <td>{{ lab.ref }}</td>
                          <td>{{ lab.remark }}</td>
                          <td>{{ getThaiDate(lab.laborder_date) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div :class="procClass(visit0.data.procedure)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อหัตถการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="proc in visit0.data.procedure" :key="proc.id">
                          <td>{{ proc.icd9name }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane" id="screen">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">

                <div class="my-3 p-3 bg-body card rounded shadow-sm">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex pt-3 justify-content-between px-3 mb-3">
                    <div><font-awesome-icon icon="wave-square" /><span class="m-left-1 fw-bold">ความดัน:</span> {{ formatNum0(visit0.bps) }}/{{ formatNum0(visit0.bpd) }}
                    </div>
                    <div><font-awesome-icon icon="heart" /><span class="m-left-1 fw-bold">ชีพจร:</span> {{ formatNum1(visit0.pulse) }}</div>
                    <div><font-awesome-icon icon="thermometer" /><span class="m-left-1 fw-bold">อุณหภูมิ:</span> {{ formatNum1(visit0.temperature) }} °C</div>
                    <div><font-awesome-icon icon="weight" /><span class="m-left-1 fw-bold">น้ำหนัก:</span> {{ formatNum0(visit0.weight) }} กก.</div>
                    <div><font-awesome-icon icon="ruler-vertical" /><span class="m-left-1 fw-bold">ส่วนสูง:</span> {{ formatNum0(visit0.height) }} ซม.</div>
                  </div>
                  <h6 class="border-top pb-2 mb-0 pt-3"><strong>Symptom</strong></h6>
                  <div class="d-flex">
                    <span>{{ visit0.symptom !== null ? visit0.symptom : 'ไม่มีข้อมูล' }}</span>
                  </div>
                </div>

                <!--          <div class="my-3 p-3 bg-body rounded shadow-sm">-->
                <!--            <h6 class="border-bottom pb-2 mb-0"><strong>Symptom</strong></h6>-->
                <!--            <div class="d-flex pt-3">-->
                <!--              <span>{{ visit0.symptom !== null ? visit0.symptom : 'ไม่มีข้อมูล' }}</span>-->
                <!--            </div>-->
                <!--          </div>-->

              </div>
            </div>

            <div class="tab-pane" id="diag">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">
                <div :class="diagClass(visit0.data.drug.length)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>รหัสโรค (ICD10)</th>
                          <th>ชื่อโรค</th>
                          <th>ประเภท</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="diag in visit0.data.diag" :key="diag.id">
                          <td>{{ diag.icd10 }}</td>
                          <td>{{ diag.diagname }}</td>
                          <td>{{ diag.diagtype }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane" id="drug">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">
                <div :class="drugClass(visit0.data.drug.length)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อยา</th>
                          <th>วิธีใช้</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="drug in visit0.data.drug" :key="drug.id">
                          <td>{{ drug.drugname }} <span v-if="drug.strength != null">({{ drug.strength }})</span></td>
                          <td>{{ drug.drugusage }}</td>
                          <td>{{ drug.qty }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane" id="lab">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">
                <div :class="labClass(visit0.data.lab)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อ Lab</th>
                          <th>ผล</th>
                          <th>unit</th>
                          <th>ref.</th>
                          <th>remark</th>
                          <th>วันที่</th>
                        </tr>
                      </thead>
                      <tbody v-if="visit0.data.lab.length > 0">
                        <tr v-for="lab in visit0.data.lab" :key="lab.id">
                          <td>{{ lab.labname }}</td>
                          <td>{{ lab.result }}</td>
                          <td>{{ lab.unit }}</td>
                          <td>{{ lab.ref }}</td>
                          <td>{{ lab.remark }}</td>
                          <td>{{ getThaiDate(lab.laborder_date) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="tab-pane" id="procedure">
              <div :id="`vn${visit0.vn}`" v-for="visit0 in visits" :key="visit0.id">
                <div :class="procClass(visit0.data.procedure)">
                  <h6 class="border-bottom pb-2 mb-0"><strong>วันที่ {{ getThaiDate(visit0.dateserv) }} {{
                    visit0.hname
                  }}</strong></h6>
                  <div class="d-flex text-muted pt-3">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ชื่อหัตถการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="proc in visit0.data.procedure" :key="proc.id">
                          <td>{{ proc.icd9name }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <!--         open iframe-->
        <div v-if="toggles" class="col-md-6 col-lg-6" id="telemed">
          <iframe allow="camera; microphone; fullscreen; display-capture; autoplay" :src="getJitsiUrl(visits[0].cidx)"
            style="height: 80vh; width: 100%; border: 0;"></iframe>
        </div>
      </div>


    </div>
    <!--    showClass -->





  </div>
</template>
<script>
import $ from 'jquery'
// import NavBar from "@/components/NavBar";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export default {
  // name: 'HomePage',
  name: 'Main',
  components: {
  // eslint-disable-next-line vue/no-unused-components
    FontAwesomeIcon,
  },
  data() {
    return {
      formatNum: '',
      number: '',
      isActive: 'col-md-6 my-scroll-box',
      myParam: true,
    }
  },
  props: {
    visits: Array,
    toggles: Boolean
  },

  updated: function () {
    this.scrollWin()
  },

  methods: {
    scrollWin() {
      // 1 is pixel, 800 is time
      $("#myScrollBox").animate({ scrollTop: 15 }, 800);
      $("#myScrollBox").animate({ scrollTop: 0 }, 400);
    },

    getJitsiUrl(cid) {
      const cid10 = cid.slice(0, -4);
      const cidx = cid10 + 'wxyz';
      return `${process.env.VUE_APP_URL_JITSI}${cidx}`;
    },
    // showClass(myParam) {
    showClass() {
      if (this.myParam === true) {
        return 'col-md-6 col-lg-6 my-scroll-box'
      } else {
        return 'col-md-9 col-lg-9 my-scroll-box'
      }
    },

    getClass(result) {
      if (result === 'OPD') {
        return 'badge bg-primary-my rounded-pill';
      } else if (result === 'IPD') {
        return 'badge bg-danger-my rounded-pill';
      } else if (result === 'ER') {
        return 'badge bg-warning-my rounded-pill';
      } else {
        return 'badge bg-light text-dark rounded-pill';
      }
    }
    ,
    diagClass(result) {
      // console.log(result);
      if (result > 0) {
        return 'my-3 p-3 bg-body card rounded shadow-sm';
      } else {
        return 'd-none';
      }
    }
    ,
    drugClass(result) {
      // console.log(result);
      if (result > 0) {
        return 'my-3 p-3 bg-body card rounded shadow-sm';
      } else {
        return 'd-none';
      }
    }
    ,
    labClass(result) {
      // let json_result = JSON.stringify(result);
      // console.log("lab_len" + result.length + "laborder_date => "+ json_result);
      if (result.length === 0) {
        return 'd-none';
      } else if (result.length === 1) {
        if (result[0].labcode === "") {
          return 'd-none';
        } else {
          return 'my-3 p-3 bg-body card rounded shadow-sm';
        }
      } else {
        return 'my-3 p-3 bg-body card rounded shadow-sm';
      }
    }
    ,
    procClass(result) {
      let json_result = JSON.stringify(result);
      console.log("result_length = " + result.length + " result procedure => " + json_result);
      if (result.length === 0) {
        return 'd-none';
      } else if (result.length === 1) {
        if (result[0].icd9name === "") {
          return 'd-none';
        } else {
          return 'my-3 p-3 bg-body card rounded shadow-sm';
        }
      } else {
        return 'd-none';
      }
    }
    ,
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
    ,
    formatNum0(n) {
      let num0 = parseFloat(n).toFixed(0);
      let fnum = '';
      if (num0 === 'NaN') {
        fnum = '-';
      } else {
        fnum = num0;
      }
      return fnum;
    }
    ,
    formatNum1(n) {
      let num1 = parseFloat(n).toFixed(1);
      let fnum = '';
      if (num1 === 'NaN') {
        fnum = '-';
      } else {
        fnum = num1;
      }
      return fnum;
    }
  },
  // components: {ContentLoader}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.my-scroll-box {
  height: 80vh;
  overflow-y: scroll;
}

.bg-bar {
  background-color: var(--main-color);
  /*background-color: var(--main-color);*/
  /*background-color: var(--main-color);*/
  color: white;
}

.nav-pills .nav-link.active {
  background-color: var(--main-color);
  color: white;
}


#myScrollBox {
  height: 80vh;
  overflow-y: scroll;
}

.m-left-1 {
  margin-left: 0.3rem;
}
</style>

