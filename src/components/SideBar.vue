<template>
  <div class="col-md-3 my-scroll-side">
    <ul class="list-group bg-body rounded shadow-sm" id="scrollspy-list">
      <a :href="`#vn${ visit.vn }`"
         class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
         v-for="visit in visits" :key="visit.id">
        <div class="col">
          <div class="fw-bold line-height07 my-fs-s">{{ visit.hname }}</div>
          <span class="text-sub-title line-height07">{{ getThaiDate(visit.dateserv) }}</span>
          <div class="text-truncate my-symptom"><span class="small">{{ visit.symptom !== null ? visit.symptom : ' ' }}</span></div>
        </div>
        <span :class="getClass(visit.depart)">{{ visit.depart }}</span>
      </a>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {
      thDate: null,
    }
  },
  props: {
    visits: Array
  },
  methods: {
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
    },
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
  }

}
</script>

<style scoped>
.my-scroll-side {
  height: 80vh !important;
}

.list-group {
  top: 5rem;
}

.list-group-item {
  padding-top: .65rem;
  padding-bottom: .3rem;
}

.text-sub-title {
  font-size: 0.9rem;
}

.line-height07 {
  line-height: 0.7rem;
}

.my-fs-s {
  font-size: 0.97rem;
}

.active {
  color: white !important;
}

.my-symptom {
  width: 15rem;
}

</style>
