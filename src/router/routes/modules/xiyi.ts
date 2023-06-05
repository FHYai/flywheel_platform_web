import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const home: AppRouteModule = {
  path: '/xiyi',
  name: 'Xiyi',
  component: LAYOUT,
  redirect: '/xiyi/home',
  meta: {
    icon: 'ant-design:desktop-outlined',
    title: '物鱼商品系统',
  },
  children: [
    {
      path: 'home',
      name: 'home',
      component: () => import('/@/views/xiyi/home/index.vue'),
      meta: {
        icon: 'ant-design:home-outlined',
        title: '首页',
      },
    }
  ],
};

export default home;
