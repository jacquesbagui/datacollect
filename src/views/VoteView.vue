<script setup lang="ts">
import { computed } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import ProgressStep from '@/components/layout/ProgressStep.vue';
import VerificationStep from '@/components/vote/VerificationStep.vue';
import VoteStep from '@/components/vote/VoteStep.vue';
import ConfirmationStep from '@/components/vote/ConfirmationStep.vue';
import SuccessStep from '@/components/vote/SuccessStep.vue';
import { useVoteStore } from '@/stores/vote.store';
import { VoteStep as VoteStepEnum } from '@/types';
import { TOTAL_STEPS } from '@/utils/constants';

const voteStore = useVoteStore();

// Composant à afficher selon l'étape
const currentStepComponent = computed(() => {
  switch (voteStore.currentStep) {
    case VoteStepEnum.VERIFICATION:
      return VerificationStep;
    case VoteStepEnum.VOTE:
      return VoteStep;
    case VoteStepEnum.CONFIRMATION:
      return ConfirmationStep;
    case VoteStepEnum.SUCCESS:
      return SuccessStep;
    default:
      return VerificationStep;
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Progress Indicator -->
    <ProgressStep
      :current-step="voteStore.currentStep"
      :total-steps="TOTAL_STEPS"
    />

    <!-- Main Content -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      <component :is="currentStepComponent" />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
