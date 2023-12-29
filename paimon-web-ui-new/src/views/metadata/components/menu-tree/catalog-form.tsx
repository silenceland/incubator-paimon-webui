/* Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License. */

import { Add } from '@vicons/ionicons5'

import { useCatalogStore } from '@/store/catalog'
import { createCatalog, type CatalogDTO } from '@/api/models/catalog'

export default defineComponent({
  name: 'CatalogForm',
  setup() {
    const rules = {
      name: {
        required: true,
        trigger: ['blur', 'input'],
        message: 'catalog name required'
      },
      type: {
        required: true,
        trigger: ['blur', 'input'],
        message: 'catalog type required'
      },
      warehouse: {
        required: true,
        trigger: ['blur', 'input'],
        message: 'catalog warehouse required'
      },
      hiveUri: {
        required: true,
        trigger: ['blur', 'input'],
        message: 'catalog hiveUri required'
      },
      hiveConfDir: {
        required: true,
        trigger: ['blur', 'input'],
        message: 'catalog hiveConfDir required'
      }
    }

    const catalogTypeOptions = [
      {
        label: 'FileSystem',
        value: 'filesystem'
      },
      {
        label: 'Hive',
        value: 'hive'
      }
    ]

    const { t } = useLocaleHooks()
    const message = useMessage()

    const catalogStore = useCatalogStore()
    const [result, createFetch, { loading }] = createCatalog()

    const formRef = ref()
    const formValue = ref<CatalogDTO>({
      name: '',
      type: '',
      warehouse: '',
    })
    const showModal = ref(false)

    const handleConfirm = async () => {
      await formRef.value.validate()
      await createFetch({
        params: toRaw(formValue.value)
      })
      
      if (result.value.code === 200) {
        handleCloseModal()
        message.success(t('Create Successfully'))
        formValue.value = {
          name: '',
          type: '',
          warehouse: '',
        }
        catalogStore.getAllCatalogs(true)
      }
    }

    const handleOpenModal = (e: Event) => {
      e.stopPropagation()
      showModal.value = true
    }

    const handleCloseModal = () => {
      showModal.value = false
    }

    return {
      formRef,
      formValue,
      showModal,
      loading,

      rules,
      catalogTypeOptions,

      t,
      handleOpenModal,
      handleCloseModal,
      handleConfirm
    }
  },
  render() {
    return (
      <>
        <n-button
          quaternary
          circle
          size='tiny'
          onClick={this.handleOpenModal}
        >
          <n-icon>
            <Add />
          </n-icon>
        </n-button>
        <n-modal
          v-model:show={this.showModal}
          mask-closable={false}
        >
          <n-card bordered={false} title={this.t('metadata.create_catalog')} style="width: 600px">
            {{
              default: () => (
                <n-form
                  ref='formRef'
                  label-placement="left"
                  label-width="auto"
                  label-align="right"
                  rules={this.rules}
                  model={this.formValue}
                >
                  <n-form-item label={this.t('metadata.catalog_name')} path='name'>
                    <n-input v-model:value={this.formValue.name} />
                  </n-form-item>
                  <n-form-item label={this.t('metadata.catalog_type')} path='type'>
                    <n-select v-model:value={this.formValue.type} options={this.catalogTypeOptions} />
                  </n-form-item>
                  <n-form-item label={this.t('metadata.catalog_warehouse')} path='warehouse'>
                    <n-input v-model:value={this.formValue.warehouse} />
                  </n-form-item>
                  {
                    this.formValue.type === 'hive' && (
                      <>
                        <n-form-item label={this.t('metadata.catalog_hiveuri')} path='hiveUri'>
                          <n-input v-model:value={this.formValue.hiveUri} />
                        </n-form-item>
                        <n-form-item label={this.t('metadata.catalog_hive_conf_dir')} path='hiveConfDir'>
                          <n-input v-model:value={this.formValue.hiveConfDir} />
                        </n-form-item>
                      </>
                    )
                  }
                </n-form>
              ),
              footer: () => (
                <n-space justify='end'>
                  <n-button onClick={this.handleCloseModal}>
                    {this.t('layout.cancel')}
                  </n-button>
                  <n-button type='primary' loading={this.loading} onClick={this.handleConfirm}>
                    {this.t('layout.confirm')}
                  </n-button>
                </n-space>
              )
            }}
          </n-card>
        </n-modal>
      </>
    )
  }
})