<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <CRow style="margin-top: 2vh;" class="justify-content-center align-items-center h-100">
            <CCol md="15">
              <CCard class="custom-card">
                <CCardHeader>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 class="card-title mb-0">데이터 삭제</h4>
                    <button type="button" class="btn btn-secondary update-btn" @click="deleteSelectedItems">
                      <img src="@/assets/image/delete.png" alt="삭제" class="delete-icon"/>
                    </button>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>No.</th>
                        <th>Date</th>
                        <th>GPS</th>
                        <th>Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in data" :key="index">
                        <td class="checkbox-cell">
                          <input type="checkbox" v-model="selectedItems" :value="item.no" />
                        </td>
                        <td>{{ item.no }}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.gps }}</td>
                        <td>{{ item.information }}</td>
                      </tr>
                    </tbody>
                  </table>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const data = ref([
  { no: 1, date: '2024-05-26 07:30:15', gps: '37.7749, -122.4194', information: 'Potholes' },
  { no: 2, date: '2024-05-26 10:15:30', gps: '34.0522, -118.2437', information: 'Road Cracks' },
  { no: 3, date: '2024-05-26 12:00:45', gps: '40.7128, -74.0060', information: 'Road Sinking' },
  { no: 4, date: '2024-05-26 14:45:10', gps: '51.5074, -0.1278', information: 'Road Construction Zones' },
  { no: 5, date: '2024-05-26 19:00:05', gps: '35.6895, 139.6917', information: 'Speed Bumps' },
  { no: 6, date: '2024-05-26 19:00:05', gps: '48.8566, 2.3522', information: 'Potholes' }
])
const selectedItems = ref([])

function deleteSelectedItems() {
  data.value = data.value.filter(item => !selectedItems.value.includes(item.no))
  selectedItems.value = [] // 선택된 항목 초기화
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th{
  color: #ffffff;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #212631;
}

.checkbox-cell {
  text-align: center;
}
.update-btn {
  background-color: #a6a6a6;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 4px;
}
.delete-icon {
  width: 24px;
  height: 24px;
}
</style>
