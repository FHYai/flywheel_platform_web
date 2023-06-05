<template>
  <PageWrapper contentFullHeight>
    <template #headerContent> <WorkbenchHeader/> </template>
    <div style="background: #ffffff">
      <BasicTable @register="registerTable">
        <template #toolbar>
          <a-button type="primary" @click="handleCreate">新建表单</a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '去处理',
                onClick: handleEdit.bind(null, record)
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
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './components/tableData';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);

  /**
   * table注册
   */
  const [registerTable, { reload }] = useTable({
    title: '待办事项',
    rowKey: 'id',
    showIndexColumn: false,
    showTableSetting: true,
    bordered: true,
    useSearchForm: true,
    // api: accountListApi,
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
    }
  });
</script>
