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
                  <h4 class="card-title">위험물 리스트</h4>
                  <div class="d-flex justify-content-between align-items-center">
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
                  </div>
                </CCardHeader>
                <CCardBody>
                  <!-- Skeleton Loader -->
                  <div v-if="isLoading" class="skeleton-loader">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                  </div>
                  <div v-else>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>위험물 정보</th>
                          <th>GPS 좌표</th>
                          <th>상태</th>
                          <th>날짜</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in paginatedHazardData" :key="index" @click="showImageModal(item)">
                          <td>{{ (currentPage - 1) * itemsPerPage + (index + 1) }}</td> <!-- ID 계산 -->
                          <td>{{ item.hazardType }}</td>
                          <td>{{ item.gps }}</td>
                          <td>{{ item.state }}</td>
                          <td>{{ item.dates }}</td>
                        </tr>
                      </tbody>
                    </table>
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
          <CModal :visible="showModal" @update:visible="val => showModal.value = val">
            <CModalHeader :closeButton="false">
              <h4>위험물 이미지</h4>
            </CModalHeader>
            <CModalBody>
              <img :src="modalImage" alt="위험물 이미지" class="img-fluid" />
            </CModalBody>
            <CModalFooter>
              <button type="button" class="btn btn-primary" @click="closeModal">
                닫기
              </button>
            </CModalFooter>
          </CModal>
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const hazardData = ref([])
const isLoading = ref(true)
const startDate = ref('')
const endDate = ref('')
const showModal = ref(false)
const modalImage = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const apiUrl = import.meta.env.VITE_APP_API_URL

const totalPages = computed(() => Math.ceil(filteredHazardData.value.length / itemsPerPage.value))

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

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true;
    const response = await axios.get(`${apiUrl}/api/hazarddata`)  // API 호출
    hazardData.value = response.data.map((item, index) => ({
      ...item,
      no: item.no !== undefined ? item.no : index + 1 // 'no' 속성이 없으면 index 사용
    }));
    isLoading.value = false;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error)
    isLoading.value = false;
  }
}

const filteredHazardData = computed(() => {
  return hazardData.value.filter(item => {
    const matchesSearch = item.hazardType.includes(searchQuery.value) || 
                          item.gps.includes(searchQuery.value) || 
                          item.state.includes(searchQuery.value) || 
                          item.dates.includes(searchQuery.value)

    const isWithinDateRange = (!startDate.value || new Date(item.dates) >= new Date(startDate.value)) &&
                              (!endDate.value || new Date(item.dates) <= new Date(endDate.value))

    return matchesSearch && isWithinDateRange
  })
})

const paginatedHazardData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHazardData.value.slice(start, end)
})

// 지연 로딩으로 이미지 불러오기
const showImageModal = async (item) => {
  try {
    const response = await axios.get(`${apiUrl}/api/hazarddata/photo/${item.hid}`, { responseType: 'blob' })
    const imageUrl = URL.createObjectURL(response.data)
    modalImage.value = imageUrl
    showModal.value = true
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

// 모달 닫기
const closeModal = () => {
  showModal.value = false
  modalImage.value = ''
}

onMounted(() => {
  fetchHazardData()
})
</script>

<style scoped>
.custom-card {
  margin: 0 auto 50px;
  height: 90%;
  width: 90%;
}

.table {
  width: 100%;
  margin-top: 1rem;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.table tbody tr:hover {
  cursor: pointer;
  background-color: #f5f5f5;
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
