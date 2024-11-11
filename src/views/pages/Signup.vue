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
                      placeholder="Email"
                      autocomplete="username"
                      required
                      type="email"
                      :class="{ 'is-invalid': !isValidEmail && username !== '' }"
                    />
                    <div v-if="!isValidEmail && username !== ''" class="invalid-feedback">
                      Please enter a valid email address.
                    </div>
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
                      :pattern="passwordPattern"
                      title="최소 8자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
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
                      :pattern="passwordPattern"
                      :class="{ 'is-invalid': password !== confirmPassword && confirmPassword !== '' }"
                    />
                    <div v-if="password !== confirmPassword && confirmPassword !== ''" class="invalid-feedback">
                      Passwords do not match
                    </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_APP_API_URL;

export default {
  name: 'Signup',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const passwordPattern = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
    
    // 이메일 유효성 검사 정규식 (숫자만 있는 도메인 차단)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!\d)$/;
    
    const isValidEmail = computed(() => emailPattern.test(username.value));

    const handleSignup = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match');
        return;
      }

      try {
        // Using .value to access the ref values
        const response = await axios.post(`${apiUrl}/api/signup`, {
          username: username.value, // access ref using .value
          password: password.value, // access ref using .value
        });

        console.log(response.data);
        alert('Signup successful! You can now log in.');
        router.push('/'); // 로그인 페이지로 리디렉션
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Signup failed. Please try again later.';
        alert('Error during signup: ' + errorMessage);
      }
    };

    const goToLogin = () => {
      router.push('/'); // 로그인 페이지로 리디렉션
    };
    
    return {
      username,
      password,
      confirmPassword,
      passwordPattern,
      isValidEmail,
      handleSignup,
      goToLogin,
    };
  }
};
</script>

<style lang="scss" scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  padding-top: 10%;
}
</style>
