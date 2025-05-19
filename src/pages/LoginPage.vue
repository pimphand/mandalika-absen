<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";
import { getApiUrl } from "@/config/api";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errors = ref({
  username: "",
  password: "",
  general: "",
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    username: "",
    password: "",
    general: "",
  };

  if (!username.value) {
    errors.value.username = "Username is required";
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = "Password is required";
    isValid = false;
  }

  return isValid;
};

const handleLogin = async (e: Event) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    isLoading.value = true;
    const response = await axios.post(
      getApiUrl("login"),
      {
        username: username.value,
        password: password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Store the encrypted token
    authStore.setToken(response.data.token);

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error: any) {
    if (error.response) {
      // Server responded with error
      errors.value.general = "Invalid username or password";
    } else if (error.request) {
      // No response received
      errors.value.general =
        "No response from server. Please check your connection.";
    } else {
      // Other errors
      errors.value.general = "An error occurred. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleLogin" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
              :class="{ 'border-red-500': errors.username }"
            />
            <span v-if="errors.username" class="text-sm text-red-500">
              {{ errors.username }}
            </span>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="#" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
              :class="{ 'border-red-500': errors.password }"
            />
            <span v-if="errors.password" class="text-sm text-red-500">
              {{ errors.password }}
            </span>
          </div>
          <div v-if="errors.general" class="text-sm text-red-500 text-center">
            {{ errors.general }}
          </div>
          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? "Loading..." : "Login" }}
          </Button>
          <Button
            variant="outline"
            class="w-full"
            type="button"
            :disabled="isLoading"
          >
            Login with Google
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="#" class="underline"> Sign up </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
