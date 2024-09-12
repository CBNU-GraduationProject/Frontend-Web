<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/vue'
import { Chart, registerables } from 'chart.js'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

Chart.register(...registerables)

const hazardData = ref([])  // 데이터 저장용 ref 변수
const isLoading = ref(true) // 로딩 상태 관리
const searchQuery = ref('')  // 검색어 저장 변수

const statusChartInstance = ref(null) // 조치 상태 차트 인스턴스
const typeChartInstance = ref(null) // 위험물 종류 차트 인스턴스
const dateChartInstance = ref(null) // 날짜별 데이터 차트 인스턴스

// 데이터를 서버로부터 불러오는 함수
async function fetchHazardData() {
  try {
    isLoading.value = true;
    const response = await axios.get('http://localhost/api/hazarddata')
    hazardData.value = response.data
    isLoading.value = false

    // 차트를 초기화하고 다시 그리는 함수 호출
    updateCharts()

  } catch (error) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다:", error)
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

// 차트를 그리는 함수 (조치 상태)
function renderStatusChart(data) {
  const ctx = document.getElementById('statusChart').getContext('2d')
  if (statusChartInstance.value) {
    statusChartInstance.value.destroy()
  }

  // 상태별 데이터 개수 계산
  // 상태별 데이터 개수 계산
const statusCount = {
  미조치: data.filter(item => item.state === '미조치').length,
  조치중: data.filter(item => item.state === '조치중').length,
  조치완료: data.filter(item => item.state === '조치완료').length, // 공백 수정
}


  statusChartInstance.value = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['미조치', '조치중', '조치완료'],
      datasets: [{
        data: [statusCount['미조치'], statusCount['조치중'], statusCount['조치완료']],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }]
    }
  })
}

// 차트를 그리는 함수 (위험물 종류)
function renderTypeChart(data) {
  const ctx = document.getElementById('typeChart').getContext('2d')
  if (typeChartInstance.value) {
    typeChartInstance.value.destroy()
  }

  const typeCount = {}
  data.forEach(item => {
    typeCount[item.hazardType] = (typeCount[item.hazardType] || 0) + 1
  })

  typeChartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(typeCount),
      datasets: [{
        label: '위험물 종류',
        data: Object.values(typeCount),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// 차트를 그리는 함수 (날짜별 데이터)
function renderDateChart(data) {
  const ctx = document.getElementById('dateChart').getContext('2d')
  if (dateChartInstance.value) {
    dateChartInstance.value.destroy()
  }

  const dateCount = {}
  data.forEach(item => {
    const date = item.dates.split(' ')[0] // 날짜 부분만 추출
    dateCount[date] = (dateCount[date] || 0) + 1
  })

  dateChartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(dateCount),
      datasets: [{
        label: '날짜별 등록 수',
        data: Object.values(dateCount),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        fill: true
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// 차트를 업데이트하는 함수
function updateCharts() {
  if (!isLoading.value && filteredHazardData.value.length) {
    renderStatusChart(filteredHazardData.value)
    renderTypeChart(filteredHazardData.value)
    renderDateChart(filteredHazardData.value)
  }
}

// 컴포넌트가 마운트될 때 데이터 불러오기
onMounted(() => {
  fetchHazardData()
})
</script>

<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <!-- 차트와 테이블을 한 페이지에 4개 모두 보이도록 레이아웃 설정 -->
          <CRow class="chart-row">
            <CCol md="6" class="chart-col">
              <CCard class="custom-card">
                <CCardHeader>
                  <h4 class="card-title">위험물 종류 차트</h4>
                </CCardHeader>
                <CCardBody>
                  <canvas id="typeChart"></canvas>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md="6" class="chart-col">
              <CCard class="custom-card">
                <CCardHeader>
                  <h4 class="card-title">날짜별 데이터 차트</h4>
                </CCardHeader>
                <CCardBody>
                  <canvas id="dateChart"></canvas>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md="6" class="chart-col">
              <CCard class="custom-card">
                <CCardHeader>
                  <h4 class="card-title">조치 상태 차트</h4>
                </CCardHeader>
                <CCardBody style="width: 80%; height: 80%">
                  <canvas id="statusChart"></canvas>
                </CCardBody>
              </CCard>
            </CCol>

            

            <CCol md="6" class="chart-col">
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
                        <tr v-for="(item, index) in filteredHazardData" :key="index" @click="showImageModal(item)">
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

<style scoped>
.custom-card {
  margin: 0 auto;
  width: 100%;
  height: 100%;
}

.chart-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.chart-col {
  padding: 0.5rem;
  flex: 1 1 calc(50% - 1rem); /* 2개씩 가로로 배치 */
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
</style>
