<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, AlertCircle, User } from 'lucide-vue-next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVoteStore } from '@/stores/vote.store';

const voteStore = useVoteStore();
const imageError = ref(false);
const imageLoaded = ref(false);

/**
 * Obtenir les initiales du candidat
 */
const getInitials = computed(() => {
  if (!voteStore.selectedCandidate) return '??';

  const names = voteStore.selectedCandidate.name.split(' ');
  if (names.length >= 2 && names[0] && names[names.length - 1]) {
    return `${names[0].charAt(0)}${names[names.length - 1]!.charAt(0)}`;
  }
  return voteStore.selectedCandidate.name.substring(0, 2).toUpperCase();
});

/**
 * Confirmer et soumettre le vote
 */
const handleConfirmVote = async () => {
  try {
    await voteStore.submitVote();
  } catch (err) {
    console.error('Erreur lors de la soumission du vote:', err);
  }
};

/**
 * Gérer l'erreur de chargement d'image
 */
const handleImageError = () => {
  imageError.value = true;
};

/**
 * Gérer le chargement réussi de l'image
 */
 const handleImageLoad = () => {
  imageLoaded.value = true;
};
</script>

<template>
  <Card class="border-2 shadow-xs pt-0">
    <CardHeader class="bg-orange-500 text-white py-4 rounded-t-lg">
      <CardTitle>Confirmation de Vote</CardTitle>
      <CardDescription class="text-orange-50">
        Vérifiez votre choix avant de confirmer
      </CardDescription>
    </CardHeader>

    <CardContent class="pt-6">
      <!-- Candidat sélectionné -->
      <div v-if="voteStore.selectedCandidate" class="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
        <p class="text-sm text-gray-600 mb-4">Vous avez sélectionné :</p>
        <div class="flex items-center space-x-4">
          <!-- Photo avec gestion d'erreur -->
          <div class="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <img
              v-if="!imageError"
              :src="voteStore.selectedCandidate.photo"
              :alt="voteStore.selectedCandidate.name"
              class="w-full h-full object-cover"
              @load="handleImageLoad"
              @error="handleImageError"
              :class="{ 'opacity-0': !imageLoaded }"
            />
            <!-- Placeholder -->
            <div
              v-if="imageError || !imageLoaded"
              :class="[
                'absolute inset-0 flex items-center justify-center'
              ]"
            >
              <User v-if="imageError" class="h-10 w-10 text-white" />
              <span v-else class="text-2xl font-bold text-orange-600">
                {{ getInitials }}
              </span>
            </div>
          </div>

          <div class="flex-1">
            <h3 class="font-bold text-2xl text-gray-900">
              {{ voteStore.selectedCandidate.name }}
            </h3>
            <p class="text-orange-600 font-medium mt-1">
              {{ voteStore.selectedCandidate.party }}
            </p>
            <p class="text-gray-600 mt-2 text-sm">
              {{ voteStore.selectedCandidate.program }}
            </p>
          </div>
        </div>
      </div>

      <!-- Alerte importante -->
      <Alert class="mt-6 border-green-200 bg-green-50">
        <AlertCircle class="h-4 w-4 text-green-600" />
        <AlertDescription class="text-green-800">
          <strong>Important :</strong> Une fois confirmé, votre vote ne pourra plus être modifié.
          Assurez-vous de votre choix.
        </AlertDescription>
      </Alert>

      <!-- Erreur -->
      <Alert v-if="voteStore.error" variant="destructive" class="mt-4">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ voteStore.error }}</AlertDescription>
      </Alert>
    </CardContent>
    <CardFooter class="flex space-x-3">
      <Button
        variant="outline"
        @click="voteStore.backToVote"
        :disabled="voteStore.isLoading"
        class="flex-1 h-12 border-orange-300 text-orange-600 hover:bg-orange-50"
      >
        <ArrowLeft class="mr-2 h-4 w-4" /> Modifier
      </Button>
      <Button
        @click="handleConfirmVote"
        :disabled="voteStore.isLoading"
        class="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
      >
        {{ voteStore.isLoading ? 'Envoi en cours...' : 'Confirmer mon vote' }}
      </Button>
    </CardFooter>
  </Card>
</template>
