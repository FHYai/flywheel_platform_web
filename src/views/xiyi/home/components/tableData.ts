import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import {roleListApi} from "/@/api/system/role";

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'taskName',
    minWidth: 100
  },
  {
    title: '单号',
    dataIndex: 'businessKey',
    minWidth: 120
  },
  {
    title: '关联单号',
    dataIndex: 'parentBusinessKey',
    minWidth: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    minWidth: 150
  },
  {
    title: '流程名称',
    dataIndex: 'processDefinitionName',
    minWidth: 200
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'taskDefinitionKeys',
    label: '任务节点',
    component: 'Input'
  },
  {
    field: 'serialNo',
    label: '单号',
    component: 'Input'
  },
  {
    field: 'serialNo',
    label: '关联单号',
    component: 'Input'
  }
];
