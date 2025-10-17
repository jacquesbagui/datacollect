/**
 * Vote Store - Gestion de l'état global avec Pinia
 * @description Store principal pour le processus de vote
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Candidate, VoteStep } from '@/types';
import { apiService } from '@/services/api.service';
import { VoteStep as VoteStepEnum } from '@/types';

export const useVoteStore = defineStore('vote', () => {
  // ==================== STATE ====================

  const currentStep = ref<VoteStep>(VoteStepEnum.VERIFICATION);
  const voterCardNumber = ref<string>('');
  const voterCardImage = ref<File | null>(null);
  const candidates = ref<Candidate[]>([]);
  const selectedCandidateId = ref<number | null>(null);
  const confirmationNumber = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const isEligible = ref<boolean | null>(null);

  // ==================== GETTERS ====================

  /**
   * Vérifier si l'électeur est vérifié
   */
  const isVoterVerified = computed(() => {
    return voterCardNumber.value !== '' && voterCardImage.value !== null;
  });

  /**
   * Obtenir le candidat sélectionné
   */
  const selectedCandidate = computed(() => {
    if (!selectedCandidateId.value) return null;
    return candidates.value.find(c => c.id === selectedCandidateId.value) || null;
  });

  /**
   * Vérifier si un vote peut être soumis
   */
  const canSubmitVote = computed(() => {
    return (
      isVoterVerified.value &&
      selectedCandidateId.value !== null &&
      !isLoading.value &&
      isEligible.value === true
    );
  });

  /**
   * Obtenir le numéro de carte de l'électeur
   */
  const cardNumber = computed(() => {
    return voterCardNumber.value || '';
  });

  /**
   * Vérifier si des données électeur existent
   */
  const hasVoterData = computed(() => {
    return voterCardNumber.value !== '' && voterCardImage.value !== null;
  });

  // ==================== ACTIONS ====================

  /**
   * Vérifier l'éligibilité d'un électeur
   */
  const checkEligibility = async (cardNum: string): Promise<boolean> => {
    try {
      const result = await apiService.checkEligibility(cardNum);
      isEligible.value = result.eligible;

      if (!result.eligible) {
        error.value = result.message;
      }

      return result.eligible;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la vérification d\'éligibilité';
      isEligible.value = false;
      return false;
    }
  };

  /**
   * Sauvegarder les données de vérification
   */
  const saveVerificationData = async (cardNum: string, cardImg: File): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      // Vérifier l'éligibilité
      const eligible = await checkEligibility(cardNum);

      if (!eligible) {
        throw new Error('Ce numéro de carte a déjà voté ou n\'est pas éligible');
      }

      // Sauvegarder les données
      voterCardNumber.value = cardNum;
      voterCardImage.value = cardImg;

      // Passer à l'étape suivante
      currentStep.value = VoteStepEnum.VOTE;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la vérification';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Charger la liste des candidats
   */
  const loadCandidates = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      const candidatesList = await apiService.getCandidates();
      console.log('candidatesList', candidatesList);
      candidates.value = candidatesList;
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des candidats';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Sélectionner un candidat
   */
  const selectCandidate = (candidateId: number): void => {
    selectedCandidateId.value = candidateId;
    error.value = null;
  };

  /**
   * Passer à l'étape de confirmation
   */
  const goToConfirmation = (): void => {
    if (selectedCandidateId.value !== null) {
      currentStep.value = VoteStepEnum.CONFIRMATION;
      error.value = null;
    } else {
      error.value = 'Veuillez sélectionner un candidat';
    }
  };

  /**
   * Retour à l'étape de vote
   */
  const backToVote = (): void => {
    currentStep.value = VoteStepEnum.VOTE;
    error.value = null;
  };

  /**
   * Soumettre le vote complet
   */
  const submitVote = async (): Promise<void> => {
    if (!canSubmitVote.value) {
      error.value = 'Impossible de soumettre le vote';
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const response = await apiService.submitVote(
        voterCardNumber.value,
        voterCardImage.value!,
        selectedCandidateId.value!
      );
      console.log("submitVote response :", response);

      if (response.success) {
        confirmationNumber.value = response.voteId;
        currentStep.value = VoteStepEnum.SUCCESS;
      } else {
        throw new Error(response.message || 'Soumission du vote échouée');
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la soumission du vote';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Réinitialiser le store (nouveau vote)
   */
  const resetVote = (): void => {
    currentStep.value = VoteStepEnum.VERIFICATION;
    voterCardNumber.value = '';
    voterCardImage.value = null;
    selectedCandidateId.value = null;
    confirmationNumber.value = '';
    error.value = null;
    isLoading.value = false;
    isEligible.value = null;
    // On garde les candidats en cache
  };

  /**
   * Définir une erreur
   */
  const setError = (message: string): void => {
    error.value = message;
  };

  /**
   * Effacer l'erreur
   */
  const clearError = (): void => {
    error.value = null;
  };

  /**
   * Changer d'étape manuellement (pour navigation)
   */
  const setStep = (step: VoteStep): void => {
    currentStep.value = step;
  };

  // ==================== RETURN ====================

  return {
    // State
    currentStep,
    voterCardNumber,
    voterCardImage,
    candidates,
    selectedCandidateId,
    confirmationNumber,
    isLoading,
    error,
    isEligible,

    // Getters
    isVoterVerified,
    selectedCandidate,
    canSubmitVote,
    cardNumber,
    hasVoterData,

    // Actions
    checkEligibility,
    saveVerificationData,
    loadCandidates,
    selectCandidate,
    goToConfirmation,
    backToVote,
    submitVote,
    resetVote,
    setError,
    clearError,
    setStep
  };
});

export default useVoteStore;
