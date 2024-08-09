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
                      <table class="table table-hover table-bordered mt-3">
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

// Reactive state
const risks = ref([]);
const map = ref(null);

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
      const markerPosition = new window.kakao.maps.LatLng(
        parseFloat(risk.gps.split(',')[0]),
        parseFloat(risk.gps.split(',')[1])
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
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
  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  height: 100vh;
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
  width: 35%; /* 필요한 경우 크기를 조정할 수 있습니다 */
}

.risk-list-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden; /* 테이블 컨테이너가 카드의 경계를 벗어나지 않도록 함 */
}

.table-container {
  max-height: 400px; /* 원하는 테이블 높이로 조정 */
  overflow-y: auto; /* 테이블이 넘칠 경우 세로 스크롤을 활성화 */
}

.table {
  width: 100%;
  border-collapse: collapse;
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
  background-color: #212631;
}
</style>
