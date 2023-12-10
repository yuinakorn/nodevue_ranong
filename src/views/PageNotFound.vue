<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <section class="page_404">
          <div class="four_zero_four_bg">
            <h1 class="text-center ">Error 404</h1>
          </div>

          <div class="contant_box_404">
            <h3 class="h2">
              Page Not Found !
            </h3>
            <p>URL ไม่ถูกต้อง โปรดตรวจสอบ</p>
            <button class="link_404 btn rounded-pill" onclick="history.back()">Go back</button>
          </div>
        </section>

      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: "PageNotFound",

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

  /*background-image: url('../assets/err_page.gif');*/
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

</style>