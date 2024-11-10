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
                <CCardHeader>
                  <h4 class="card-title">위험물 등록</h4>
                </CCardHeader>
                <CCardBody>
                  <!-- 기타 입력 폼 -->
                  <div class="form-group">
                    <label for="title-input">위험물 정보</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title-input"
                      placeholder="위험물명 입력"
                      v-model="form.hazardType"
                    />
                  </div>
                  <div class="form-group">
                    <label for="date-input">날짜</label>
                    <input
                      type="date"
                      class="form-control"
                      id="date-input"
                      v-model="form.dates"
                    />
                  </div>
                  <div class="form-group">
                    <label for="file-input">위험물 이미지</label>
                    <input
                      type="file"
                      class="form-control"
                      id="file-input"
                      @change="handleFileChange"
                    />
                  </div>

                  <!-- GPS 입력 필드 및 지도 추가 -->
                  <div class="form-group">
                    <label for="gps-input">GPS 좌표</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gps-input"
                      placeholder="GPS 좌표 입력 (예: 37.7749,-122.4194)"
                      v-model="form.gps"
                    />
                  </div>
                  <div id="map" class="map"></div> <!-- 카카오맵 추가 -->

                  <div class="form-group">
                    <label for="state-input">상태</label>
                    <select
                      class="form-control"
                      id="state-input"
                      v-model="form.state"
                    >
                      <option value="조치 완료">조치완료</option>
                      <option value="조치중">조치중</option>
                      <option value="미조치">미조치</option>
                    </select>
                  </div>
                  <div class="text-right">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="submitForm"
                    >
                      위험물 등록
                    </button>&nbsp;
                    <button type="button" class="btn btn-secondary" @click="resetForm">
                      취소
                    </button>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CModal :visible="showModal" @update:visible="val => showModal.value = val">
            <CModalHeader>
              <h4>입력 오류</h4>
            </CModalHeader>
            <CModalBody>
              모든 입력 필드를 작성해 주세요.
            </CModalBody>
            <CModalFooter>
              <button type="button" class="btn btn-primary" @click="closeModal">
                확인
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
const apiUrl = import.meta.env.VITE_APP_API_URL;
const form = ref({
  hazardType: '',
  dates: '',
  hazardImage: null,
  gps: '',
  state: '조치완료'
});

const showModal = ref(false);

const handleFileChange = (event) => {
  form.value.hazardImage = event.target.files[0];//base64
};


onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new window.kakao.maps.LatLng(36.6280, 127.4565), // 기본 좌표 설정 (서울시청)
      level: 3,
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption);

    window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      const latlng = mouseEvent.latLng;

      // 소수점 4자리로 제한
      const lat = latlng.getLat().toFixed(4);
      const lng = latlng.getLng().toFixed(4);

      form.value.gps = `${lat},${lng}`; // 클릭한 위치의 GPS 좌표를 소수점 4자리로 자동 설정
    });
  } else {
    console.error("카카오맵 API가 로드되지 않았습니다.");
  }
});



const submitForm = async () => {
  if (!form.value.hazardType || !form.value.dates || !form.value.hazardImage || !form.value.gps || !form.value.state) {
    showModal.value = true;
  } else {
    try {
      const formData = new FormData();
      formData.append('hazardType', form.value.hazardType);
      formData.append('photo', form.value.hazardImage);
      formData.append('gps', form.value.gps);
      formData.append('state', form.value.state);

      // 날짜 설정
      const selectedDate = new Date(form.value.dates);
      const currentTime = new Date();
      selectedDate.setHours(currentTime.getHours() + 9); // 한국 시간 맞추기

      formData.append('dates', selectedDate.toISOString().slice(0, 19));

      // API 요청
      const response = await axios.post(`${apiUrl}/api/hazarddata/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form submitted', response.data);
      alert('위험물이 등록되었습니다.');

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
    }
  }
};


const closeModal = () => {
  showModal.value = false;
};

const resetForm = () => {
  form.value = {
    hazardType: '',
    dates: '',
    hazardImage: null,
    gps: '',
    state: '조치완료',
  };
};
</script>

<style scoped>
.custom-card {
  margin: 0 auto;
  height: 90%;
  width: 90%;
}

.map {
  width: 100%;
  height: 300px;
  margin-top: 1rem;
}

.form-control {
  box-shadow: inset 0px 0px 1px 0.1px rgba(0, 0, 0, 0.2);
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style>
