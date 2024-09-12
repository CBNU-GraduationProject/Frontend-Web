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
                  <!-- 검색 입력 필드 -->
                  <div class="form-group" style="width: 30%;">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="검색어를 입력하세요..." 
                      v-model="searchQuery"
                    />
                  </div>
                </CCardHeader>
                <CCardBody>
                  <div v-if="isLoading" class="text-center">
                    <span>로딩 중...</span> <!-- 로딩 표시 -->
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
                          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
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
          <!-- 모달 창 -->
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

const hazardData = ref([])  // 데이터 저장용 ref 변수
const isLoading = ref(true) // 로딩 상태 관리
const showModal = ref(false)  // 모달 표시 여부
const modalImage = ref('')  // 모달에 표시될 이미지 URL
const searchQuery = ref('')  // 검색어 저장 변수

// 페이지네이션 상태 관리
const currentPage = ref(1)  // 현재 페이지
const itemsPerPage = ref(10)  // 한 페이지에 보여줄 아이템 수
const totalPages = computed(() => Math.ceil(filteredHazardData.value.length / itemsPerPage.value))  // 총 페이지 수

// 이전 페이지로 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 다음 페이지로 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost/api/hazarddata')  // API 호출
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

// 페이지네이션 적용된 데이터 계산
const paginatedHazardData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHazardData.value.slice(start, end)
})

// 이미지 모달을 표시하는 함수
const showImageModal = async (item) => {
  try {
    const response = await axios.get(`http://localhost/api/hazarddata/photo/${item.hid}`, { responseType: 'blob' })
    const imageUrl = URL.createObjectURL(response.data)
    modalImage.value = imageUrl
    showModal.value = true
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

// 모달 창을 닫는 함수
const closeModal = () => {
  showModal.value = false
  modalImage.value = ''
}

// 컴포넌트가 마운트될 때 데이터 불러오기
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

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.5rem;
  color: #888;
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
