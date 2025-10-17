<script setup lang="ts">
import type { ProgressStepProps } from '@/types';

defineProps<ProgressStepProps>();
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-4">
    <div class="flex items-center justify-center space-x-2">
      <div
        v-for="idx in totalSteps"
        :key="idx"
        :class="[
          'h-1.5 rounded-full transition-all duration-300',
          idx - 1 < currentStep
            ? 'w-12 bg-green-500'
            : idx - 1 === currentStep
            ? 'w-16 bg-orange-600'
            : 'w-12 bg-gray-200'
        ]"
      />
    </div>
    <p class="text-center text-xs text-gray-500 mt-2">
      Étape {{ currentStep + 1 }} sur {{ totalSteps }}
    </p>
  </div>
</template>
