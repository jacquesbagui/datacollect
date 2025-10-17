<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-vue-next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup } from '@/components/ui/radio-group';
import CandidateCard from '@/components/shared/CandidateCard.vue';
import { useVoteStore } from '@/stores/vote.store';
import { ERROR_MESSAGES } from '@/utils/constants';

const voteStore = useVoteStore();
const error = ref<string>('');

/**
 * Computed pour vérifier si on a des candidats
 */
const hasCandidates = computed(() => voteStore.candidates.length > 0);

/**
 * Computed pour le numéro de carte masqué
 */
const maskedCardNumber = computed(() => {
  const number = voteStore.cardNumber;
  if (!number || number.length < 6) return number;

  const start = number.substring(0, 3);
  const end = number.substring(number.length - 3);
  const middle = '*'.repeat(Math.max(0, number.length - 6));

  return `${start}${middle}${end}`;
});

/**
 * Charger les candidats au montage du composant
 */
onMounted(async () => {
  if (!hasCandidates.value) {
    try {
      await voteStore.loadCandidates();
    } catch (err: any) {
      error.value = err.message || ERROR_MESSAGES.CANDIDATES_LOAD_FAILED;
    }
  }
});

/**
 * Passer à l'étape de confirmation
 */
const handleVoteSelection = () => {
  if (!voteStore.selectedCandidateId) {
    error.value = ERROR_MESSAGES.NO_CANDIDATE_SELECTED;
    return;
  }

  error.value = '';
  voteStore.goToConfirmation();
};

/**
 * Sélectionner un candidat
 */
const handleCandidateSelect = (candidateId: string) => {
  voteStore.selectCandidate(Number(candidateId));
  error.value = '';
};
</script>

<template>
  <Card class="border-2 shadow-xs pt-0">
    <CardHeader class="bg-orange-600 text-white py-4 rounded-t-lg">
      <CardTitle class="text-2xl">Choisissez votre Candidat</CardTitle>
      <CardDescription class="text-orange-50 text-base">
        Carte d'électeur: {{ maskedCardNumber }}
      </CardDescription>
    </CardHeader>

    <CardContent class="pt-6">
      <!-- Loading state -->
      <div v-if="voteStore.isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 class="h-12 w-12 text-orange-500 animate-spin" />
        <p class="text-gray-600 text-lg">Chargement des candidats...</p>
      </div>

      <!-- Error alert -->
      <Alert v-else-if="error || voteStore.error" variant="destructive" class="mb-6">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error || voteStore.error }}</AlertDescription>
      </Alert>

      <!-- Liste des candidats -->
      <div v-else-if="hasCandidates">
        <!-- Instruction -->
        <div class="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
          <p class="text-sm text-gray-700">
            <strong>Instruction:</strong> Sélectionnez le candidat de votre choix en cliquant sur sa carte.
          </p>
        </div>

        <!-- Radio Group avec Grid -->
        <RadioGroup
          :model-value="voteStore.selectedCandidateId?.toString()"
          @update:model-value="handleCandidateSelect"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CandidateCard
              v-for="candidate in voteStore.candidates"
              :key="candidate.id"
              :candidate="candidate"
              :is-selected="voteStore.selectedCandidateId === candidate.id"
              :on-select="() => voteStore.selectCandidate(candidate.id)"
            />
          </div>
        </RadioGroup>

        <!-- Compteur de candidats -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            {{ voteStore.candidates.length }} candidat{{ voteStore.candidates.length > 1 ? 's' : '' }} disponible{{ voteStore.candidates.length > 1 ? 's' : '' }}
            <span v-if="voteStore.selectedCandidateId" class="text-green-600 font-medium ml-2">
              • 1 sélectionné
            </span>
          </p>
        </div>
      </div>

      <!-- Aucun candidat disponible -->
      <div v-else class="text-center py-16">
        <AlertCircle class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 text-lg">Aucun candidat disponible pour le moment</p>
      </div>
    </CardContent>

    <CardFooter class="flex flex-col space-y-3">
      <!-- Message de sélection -->
      <div
        v-if="voteStore.selectedCandidateId && voteStore.selectedCandidate"
        class="w-full p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <p class="text-sm text-green-800 text-center">
          Vous avez sélectionné: <strong>{{ voteStore.selectedCandidate.name }}</strong>
        </p>
      </div>

      <!-- Bouton de validation -->
      <Button
        @click="handleVoteSelection"
        :disabled="!voteStore.selectedCandidateId || voteStore.isLoading"
        class="w-full h-12 text-lg bg-green-600 hover:from-orange-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="voteStore.isLoading">
          <Loader2 class="mr-2 h-5 w-5 animate-spin" />
          Chargement...
        </template>
        <template v-else>
          Valider mon choix <ChevronRight class="ml-2 h-5 w-5" />
        </template>
      </Button>
    </CardFooter>
  </Card>
</template>
