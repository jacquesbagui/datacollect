<script setup lang="ts">
import { ELECTION_CONFIG } from '@/utils/constants';
</script>

<template>
  <footer class="mt-12 py-6 bg-white border-t-2 border-orange-200">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-sm text-gray-600">
        © 2025 {{ ELECTION_CONFIG.TITLE }} - {{ ELECTION_CONFIG.DESCRIPTION }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        Vos données sont protégées et votre vote est confidentiel
      </p>
    </div>
  </footer>
</template>
