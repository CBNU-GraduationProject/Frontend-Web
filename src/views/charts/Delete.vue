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
                  <div class="d-flex justify-content-between align-items-center" >
                    <input  
                      type="text" 
                      class="form-control" 
                      placeholder="검색어를 입력하세요..." 
                      v-model="searchQuery"
                    />&nbsp;&nbsp;&nbsp;
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="startDate"
                    />&nbsp;~&nbsp;
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="endDate"
                    />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button type="button" class="update-btn1" @click="selectAll" style="width: 50%;">
                      전체 선택
                    </button>
                    <button type="button" class="update-btn2" @click="deleteSelectedItems">
                      <img src="@/assets/image/delete.png" alt="삭제" class="delete-icon" />
                    </button>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <div v-if="isLoading" class="skeleton-loader">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
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
                        <tr v-for="(item, index) in paginatedHazardData" :key="index" @click="showImageModal(item)">
                          <td class="checkbox-cell">
                            <input type="checkbox" v-model="item.selected" />
                          </td>
                          <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td>
                          <td>{{ item.hazardType }}</td>
                          <td>{{ item.gps }}</td>
                          <td>{{ item.state }}</td>
                          <td>{{ item.dates }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- 페이지네이션 버튼 -->
                    <div class="pagination-controls">
                      <button class="btn btn-outline-secondary" :disabled="currentPage === 1" @click="prevPage">이전</button>
                      <span>{{ currentPage }} / {{ totalPages }}</span>
                      <button class="btn btn-outline-secondary" :disabled="currentPage === totalPages" @click="nextPage">다음</button>
                    </div>
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
const startDate = ref('')  // 시작 날짜 저장 변수
const endDate = ref('')  // 종료 날짜 저장 변수
const isLoading = ref(true)  // 로딩 상태 관리
const apiUrl = import.meta.env.VITE_APP_API_URL;  // 환경 변수에서 API URL 가져오기

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true;
    const response = await axios.get(`${apiUrl}/api/hazarddata`)  // API 호출

    // 데이터에 'no' 속성 추가
    hazardData.value = response.data.map((item, index) => ({
      ...item,
      no: item.no !== undefined ? item.no : index + 1 // 'no' 속성이 없으면 index 사용
    }));

    isLoading.value = false;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
    isLoading.value = false;
  }
}


// 페이지네이션 상태 관리
const currentPage = ref(1)  // 현재 페이지
const itemsPerPage = ref(10)  // 한 페이지에 보여줄 아이템 수
const totalPages = computed(() => Math.ceil(filteredHazardData.value.length / itemsPerPage.value))  // 총 페이지 수

// 페이지네이션 이동 함수
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchHazardData() // 페이지 이동 시 데이터 호출
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchHazardData() // 페이지 이동 시 데이터 호출
  }
}

// 페이지네이션 적용된 데이터 계산
const paginatedHazardData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHazardData.value.slice(start, end)
})

// 필터링된 데이터 계산
const filteredHazardData = computed(() => {
  return hazardData.value.filter(item => {
    const matchesSearch = item.hazardType.includes(searchQuery.value) || 
                          item.gps.includes(searchQuery.value) || 
                          item.state.includes(searchQuery.value) || 
                          item.dates.includes(searchQuery.value);
    
    const isWithinDateRange = (!startDate.value || new Date(item.dates) >= new Date(startDate.value)) &&
                              (!endDate.value || new Date(item.dates) <= new Date(endDate.value));
    
    return matchesSearch && isWithinDateRange;
  })
})

onMounted(() => {
  fetchHazardData()
})

// 선택된 항목 삭제 함수
async function deleteSelectedItems() {
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
      await axios.delete(`${apiUrl}/api/hazarddata/delete/${itemHid}`)
      hazardData.value = hazardData.value.filter(item => item.hid !== itemHid)
    } catch (error) {
      console.error(`HID ${itemHid} 항목을 삭제하는 중 오류가 발생했습니다:`, error)
    }
  }
  // 데이터만 다시 불러옴
  fetchHazardData()
}

// 전체 선택 함수
function selectAll() {
  const allSelected = paginatedHazardData.value.every(item => item.selected);
  paginatedHazardData.value.forEach(item => item.selected = !allSelected);
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


.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 8px;
}


.checkbox-cell {
  text-align: center;
}

.update-btn1 {
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 4px;
  
}
.update-btn2 {
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
}
 .update-btn1:hover  {
   background-color: #d1d1d1;
 }
 .update-btn2:hover  {
   background-color: #d1d1d1;
 }



.delete-icon {
  width: 30px;
  height: 30px;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.5rem;
  color: #888;
}
/* Skeleton Loader Styles */
.skeleton-loader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.skeleton-line {
  width: 100%;
  height: 1.2rem;
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-loading 1s infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #c0c0c0;
  }
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination-controls button {
  margin: 0 10px;
}
</style>
