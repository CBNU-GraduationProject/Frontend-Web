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
                      v-model="form.위험물명"
                    />
                  </div>
                  <div class="form-group">
                    <label for="date-input">날짜</label>
                    <input
                      type="date"
                      class="form-control"
                      id="date-input"
                      v-model="form.날짜"
                    />
                  </div>
                  <div class="form-group">
                    <label for="description-input">위험물 상세 정보</label>
                    <textarea
                      class="form-control"
                      id="description-input"
                      rows="11"
                      placeholder="위험물설명 입력"
                      v-model="form.위험물설명"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label for="file-input">위험물 이미지</label>
                    <input
                      type="file"
                      class="form-control"
                      id="file-input"
                      @change="e => form.위험물이미지 = e.target.files[0]"
                    />
                  </div>
                  <div class="text-right">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      @click="submitForm"
                    >
                      위험물 등록
                    </button>&nbsp;
                    <button type="button" class="btn btn-secondary">
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
import { ref } from 'vue'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const form = ref({
  위험물명: '',
  날짜: '',
  위험물설명: '',
  위험물이미지: null
})

const showModal = ref(false)

const submitForm = () => {
  if (!form.value.위험물명 || !form.value.날짜 || !form.value.위험물설명 || !form.value.위험물이미지) {
    showModal.value = true
  } else {
    // 데이터베이스 등록 로직 추가 필요
    console.log('Form submitted', form.value)
  }
}

const closeModal = () => {
  showModal.value = false
}
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
