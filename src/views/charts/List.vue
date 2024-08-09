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
                    <h4 class="card-title mb-0">위험물 리스트</h4>
                    <button type="button" class="btn btn-secondary update-btn" @click="fetchHazardData">
                      <img src="@/assets/image/update.png" alt="새로고침" class="refresh-icon"/>
                    </button>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <table>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>GPS</th>
                        <th>Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in hazardData" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.dates }}</td>
                        <td>{{ item.gps }}</td>
                        <td>{{ item.hazardType }}</td>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const hazardData = ref([])

async function fetchHazardData() {
  try {
    const response = await axios.get('http://localhost/api/hazarddata')
    hazardData.value = response.data
  } catch (error) {
    console.error("There was an error fetching the hazard data:", error)
  }
}

onMounted(() => {
  fetchHazardData()
})
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th {
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
  background-color: #212631;;
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

.refresh-icon {
  width: 24px;
  height: 24px;
}
</style>
