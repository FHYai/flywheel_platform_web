import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import {roleListApi} from "/@/api/system/role";

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'avatar',
    minWidth: 100
  },
  {
    title: '单号',
    dataIndex: 'username',
    minWidth: 120
  },
  {
    title: '关联单号',
    dataIndex: 'realName',
    minWidth: 120
  },
  {
    title: '创建时间',
    dataIndex: 'phone',
    minWidth: 150
  },
  {
    title: '流程名称',
    dataIndex: 'roles',
    minWidth: 200
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '任务节点',
    component: 'Input'
  },
  {
    field: 'realName',
    label: '单号',
    component: 'Input'
  },
  {
    field: 'name',
    label: '关联单号',
    component: 'Input'
  }
];
