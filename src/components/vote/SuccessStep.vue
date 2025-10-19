<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CheckCircle, RefreshCw } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoteStore } from '@/stores/vote.store';

const voteStore = useVoteStore();

// Compte à rebours
const countdown = ref(10);
let intervalId: number | null = null;

/**
 * Démarrer le compte à rebours
 */
onMounted(() => {
  intervalId = window.setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      handleRefresh();
    }
  }, 1000);
});

/**
 * Nettoyer l'intervalle
 */
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

/**
 * Rafraîchir la page
 */
const handleRefresh = () => {
  // Réinitialiser le store
  voteStore.resetVote();

  // Recharger la page
  window.location.reload();
};
</script>

<template>
  <Card class="border-2 shadow-lg text-center">
    <CardContent class="pt-12 pb-12">
      <!-- Icône de succès -->
      <div class="bg-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <CheckCircle class="h-12 w-12 text-white" />
      </div>

      <!-- Message de succès -->
      <h2 class="text-3xl font-bold text-gray-900 mb-3">
        Merci d'avoir voté !
      </h2>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Votre vote a été enregistré avec succès
      </p>


      <!-- Compte à rebours -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto mb-4">
        <div class="flex items-center justify-center space-x-2 text-gray-600">
          <RefreshCw :class="['h-5 w-5', countdown <= 3 ? 'animate-spin' : '']" />
          <p class="text-sm">
            Redirection automatique dans <strong class="text-orange-600 text-lg">{{ countdown }}</strong> seconde{{ countdown > 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Bouton manuel de refresh -->
      <Button
        @click="handleRefresh"
        variant="outline"
        class="border-orange-300 text-orange-600 hover:bg-orange-50"
      >
        <RefreshCw class="mr-2 h-4 w-4" />
        Recommencer maintenant
      </Button>
    </CardContent>
  </Card>
</template>
