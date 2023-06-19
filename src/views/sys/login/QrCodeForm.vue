<template>
  <div v-if="getShow">
    <LoginFormTitle :loading="logging" class="enter-x" />
    <div class="enter-x min-w-64 min-h-64 mt-5">
      <div class="h-400px xl:w-300px enter-x flex justify-center items-center">
        <div id="wx_qrcode" v-show="!logging"></div>
        <Spin v-show="logging" size="large"/>
      </div>
      <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref, ref, onMounted } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Divider, Spin } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();
  let logging = ref(false);
  const { getLoginState } = useLoginState();
  const userStore = useUserStore();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.QR_CODE);

  onMounted(() => {
    showQrCode();
  });

  /**
   * 二维码展示
   */
  function showQrCode() {
    let search = window.location.href.split("?")[1];
    if (search === undefined || search.indexOf('redirect') !== -1) {
      logging.value = false;
      getQrPic();
    } else {
      logging.value = true;
      const code = search.split("=")[1];
      userStore.login({
        code,
        mode: 'none', //不要默认的错误提示
      }).then(result => {
        console.log(result)
      }).catch(err => {
        logging.value = false;
        getQrPic();
      });
    }
  }
  /**
   * 获取二维码
   */
  function getQrPic() {
    const prod = import.meta.env.VITE_GLOB_API_URL.indexOf('feilun.seeease.com') !== -1
    let _path = window.location.origin
    if (window.location.pathname.indexOf('/index.html') >= 0) {
      _path += window.location.pathname
    }
    new WwLogin({
      id: "wx_qrcode", // 登录页面显示二维码的容器id
      appid: prod ? "ww6e5ffaaa9d278bab" : "ww9850d0c26d324b39", // 企业微信的CorpID，在企业微信管理端查看
      agentid: prod ? "1000018" : "1000002", // 授权方的网页应用id，在具体的网页应用中查看
      redirect_uri: encodeURIComponent(
        prod ? `https://feilun.seeease.com/fl/302.html?org=${_path}` : `https://pre.seeease.com/fl/feilun/302.html?org=${_path}`
      ), // 重定向的地址，需要进行encode
    });
  }
</script>
