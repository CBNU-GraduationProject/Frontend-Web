<template>
    <div class="signup-container">
      <CContainer>
        <CRow class="justify-content-center align-items-center">
          <CCol md="5">
            <CCardGroup>
              <CCard class="p-4">
                <CCardBody>
                  <CForm @submit.prevent="handleSignup">
                    <h1>Sign Up</h1>
                    <p class="text-body-secondary">Create a new account</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                        v-model="username"
                        placeholder="Username"
                        autocomplete="username"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup class="mb-4">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        v-model="password"
                        type="password"
                        placeholder="Password"
                        autocomplete="current-password"
                        required
                      />
                    </CInputGroup>
                    <CInputGroup class="mb-4">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        v-model="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        autocomplete="current-password"
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" class="px-4" type="submit">Sign Up</CButton>
                      </CCol>
                      <CCol xs="6" class="text-right">
                        <CButton color="link" @click="goToLogin" class="px-0">
                          Already have an account?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  export default {
    name: 'Signup',
    setup() {
      const router = useRouter();
      const username = ref('');
      const password = ref('');
      const confirmPassword = ref('');
  
      const handleSignup = async () => {
        if (password.value !== confirmPassword.value) {
          alert('Passwords do not match');
          return;
        }
  
        try {
            await axios.post('http://localhost:80/api/signup', {
            username: username.value,
            password: password.value,
          });
  
          alert('Signup successful! You can now log in.');
          router.push('/'); // 로그인 페이지로 리디렉션
        } catch (error) {
          alert('Error during signup: ' + error.response.data.message);
        }
      };
  
      const goToLogin = () => {
        router.push('/'); // 로그인 페이지로 리디렉션
      };
  
      return {
        username,
        password,
        confirmPassword,
        handleSignup,
        goToLogin,
      };
    }
  };
  </script>
  
  <style scoped>
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100vh;
    padding-top: 10%;
  }
  </style>
  