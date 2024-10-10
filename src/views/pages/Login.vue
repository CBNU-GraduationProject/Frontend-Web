<template>
  <div class="login-container">
    <CContainer>
      <CRow class="justify-content-center align-items-center">
        <CCol md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-body-secondary">Sign In to your account</p>
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
                  <CRow>
                    <CCol xs="6">
                      <CButton color="primary" class="px-4" type="submit">Login</CButton>
                    </CCol>
                  </CRow>
                </CForm>
                <hr />
                <CRow class="mt-3">
                  <CCol class="text-center">
                    <p>Don't have an account?</p>
                    <CButton color="link" @click="goToSignup">Sign Up</CButton>
                  </CCol>
                </CRow>
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
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:80/api/login', {
          username: username.value,
          password: password.value,
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token); // Store the token in localStorage
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in the request headers

        router.push('/main');
      } catch (error) {
        alert('Invalid credentials');
      }
    };

    const goToSignup = () => {
      router.push('/signup'); // 회원가입 페이지로 리디렉션
    };

    return {
      username,
      password,
      handleLogin,
      goToSignup, // 회원가입 함수 추가
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding-top: 10%;
}
</style>
