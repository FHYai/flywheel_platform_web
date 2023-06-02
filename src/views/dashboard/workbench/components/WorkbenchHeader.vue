<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="lg:flex lg:items-center">
      <Avatar :src="userinfo.avatar || headerImg" :size="72" class="!mx-auto !block" />
      <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
        <h1 class="md:text-lg text-md text-center lg:text-left">{{ `${information.text}，${userinfo.realName}` }}</h1>
        <h1 class="md:text-lg text-md text-center lg:text-left mb-0">{{ information.content }}</h1>
<!--        <span class="text-secondary text-center lg:text-left"> 今日{{ todayWeatherInfo.weather }}，{{ todayWeatherInfo.minTemp }}℃ - {{ todayWeatherInfo.maxTemp }}℃！ </span>-->
      </div>
    </div>
    <div  class="lg:flex lg:items-center text-center lg:text-left">
      <img class="!mx-auto !block" :src="weatherImg" height="100" width="100"/>
      <div>
        <div class="text-secondary">{{ todayWeatherInfo.weather }}</div>
        <div class="text-secondary">{{ todayWeatherInfo.minTemp }}℃ - {{ todayWeatherInfo.maxTemp }}℃！</div>
      </div>
    </div>
    <div class="flex justify-end md:mt-0 mt-4">
      <div class="flex flex-col align-center justify-center text-right">
        <span class="text-secondary">待办</span>
        <span class="text-2xl">10</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import axios from 'axios';
  import {computed, onMounted, ref} from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import headerImg from '/@/assets/images/header.jpg';
  import { setCookie,getCookie } from "@/utils/docCookies";

  const isNight = ref(false);
  // 今日天气
  const todayWeather = ref({});
  // 明日天气
  const tomorrowWeather = ref({});
  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  // 判断当前时间属于什么范畴
  const information = computed(() => {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    let obj = {
      text: '',
      content: '',
    };
    if (hours >= 0 && hours <= 10) {
      isNight.value = false;
      obj.text = '早上好';
      obj.content = '开始您一天的工作吧!';
    } else if (hours > 10 && hours <= 14) {
      obj.text = '中午好';
      obj.content = '工作再忙也不要忘记吃饭哦!';
    } else if (hours > 14 && hours <= 18) {
      obj.text = '下午好';
      obj.content = '继续奋斗吧!';
    } else if (hours > 18 && hours <= 24) {
      isNight.value = true;
      obj.text = '晚上好';
      obj.content = '早点休息哦!';
    }
    return obj
  });
  // 展示当前天气信息
  const todayWeatherInfo = computed(() => {
    let { dayweather, nightweather, daytemp, nighttemp } = todayWeather.value
    let obj = {
      weather: '',
      maxTemp: 0,
      minTemp: 0
    }
    obj.weather = dayweather == nightweather ? dayweather : `${dayweather}转${nightweather}`
    obj.maxTemp = daytemp
    obj.minTemp = nighttemp
    return obj
  });
  // 天气图片
  const weatherImg = computed(() => {
    let url = 'https://s1.ax1x.com/2023/06/02/'
    let { dayweather, nightweather } = todayWeather.value
    let imgName
    if (isNight.value) {
      imgName = checkWeatherImg(nightweather)
    } else {
      imgName = checkWeatherImg(dayweather)
    }
    url += imgName
    return url
  })

  onMounted(() => {
    getLocation();
  });

  /**
   * 判断当前天气所要展示的图片
   * @param weather  当前天气
   */
  function checkWeatherImg(weather) {
    if (['晴','热','平静'].includes(weather) && weather !== '晴间多云') {
      return 'pCSql7V.png';
    } else if (['云','阴'].includes(weather)) {
      return 'pCSq3kT.png';
    } else if (['风','沙','尘'].includes(weather)) {
      return 'pCSqGhF.png';
    } else if (['雪'].includes(weather)) {
      return 'pCSquXn.png';
    } else if (['雷'].includes(weather)) {
      return 'pCSqMmq.png';
    } else if (['雨'].includes(weather)) {
      return 'pCSq8tU.png';
    } else if (['雾','霾'].includes(weather)) {
      return 'pCSqQ00.png';
    }
  }
  /**
   * 根据ip获取用户地理位置
   */
  function getLocation() {
    let locationCookie = getCookie('userLocation');
    let userLocationCode = getCookie('userLocationCode');

    if (locationCookie) {
      getWeatherDataObj(locationCookie, userLocationCode);
    } else {
      axios({
        url: 'https://restapi.amap.com/v3/ip',
        method: 'get',
        params: {
          key: '885aeac41de1cacea4ddcccfa5171e01',
        },
      }).then(res => {
        console.log(res,'ip地址')
        getWeatherDataObj(res.data.city,res.data.adcode);
        setCookie('userLocation',res.data.city,'h3');
        setCookie('userLocationCode',res.data.adcode,'h3');
      });
    }
  }
  /**
   * 根据地理位置获取天气情况
   * @param cityName
   * @param cityCode
   */
  function getWeatherDataObj(cityName,cityCode) {
    let weatherData = getCookie('weatherData');
    if (weatherData) {
      let weatherDataObj = JSON.parse(weatherData);
      todayWeather.value = weatherDataObj.casts[0];
      tomorrowWeather.value = weatherDataObj.casts[1];
    } else {
      axios({
        url: 'https://restapi.amap.com/v3/weather/weatherInfo',
        method: 'get',
        params: {
          key: '14d2807cf69052aed58d8a12877cd2dc',
          city: cityCode,
          extensions: 'all',
          output: 'JSON',
        },
      }).then(res => {
        console.log(res.data,'天气预报');
        todayWeather.value = res.data.forecasts[0].casts[0];
        tomorrowWeather.value = res.data.forecasts[0].casts[1];
        setCookie('weatherData',JSON.stringify(res.data.forecasts[0]),'h3');
      });
    }
  }
</script>
