/**
 * API Service - Gestion centralisée des appels API
 * @description Service pour communiquer avec le backend Electoral Poll
 */

import type {
  Candidate,
  ApiError,
  HttpHeaders
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-electoralpoll.adjemincloud.com/api';

/**
 * Configuration des headers par défaut
 */
const getHeaders = (): HttpHeaders => ({
  'Accept': 'application/json',
});

/**
 * Fonction utilitaire pour gérer les erreurs API
 */
const handleApiError = (error: any): never => {
  console.error('API Error:', error);

  const apiError: ApiError = {
    status: error.response?.status || 0,
    message: error.response?.data?.message || error.message || 'Erreur inconnue',
    data: error.response?.data || null
  };

  throw apiError;
};

/**
 * Interface pour la réponse API des candidats
 */
interface CandidatesApiResponse {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    party: string;
    photo_url: string;
    order_number: number;
    description?: string;
  }>;
  generated_at: string;
}

/**
 * Interface pour la réponse d'éligibilité
 */
interface EligibilityApiResponse {
  success: boolean;
  eligible: boolean;
  message: string;
}

/**
 * Interface pour la réponse de soumission de vote
 */
interface VoteApiResponse {
  success: boolean;
  message: string;
  vote_id: string;
  voted_at: string;
}

/**
 * Service API principal
 */
export const apiService = {
  /**
   * Récupération de la liste des candidats
   * @returns Liste des candidats
   */
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des candidats');
      }

      const data: CandidatesApiResponse = await response.json();

      // Mapper les données de l'API vers notre interface Candidate
      return data.data.map(candidate => ({
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        photo: candidate.photo_url,
        program: candidate.description || '',
        biography: candidate.description
      }));
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Récupération d'un candidat par ID
   * @param candidateId - ID du candidat
   * @returns Candidat
   */
  getCandidateById: async (candidateId: number): Promise<Candidate> => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Candidat non trouvé');
      }

      const data = await response.json();

      return {
        id: data.data.id,
        name: data.data.name,
        party: data.data.party,
        photo: data.data.photo_url,
        program: data.data.description || '',
        biography: data.data.description
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Vérification de l'éligibilité d'un électeur
   * @param cardNumber - Numéro de carte d'électeur
   * @returns Statut d'éligibilité
   */
  checkEligibility: async (cardNumber: string): Promise<{
    eligible: boolean;
    message: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          card_number: cardNumber
        })
      });

      const data: EligibilityApiResponse = await response.json();

      return {
        eligible: data.eligible,
        message: data.message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Soumission du vote complet
   * @param voterCardNumber - Numéro de carte d'électeur
   * @param voterCardImage - Image de la carte d'électeur
   * @param candidateId - ID du candidat sélectionné
   * @returns Confirmation du vote
   */
  submitVote: async (
    voterCardNumber: string,
    voterCardImage: File,
    candidateId: number
  ): Promise<{
    success: boolean;
    message: string;
    voteId: string;
    votedAt: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('voter_card_number', voterCardNumber);
      formData.append('voter_card_image', voterCardImage);
      formData.append('candidate_id', candidateId.toString());

      const response = await fetch(`${API_BASE_URL}/votes`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data: VoteApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw {
          response: {
            status: response.status,
            data: data
          }
        };
      }

      return {
        success: data.success,
        message: data.message,
        voteId: data.vote_id,
        votedAt: data.voted_at
      };
    } catch (error: any) {
      // Gérer les erreurs de validation (422)
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat() as string[];
        throw {
          status: 422,
          message: errorMessages.join(', '),
          data: error.response.data
        };
      }

      // Gérer les autres erreurs
      return handleApiError(error);
    }
  }
};

export default apiService;
