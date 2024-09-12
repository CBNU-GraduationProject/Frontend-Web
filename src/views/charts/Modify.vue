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
                  <h4 class="card-title">위험물 수정</h4>
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
                    <span>로딩 중...</span>
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
                          <th>수정</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in paginatedData" :key="index">
                          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                          <td>{{ item.hazardType }}</td>
                          <td>{{ item.gps }}</td>
                          <td>{{ item.state }}</td>
                          <td>{{ item.dates }}</td>
                          <td>
                            <button @click="openEditModal(item)" class="btn btn-outline-primary">수정</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Pagination Controls -->
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
          
          <!-- Edit Modal -->
          <CModal :visible="showEditModal" @update:visible="val => showEditModal.value = val">
            <CModalHeader>
              <h4>위험물 수정</h4>
            </CModalHeader>
            <CModalBody>
              <div class="form-group">
                <label for="hazardType">위험물 정보</label>
                <input v-model="currentItem.hazardType" type="text" id="hazardType" class="form-control" />
              </div>
              <div class="form-group">
                <label for="state">상태</label>
                <select class="form-control" id="state-input" v-model="currentItem.state">
                  <option value="조치완료">조치완료</option>
                  <option value="조치중">조치중</option>
                  <option value="미조치">미조치</option>
                </select>
              </div>
            </CModalBody>
            <CModalFooter>
              <button type="button" class="btn btn-secondary" @click="closeEditModal">닫기</button>
              <button type="button" class="btn btn-primary" @click="saveChanges">저장</button>
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
import AppHeader from '@/componaents/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const hazardData = ref([])  // 데이터 저장용 ref 변수
const isLoading = ref(true) // 로딩 상태 관리
const showEditModal = ref(false)  // 수정 모달 표시 여부
const currentItem = ref({})  // 현재 수정 중인 항목
const searchQuery = ref('')  // 검색어 저장 변수

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost/api/hazarddata')  // API 호출
    hazardData.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
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

// Calculate pagination
const totalPages = computed(() => Math.ceil(filteredHazardData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredHazardData.value.slice(start, end)
})

// Pagination controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 수정 모달 열기 함수
const openEditModal = (item) => {
  currentItem.value = { ...item }
  showEditModal.value = true
}

// 수정 모달 닫기 함수
const closeEditModal = () => {
  showEditModal.value = false
  currentItem.value = {}
}

// 변경 사항 저장 함수
const saveChanges = async () => {
  try {
    await axios.put(`http://localhost/api/hazarddata/update/${currentItem.value.hid}`, currentItem.value)
    const index = hazardData.value.findIndex(item => item.hid === currentItem.value.hid)
    if (index !== -1) {
      hazardData.value[index] = { ...currentItem.value }
    }
    closeEditModal()
  } catch (error) {
    console.error('수정 중 오류가 발생했습니다:', error.response ? error.response.data : error.message)
  }
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
