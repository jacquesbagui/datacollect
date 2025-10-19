<script setup lang="ts">
import { Vote } from 'lucide-vue-next';
import { ELECTION_CONFIG } from '@/utils/constants';
</script>

<template>
  <header class="bg-white shadow-sm border-b-4 border-orange-500">
    <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Logo et titre -->
        <div class="flex items-center space-x-3">
          <div class="bg-white-600 p-2 rounded-lg">
            <img src="/logo-civ.png" alt="Logo" class="w-16" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ ELECTION_CONFIG.TITLE }}</h1>
            <p class="text-sm text-gray-600">
              {{ ELECTION_CONFIG.DESCRIPTION }}
            </p>
          </div>
        </div>

        <!-- Badge élection -->
        <div class="flex items-center space-x-2">
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {{ ELECTION_CONFIG.YEAR }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
