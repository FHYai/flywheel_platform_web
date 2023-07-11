import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetToDoList = '/flywheel/work/toDoList',
}

/**
 * @description: 获取首页代办数据
 */

export const getToDoListApi = (params=null) => {
  return defHttp.post({ url: Api.GetToDoList, params });
};
