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
                <CCardHeader class="d-flex justify-content-between align-items-center">
                    <h4 class="card-title">데이터 삭제</h4>
                    <!-- 검색 입력 필드 -->
                    <div class="d-flex justify-content-between align-items-center" style="width: 30%;">
                      <input 
                        type="text" 
                        class="form-control" 
                        placeholder="검색어를 입력하세요..." 
                        v-model="searchQuery"
                      />&nbsp;&nbsp;&nbsp;
                      <button type="button" class="btn btn-secondary update-btn" @click="deleteSelectedItems">
                          <img src="@/assets/image/delete.png" alt="삭제" class="delete-icon" />
                      </button>
                    </div>
                </CCardHeader>
                <CCardBody>
                  <div v-if="isLoading" class="text-center">
                    <span>로딩 중...</span>
                  </div>
                  <div v-else>
                    <table class="table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>ID</th>
                          <th>위험물 정보</th>
                          <th>GPS 좌표</th>
                          <th>상태</th>
                          <th>날짜</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in filteredHazardData" :key="index">
                          <td class="checkbox-cell">
                            <input type="checkbox" v-model="item.selected" />
                          </td>
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.hazardType }}</td>
                          <td>{{ item.gps }}</td>
                          <td>{{ item.state }}</td>
                          <td>{{ item.dates }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const hazardData = ref([])
const searchQuery = ref('')  // 검색어 저장 변수
const isLoading = ref(true)  // 로딩 상태 관리

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost/api/hazarddata')
    console.log("API Response Data:", response.data) // 응답 데이터 확인용 로그

    // 데이터 매핑
    hazardData.value = response.data.map((item, index) => ({
      ...item,
      selected: false,
      no: item.no !== undefined ? item.no : index + 1 // 'no' 속성이 없으면 index를 사용
    }))

    console.log("Fetched Data:", hazardData.value) // 데이터 확인용 로그
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error)
  } finally {
    isLoading.value = false
  }
}

// 필터링된 데이터 계산
const filteredHazardData = computed(() => {
  if (!searchQuery.value) {
    return hazardData.value
  }

  return hazardData.value.filter(item => {
    return item.hazardType.includes(searchQuery.value) || 
           item.gps.includes(searchQuery.value) || 
           item.state.includes(searchQuery.value) || 
           item.dates.includes(searchQuery.value)
  })
})

onMounted(() => {
  fetchHazardData()
})

// 선택된 항목 삭제 함수
async function deleteSelectedItems() {
  hazardData.value.forEach(item => {
    console.log(`Item HID: ${item.hid}, Selected: ${item.selected}`)
  })

  const itemsToDelete = hazardData.value
    .filter(item => item.selected && item.hid !== undefined)
    .map(item => item.hid)

  if (itemsToDelete.length === 0) {
    console.error("삭제할 항목이 없습니다. 또는 항목의 HID가 잘못되었습니다.")
    return
  }

  console.log("Items to delete:", itemsToDelete)

  for (const itemHid of itemsToDelete) {
    try {
      await axios.delete(`http://localhost/api/hazarddata/delete/${itemHid}`)
      hazardData.value = hazardData.value.filter(item => item.hid !== itemHid)
    } catch (error) {
      console.error(`HID ${itemHid} 항목을 삭제하는 중 오류가 발생했습니다:`, error)
    }
  }
  // 데이터만 다시 불러옴
  fetchHazardData()
}
</script>

<style scoped>
.custom-card {
  margin: 0 auto;
  height: 90%;
  width: 90%;
}

.table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

.thead-dark th {
  background-color: #212631;
  color: #ffffff;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #ddd;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 8px;
}

.table tbody tr:hover {
  cursor: pointer;
  background-color: #f5f5f5;
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

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.5rem;
  color: #888;
}
</style>
