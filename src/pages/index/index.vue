<template>
  <q-page class="row flex flex-center">
    <q-card>
      <q-card-actions class="flex flex-center">
        <q-btn color="primary" label="signIn" @click="signIn"></q-btn>
        <q-btn
          :disable="!isAuthenticated"
          color="negative"
          label="signOut"
          @click="signOut"
        ></q-btn>
      </q-card-actions>
      <q-separator></q-separator>
      <q-card-section>
        <q-field label="Is Authenticated" stack-label>
          {{ isAuthenticated }}
        </q-field>
        <q-field label="User" stack-label>
          <pre>{{ _user }}</pre>
        </q-field>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated, user } = storeToRefs(authStore);
const { signIn, signOut } = authStore;

const _user = computed(() => {
  if (!user.value) {
    return {};
  }
  const { uid, email, displayName, photoURL, providerData } = user.value;
  return { uid, email, displayName, photoURL, providerData };
});
</script>
