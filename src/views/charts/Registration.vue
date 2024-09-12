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
import { ref } from 'vue';
import axios from 'axios';
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';

const form = ref({
  hazardType: '',
  dates: '',
  hazardImage: null,
  gps: '',
  state: '조치완료'
});

const showModal = ref(false);

const handleFileChange = (event) => {
  form.value.hazardImage = event.target.files[0];
};

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
      formData.append('dates', new Date(form.value.dates).toISOString().slice(0, 19));

      const response = await axios.post('http://localhost/api/hazarddata/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form submitted', response.data);
      alert('위험물이 등록되었습니다.');

      // 폼 초기화
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

.form-control {
  box-shadow: inset 0px 0px 1px 0.1px rgba(0, 0, 0, 0.2);
  width: 100%;
}

#title-input {
  width: 20%;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style>
