<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <section class="page_404">
          <div class="four_zero_four_bg">
            <h1 class="text-center ">Error 401</h1>
          </div>

          <div class="contant_box_404">
            <h3 class="h2">
              หมดเวลา!
            </h3>
            <p>Token หมดเวลา / การยืนยันตัวตนไม่ถูกต้อง</p>
            <a class="btn btn-primary rounded-pill" href="/">กลับสู่หน้าหลัก</a>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page401",
  data() {
    return {};
  },
  beforeCreate() {
    // delete cookie
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "cid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "position=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('token');
  }
}
</script>

<style scoped>
.page_404 {
  padding: 40px 0;
  background: #fff;
  font-family: 'Arvo', serif;
  width: 700px;
  margin: 0 auto;
}

.page_404 img {
  width: 100%;
}

.four_zero_four_bg {

  height: 150px;
  background-position: center;
  width: 700px;

}


.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  /*background: #39ac31;*/
  background: #08a188;
  margin: 20px 0;
  display: inline-block;
}

.contant_box_404 {
  margin: -50px auto 0 auto;
  text-align: center;
}

.btn-primary {
  background-color: #016b5f;
  border-color: #016b5f;
}

.btn-primary:hover {
  background-color: #388377;
  border-color: #388377;
}

.btn-primary:active {
  background-color: #52b7a8 !important;
  border-color: #52b7a8 !important;
}
</style>