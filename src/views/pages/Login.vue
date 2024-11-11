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
                      placeholder="Email"
                      autocomplete="username"
                      required
                      type="email"
                      :pattern="emailPattern"
                      title="Please enter a valid email address (e.g., example@example.com)"
                      @input="validateEmail"
                    />
                  </CInputGroup>
                  <div v-if="!isEmailValid" class="text-danger mb-3">
                    Please enter a valid email address (e.g., example@example.com)
                  </div>
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
                      :pattern="passwordPattern"
                      title="Password must be at least 8 characters long and include a lowercase letter, a number, and a special character."
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
const apiUrl = import.meta.env.VITE_APP_API_URL;

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const isEmailValid = ref(true);

    // 이메일 패턴 정규식 (기본적인 이메일 형식 체크)
    const emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    // 패스워드 패턴 정규식: 8자 이상, 소문자, 숫자, 특수 문자 포함
    const passwordPattern = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";

    const validateEmail = () => {
      // 이메일 형식이 맞는지 확인
      const regex = new RegExp(emailPattern);
      isEmailValid.value = regex.test(username.value);
    };

    const handleLogin = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/login`, {
          username: username.value,
          password: password.value,
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token); // Store the token in localStorage
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in the request headers

        router.push('/main');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Invalid credentials';
        alert(errorMessage); // Provide the error message from the server response
      }
    };

    const goToSignup = () => {
      router.push('/signup'); // 회원가입 페이지로 리디렉션
    };

    return {
      username,
      password,
      emailPattern, // 이메일 패턴
      passwordPattern,
      isEmailValid,
      handleLogin,
      goToSignup,
      validateEmail,
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
