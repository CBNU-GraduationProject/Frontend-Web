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
                  <h4 class="card-title">신고 내역 관리</h4>
                  <div class="d-flex align-items-center">
                    <input type="text" class="form-control" placeholder="검색어를 입력하세요..." v-model="searchQuery" />&nbsp;&nbsp;&nbsp;
                    <input type="date" class="form-control" v-model="startDate" /> &nbsp;~&nbsp;
                    <input type="date" class="form-control" v-model="endDate" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                          <th style="width: 5%;">ID</th>
                          <th style="width: 25%;">위험물 정보</th>
                          <th style="width: 20%;">GPS 좌표</th>
                          <th style="width: 25%;">날짜</th>
                          <th style="width: 8%;">승인</th>
                          <th style="width: 8%;">반려</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(report, index) in paginatedReports" :key="index" >
                          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                          <td @click="showImageModal(report)">{{ report.description }}</td>
                          <td>{{ report.latitude }}, {{ report.longitude }}</td>
                          <td>{{ report.createdAt }}</td>
                          <td><button class="승인" @click="approveReport(report)">승인</button></td>
                          <td><button class="반려" @click="rejectReport(report.id)">반려</button></td>
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
          <!-- 모달 창 -->
          <CModal :visible="showModal" @update:visible="val => showModal.value = val">
            <CModalHeader :closeButton="false">
              <h4>신고 이미지</h4>
            </CModalHeader>
            <CModalBody>
              <img :src="modalImage" alt="신고 이미지" class="img-fluid" loading="lazy" />
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';

const reports = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const showModal = ref(false);
const modalImage = ref('');

const currentPage = ref(1);
const itemsPerPage = 10;  // 페이지당 항목 수 고정

const reportsApiUrl = "https://kickapp-dubydbancaath2e2.koreacentral-01.azurewebsites.net/api/reports";

// 신고 내역을 불러오고 각 report에 이미지 URL을 추가
const fetchReports = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(reportsApiUrl);
    
    // response.data에는 "반려" 상태인 신고만 포함되어 있음
    reports.value = response.data.map(report => ({
      id: report.id,
      description: report.description,
      latitude: report.latitude,
      longitude: report.longitude,
      createdAt: report.createdAt,
      imageUrl: `data:image/jpeg;base64,${report.image}`
    }));
  } catch (error) {
    console.error("신고 내역 조회 오류:", error);
    alert("신고 내역을 불러오는 데 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
};

// 검색 및 날짜 필터링된 데이터 계산
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const matchesSearch = report.description.includes(searchQuery.value);
    const isWithinDateRange = (!startDate.value || new Date(report.createdAt) >= new Date(startDate.value)) &&
                              (!endDate.value || new Date(report.createdAt) <= new Date(endDate.value));
    return matchesSearch && isWithinDateRange;
  });
});

// 페이지네이션이 적용된 데이터
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReports.value.slice(start, end);
});

// 모달에 이미지 표시 함수
const showImageModal = (report) => {
  modalImage.value = report.imageUrl;
  showModal.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
  modalImage.value = '';
};

// 총 페이지 수 계산
const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage));

// 페이지 이동 함수
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// 신고 승인 함수
const approveReport = async (report) => {
  const approveApiUrl = `${reportsApiUrl}/${report.id}/approve`; // 해당 신고 내역 ID로 승인 요청
  
  try {
    await axios.post(approveApiUrl, null, { headers: { 'Content-Type': 'application/json' } });
    alert("신고가 승인되었습니다.");

    // 승인된 항목을 리스트에서 제거
    const approvedIndex = reports.value.findIndex(r => r.id === report.id);
    if (approvedIndex !== -1) {
      reports.value.splice(approvedIndex, 1);
    }
  } catch (error) {
    console.error("승인 오류:", error);
    alert("승인 중 오류가 발생했습니다.");
  }
};



// 신고 반려 함수
const rejectReport = async (id) => {
  try {
    await axios.delete(`${reportsApiUrl}/${id}`, { headers: { 'Content-Type': 'application/json' } });
    alert("신고가 반려되었습니다.");
    // 반려된 항목만 제거
    reports.value = reports.value.filter(r => r.id !== id);
  } catch (error) {
    console.error("반려 오류:", error);
    alert("반려 중 오류가 발생했습니다.");
  }
};

onMounted(fetchReports);
</script>


<style scoped>
.승인 {
  background-color: #25ac45;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.반려 {
  background-color: #f33f51dd;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.custom-card {
  margin: 0 auto;
  border-radius: 1rem;
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
  text-align: center;
  margin-top: 1rem;
}
.pagination-controls button {
  margin: 0 10px;
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
