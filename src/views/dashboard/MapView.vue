<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1 position-relative">
        <CContainer class="px-4" lg>
          <!-- 지도 -->
          <div id="map" class="map-background"></div>

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
                      <!-- 로딩 상태에 따라 로딩 메시지 또는 테이블을 표시 -->
                      <div v-if="isLoading" class="loading-message">
                        로딩 중...
                      </div>
                      <table v-else class="table table-hover table-bordered mt-0">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Date</th>
                            <th>GPS</th>
                            <th>Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(risk, index) in risks" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ risk.dates }}</td>
                            <td>{{ risk.gps }}</td>
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
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { CContainer, CRow, CCol, CCard, CCardBody } from '@coreui/vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import completeMarker from '../../assets/image/조치 완료.png';
import inProgressMarker from '../../assets/image/조치중.png';
import notStartedMarker from '../../assets/image/미조치.png';

// Reactive state
const risks = ref([]);
const map = ref(null);
const isLoading = ref(true); // 로딩 상태를 관리하는 변수

// On component mount
onMounted(() => {
  fetchHazardData();
  if (window.kakao && window.kakao.maps) {
    loadMap();
  } else {
    loadScript();
  }
});

// Load Kakao Maps script
function loadScript() {
  const script = document.createElement("script");
  script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=82cbd113a946e9eaacfc294fdea74478"; // autoload=false로 변경
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
    addMarkers(); // 마커를 추가하는 메서드 호출
  } else {
    console.error("Map container not found");
  }
}

// Add markers to the map
function addMarkers() {
  if (map.value) {
    risks.value.forEach(risk => {
      let imageSrc;
      if (risk.state === '조치 완료') {
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
    });
  }
}

// Fetch hazard data from the server
async function fetchHazardData() {
  try {
    const response = await axios.get('http://localhost/api/hazarddata');
    risks.value = response.data;
    addMarkers(); // 데이터를 가져온 후 마커를 갱신
  } catch (error) {
    console.error("There was an error fetching the hazard data:", error);
  } finally {
    isLoading.value = false; // 데이터를 모두 불러온 후 로딩 상태를 false로 변경
  }
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.overlay-content {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
  width: 35%; /* 너비를 %로 설정하여 화면 크기에 맞게 유동적으로 조정 */
  max-width: 500px; /* 최대 너비를 제한 */
  min-width: 300px; /* 최소 너비를 설정 */
}

.risk-list-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container {
  max-height: 400px; /* 원하는 테이블 높이로 조정 */
  overflow-y: auto; /* 테이블이 넘칠 경우 세로 스크롤을 활성화 */
  flex-grow: 1; /* 테이블 크기가 카드 높이에 맞춰 동적으로 변함 */
}

.table {
  width: 100%; /* 테이블 너비가 부모 요소에 맞게 동적으로 조정 */
  border-collapse: collapse;
  min-width: 300px; /* 최소 너비를 설정하여 테이블의 가독성을 유지 */
  max-width: 100%; /* 최대 너비를 설정하여 화면을 넘어가지 않도록 제한 */
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: nowrap; /* 텍스트가 칸 안에서 줄 바꿈되지 않도록 설정 */
}

th {
  background-color: #212631;
  color: #ffffff;
}

.loading-message {
  text-align: center;
  font-size: 1.5rem;
  padding: 20px;
  color: #888;
}
</style>
