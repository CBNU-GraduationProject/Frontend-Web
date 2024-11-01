<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1 position-relative">
        <CContainer class="px-4" lg>
          <!-- 지도 -->
          <div id="map" class="map-background"></div>

          <!-- 포트홀 상태 필터 -->
          <div class="filter-container">
            <label>
              <input type="radio" value="all" v-model="selectedStatus" @change="filterRisks" /> 전체
            </label>
            <label>
              <input type="radio" value="미조치" v-model="selectedStatus" @change="filterRisks" /> 미조치
            </label>
            <label>
              <input type="radio" value="조치중" v-model="selectedStatus" @change="filterRisks" /> 조치중
            </label>
            <label>
              <input type="radio" value="조치완료" v-model="selectedStatus" @change="filterRisks" /> 조치완료
            </label>
          </div>

          <!-- 위험물 리스트 -->
          <CRow class="overlay-content">
            <CCol>
              <CCard class="risk-list-card">
                <CCardBody>
                  <CRow>
                    <CCol :sm="12">
                      <h4 id="list" class="card-title mb-0">위험물 리스트</h4>
                    </CCol>
                  </CRow>
                  <CRow>
                    <div class="table-container">
                      <div v-if="isLoading" class="loading-message">
                        로딩 중...
                      </div>
                      <table v-else class="table table-hover table-bordered mt-0">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Date</th>
                            <th>Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(risk, index) in filteredRisks"
                            :key="index"
                            @click="openModal(risk)">
                            <td>{{ index + 1 }}</td>
                            <td>{{ risk.dates }}</td>
                            <td>{{ risk.hazardType }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <!-- 모달 창 -->
      <CModal :visible="showModal" @update:visible="val => showModal.value = val" @click="showImageModal(item)">
        <CModalHeader :closeButton="false">
          <h4>상세 정보</h4>
        </CModalHeader>
        <CModalBody>
          <p><strong>위험물 :</strong> {{ selectedRisk?.hazardType }}</p>
          <p><strong>위치 :</strong> {{ selectedRisk?.gps }}</p>
          <p><strong>날짜 :</strong> {{ selectedRisk?.dates }}</p>
          <p><strong>상태 :</strong> {{ selectedRisk?.state }}</p>
          <p><strong>사진 정보 :</strong></p>
          
          <img :src="modalImage" alt="위험물 이미지" class="img-fluid" />
        </CModalBody>
        
        <CModalFooter>
          <button type="button" class="btn btn-primary" @click="closeModal">닫기</button>
        </CModalFooter>
      </CModal>

      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { CContainer, CRow, CCol, CCard, CCardBody, CModal } from '@coreui/vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import completeMarker from '../../assets/image/조치 완료.png';
import inProgressMarker from '../../assets/image/조치중.png';
import notStartedMarker from '../../assets/image/미조치.png';

// Reactive state
const risks = ref([]);
const filteredRisks = ref([]);
const map = ref(null);
const markers = ref([]);
const isLoading = ref(true);
const kakaoApiKey = import.meta.env.VITE_APP_KAKAOMAP_API_KEY;
const selectedStatus = ref("all"); // 필터 상태 저장
const selectedRisk = ref(null); // 선택된 위험물의 세부 정보
const showModal = ref(false); // 모달 초기값 설정
const modalImage = ref('')  // 모달에 표시될 이미지 URL
// On component mount
onMounted(() => {
  fetchHazardData();
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});

// Show modal with risk details
function openModal(risk) {
  selectedRisk.value = risk;
  showModal.value = true; // 모달 열기

  // 이미지 모달 표시
  showImageModal(risk); // risk를 item으로 전달
}

// 이미지 모달을 표시하는 함수
const showImageModal = async (item) => {
  if (!item || !item.hid) {
    console.error('Invalid item:', item);
    return; // item이 유효하지 않으면 함수 종료
  }

  try {
    const response = await axios.get(`http://localhost/api/hazarddata/photo/${item.hid}`, { responseType: 'blob' });
    const imageUrl = URL.createObjectURL(response.data);
    modalImage.value = imageUrl;
    showModal.value = true;
  } catch (error) {
    console.error('Error fetching image:', error);
  }
};


// Close modal
function closeModal() {
  selectedRisk.value = null;
  showModal.value = false; // 모달 닫기
}

// Load Kakao Maps script
function loadScript() {
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
  script.onload = () => {
    window.kakao.maps.load(() => {
      loadMap();
    });
  };
  document.head.appendChild(script);
}

// Initialize map
function loadMap() {
  const container = document.getElementById("map");
  if (container) {
    const options = {
      center: new window.kakao.maps.LatLng(36.6280, 127.4565),
      level: 4
    };

    map.value = new window.kakao.maps.Map(container, options);
    addMarkers();
  } else {
    console.error("Map container not found");
  }
}

// Add markers to the map
function addMarkers() {
  markers.value.forEach(marker => marker.setMap(null)); // 기존 마커 제거
  markers.value = [];

  risks.value
    .filter(risk => selectedStatus.value === "all" || risk.state === selectedStatus.value)
    .forEach(risk => {
      let imageSrc;
      if (risk.state === '조치완료') {
        imageSrc = completeMarker;
      } else if (risk.state === '조치중') {
        imageSrc = inProgressMarker;
      } else if (risk.state === '미조치') {
        imageSrc = notStartedMarker;
      }

      const imageSize = new window.kakao.maps.Size(32, 34);
      const imageOption = { offset: new window.kakao.maps.Point(16, 34) };

      const markerPosition = new window.kakao.maps.LatLng(
        parseFloat(risk.gps.split(',')[0]),
        parseFloat(risk.gps.split(',')[1])
      );

      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage
      });

      marker.setMap(map.value);
      marker.addListener("click", () => openModal(risk));
      markers.value.push(marker);
    });
}

// Fetch hazard data from the server
async function fetchHazardData() {
  try {
    const response = await axios.get('http://localhost/api/hazarddata');
    risks.value = response.data;
    filterRisks();
  } catch (error) {
    console.error("There was an error fetching the hazard data:", error);
  } finally {
    isLoading.value = false;
  }
}

// Filter risks by selected status
function filterRisks() {
  filteredRisks.value = risks.value.filter(risk => selectedStatus.value === "all" || risk.state === selectedStatus.value);
  addMarkers(); // 필터에 따라 마커 갱신
}
</script>

<style scoped>
.wrapper {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-background {
  position: absolute;
  top: -15px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.filter-container {
  position: absolute;
  color: #000000;
  left: 20px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
}

.overlay-content {
  position: absolute;
  right: 30px;
  z-index: 1;
  width: 100%;
  max-width: 54vh;
  min-width: 50vh;
}

.risk-list-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
}

.table-container {
  max-height: 20vh;
  overflow-x: auto;
  flex-grow: 1;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 0%;
}

.table th,
.table td {
  text-align: center;
  padding: 8px;
}

.loading-message {
  text-align: center;
  font-size: 1.2em;
  margin: 20px;
}

.hazard-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>
