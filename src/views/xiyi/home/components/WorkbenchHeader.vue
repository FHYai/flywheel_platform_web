<template>
  <div class="lg:flex lg:items-center lg:justify-between">
    <div class="lg:flex lg:items-center">
      <Avatar :src="userinfo.avatar || headerImg" :size="72" class="!mx-auto !block" />
      <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
        <h1 class="md:text-lg text-md text-center lg:text-left">{{ `${information.text}，${userinfo.userName}` }}</h1>
        <h1 class="md:text-lg text-md text-center lg:text-left mb-0">{{ information.content }}</h1>
      </div>
    </div>
    <div  class="lg:flex lg:items-center text-center lg:text-left">
      <img class="!mx-auto !block" :src="weatherImg" height="80" width="80"/>
      <div class="ml-3">
        <div class="text-secondary">{{ todayWeatherInfo.weather }}</div>
        <div class="text-secondary">{{ todayWeatherInfo.minTemp }}℃ - {{ todayWeatherInfo.maxTemp }}℃！</div>
      </div>
    </div>
    <div class="flex justify-end md:mt-0 mt-4">
      <div class="flex flex-col align-center justify-center text-center">
        <span class="text-secondary">待办</span>
        <span class="text-2xl">{{ total }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import axios from 'axios';
  import {computed, onMounted, ref, defineProps} from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import headerImg from '/@/assets/images/header.jpg';
  import cloudy from '/@/assets/images/weather/cloudy.png';
  import fog from '/@/assets/images/weather/fog.png';
  import rain from '/@/assets/images/weather/rain.png';
  import ray from '/@/assets/images/weather/ray.png';
  import snow from '/@/assets/images/weather/snow.png';
  import sunny from '/@/assets/images/weather/sunny.png';
  import windy from '/@/assets/images/weather/windy.png';
  import { setCookie,getCookie } from "@/utils/docCookies";
  import {isEmpty} from "@/utils/is";
  import {propTypes} from "@/utils/propTypes";

  const props = defineProps({
    total: propTypes.Number,
  })

  const isNight = ref(false);
  // 今日天气
  const todayWeather = ref({});
  // 明日天气
  const tomorrowWeather = ref({});
  // 天气图片
  const weatherImg = ref(sunny);
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
      getWeatherImg();
      obj.text = '早上好';
      obj.content = '开始您一天的工作吧!';
    } else if (hours > 10 && hours <= 14) {
      obj.text = '中午好';
      obj.content = '工作再忙也不要忘记吃午饭哦！';
    } else if (hours > 14 && hours <= 18) {
      obj.text = '下午好';
      obj.content = '忍住！千万不要打瞌睡，来条士力架吧！';
    } else if (hours > 18 && hours <= 24) {
      isNight.value = true;
      getWeatherImg();
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

  onMounted(() => {
    getLocation();
  });

  function getWeatherImg() {
    let { dayweather, nightweather } = todayWeather.value
    if (isNight.value) {
      if (!isEmpty(nightweather)) {
        weatherImg.value = checkWeatherImg(nightweather)
      }
    } else {
      if (!isEmpty(dayweather)) {
        weatherImg.value = checkWeatherImg(dayweather)
      }
    }
  }
  /**
   * 判断当前天气所要展示的图片
   * @param weather  当前天气
   */
  function checkWeatherImg(weather) {
    if ((weather.indexOf('晴') !== -1 || weather.indexOf('热') !== -1 || weather.indexOf('平静') !== -1 ) && weather !== '晴间多云') {
      return sunny;
    } else if (weather.indexOf('云') !== -1 || weather.indexOf('阴') !== -1) {
      return cloudy;
    } else if (weather.indexOf('风') !== -1 || weather.indexOf('沙') !== -1 || weather.indexOf('尘') !== -1) {
      return windy;
    } else if (weather.indexOf('雪') !== -1) {
      return snow;
    } else if (weather.indexOf('雷') !== -1) {
      return ray;
    } else if (weather.indexOf('雨') !== -1) {
      return rain;
    } else if (weather.indexOf('雾') !== -1 || weather.indexOf('霾') !== -1) {
      return fog;
    } else {
      return sunny;
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
      getWeatherImg();
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
        getWeatherImg();
      });
    }
  }
</script>
