<template>
  <PageWrapper contentFullHeight>
    <template #headerContent> <WorkbenchHeader :total="totalCount"/> </template>
    <div style="background: #ffffff">
      <BasicTable @register="registerTable">
        <template #toolbar>
<!--          @click="handleCreate"-->
          <a-button type="primary" >新建表单</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
              {
                label: '去处理',
                icon: 'clarity:note-edit-line',
                onClick: handleFun.bind(null,record)
              }
            ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>

  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './components/tableData';
  import {getToDoListApi} from "@/api/xiyi/home";

  let totalCount = ref(0);

  function handleFun(record){
    console.log(record,'1/23/12/312//32/13')
  }
  /**
   * table注册
   */
  const [registerTable, { reload,getRawDataSource }] = useTable({
    title: '待办事项',
    rowKey: 'taskId',
    resizeHeightOffset: 20,
    // bordered: true,
    useSearchForm: true,
    api: getToDoListApi,
    columns,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action'
    },
    afterFetch: arg => {
      const result = getRawDataSource();
      totalCount.value = result.totalCount;
    }
  });
</script>
