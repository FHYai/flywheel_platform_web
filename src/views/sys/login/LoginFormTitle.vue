<template>
  <h2 class="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
  import { computed, unref, defineProps } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState } from './useLogin';

  const props = defineProps({
    loading: { type: Boolean, default: false },
  });

  const { t } = useI18n();

  const { getLoginState } = useLoginState();

  const getFormTitle = computed(() => {
    const titleObj = {
      [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
      [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
      [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
      [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
      [LoginStateEnum.QR_CODE]: props.loading ? '登录中' : '扫码登录',
    };
    return titleObj[unref(getLoginState)];
  });
</script>
