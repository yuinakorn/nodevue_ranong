<template>
    <div>

    </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";

export default {
    data() {
        return {
            username: "",
            cid: "",
            patientCid: "",
            notHn: false,
        };
    },
    beforeCreate() {
        // check cookie
        let c_username = document.cookie.split(';').find(c => c.includes('username='));
        if (c_username) {
            console.log("cookie is true");
            this.$router.push("/search");
        } else {
            console.log("cookie is false");
            window.location.href = "/login";
        }
    },
    mounted() {
        let c_hcode = document.cookie.split(';').find(c => c.includes('hcode='));
        let c_cid = document.cookie.split(';').find(c => c.includes('cid='));
        this.cid = c_cid.split('=')[1];
        // trim c_hcode
        let hcode = c_hcode.split('=')[1].trim();
        Swal.fire({
            title: 'กรอก HN ของผู้ป่วย',
            input: 'text',
            showClass: { popup: 'animate__animated animate__fadeInDown' },
            hideClass: {},
            confirmButtonColor: '#016b5f',
            inputAttributes: {
                autocapitalize: 'off',
                placeholder: 'HN',
                required: 'true',
                pattern: '[0-9]{1,10}'
            },
            inputValidator: (value) => {
                if (!value.match(/^[0-9]+$/)) {
                    return 'กรุณากรอก HN ให้ถูกต้อง'
                }
            },
            showCancelButton: true,
            confirmButtonText: 'ค้นหา',
            cancelButtonText: 'ยกเลิก',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: (hn) => {
                // ค้นหา HN ในระบบ
                let timerInterval;
                Swal.fire({
                    title: 'โปรดรอสักครู่!',
                    html: 'กำลังค้นหาข้อมูล <b></b> วินาที.',
                    timer: 1800,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100);
                        this.requestPatient(hn, hcode);
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            },
        }).then((result) => {
            // alert(result.dismiss)
            // if not confirm
            if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.reload();
            }
        })
    },
    methods: {
        requestPatient(hn, hcode) {
            const url = `${process.env.VUE_APP_EXP_HN}${hcode}?hn=${hn}`;
            console.log(url);
            // use axios 
            let config = {
                method: 'get',
                url: url,
                headers: {}
            };

            axios.request(config)
                .then((response) => {
                    // หาผู้ป่วยไม่เจอ
                    if (response.data.length == 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'เกิดข้อผิดพลาด',
                            text: `ไม่พบ HN ${hn} ในระบบ`,
                        }).then(() => {
                            this.$router.push("/search");
                            window.location.reload();
                        })
                    } else {
                        // หาผู้ป่วยเจอ
                        console.log(JSON.stringify(response.data));
                        this.patientCid = response.data[0].cid;

                        // เริ่ม generate token
                        let config = {
                            method: 'post',
                            url: process.env.VUE_APP_URL_AUTH + `/viewer/`,
                            headers: {
                                'aacept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            data: {
                                "account_token": process.env.VUE_APP_ACCOUNT_TOKEN,
                                "hosCode": hcode,
                                "cid": this.cid,
                                "patientCid": this.patientCid,
                                "patientHosCode": hcode
                            }
                        };
                        console.log("data => " + JSON.stringify(config.data));

                        axios.request(config)
                            .then((response) => {
                                console.log(JSON.stringify(response.data));
                                this.data = response.data;
                                console.log("data => " + JSON.stringify(this.data));
                                // redirect to main page
                                this.$router.push(`/t/${this.data.access_token}`);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },
}


</script>

<style scope>

</style>