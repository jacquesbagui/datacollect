/**
 * Constants - Constantes de l'application
 * @description Valeurs constantes utilisées dans toute l'application
 */

import { VoteStep } from '@/types';

/**
 * Libellés des étapes
 */
export const STEP_LABELS: Record<VoteStep, string> = {
  [VoteStep.VERIFICATION]: 'Vérification',
  [VoteStep.VOTE]: 'Vote',
  [VoteStep.CONFIRMATION]: 'Confirmation',
  [VoteStep.SUCCESS]: 'Terminé'
};

/**
 * Nombre total d'étapes
 */
export const TOTAL_STEPS = 4;

/**
 * Configuration de l'upload de fichiers
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
} as const;

/**
 * Règles de validation
 */
export const VALIDATION_RULES = {
  VOTER_NUMBER: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    PATTERN: /^[A-Z0-9]+$/i
  }
} as const;

/**
 * Messages d'erreur
 */
export const ERROR_MESSAGES = {
  // Vérification
  VOTER_NUMBER_REQUIRED: 'Le numéro d\'électeur est requis',
  VOTER_NUMBER_TOO_SHORT: 'Le numéro d\'électeur doit contenir au moins 8 caractères',
  VOTER_NUMBER_TOO_LONG: 'Le numéro d\'électeur ne doit pas dépasser 20 caractères',
  VOTER_NUMBER_INVALID_FORMAT: 'Le numéro d\'électeur ne doit contenir que des lettres et des chiffres',

  // Fichier
  FILE_REQUIRED: 'Veuillez télécharger votre carte d\'électeur',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux (maximum 5MB)',
  FILE_INVALID_TYPE: 'Format de fichier non autorisé (JPG, PNG, WEBP ou PDF uniquement)',

  // Vote
  NO_CANDIDATE_SELECTED: 'Veuillez sélectionner un candidat',

  // API
  VERIFICATION_FAILED: 'Échec de la vérification. Veuillez vérifier vos informations',
  CANDIDATES_LOAD_FAILED: 'Erreur lors du chargement des candidats',
  VOTE_SUBMIT_FAILED: 'Erreur lors de la soumission du vote',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion internet',

  // Général
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite'
} as const;

/**
 * Messages de succès
 */
export const SUCCESS_MESSAGES = {
  VOTER_VERIFIED: 'Électeur vérifié avec succès',
  VOTE_SUBMITTED: 'Merci d\'avoir voté',
  FILE_UPLOADED: 'Fichier chargé avec succès'
} as const;

/**
 * Configuration des couleurs du thème
 */
export const THEME_COLORS = {
  PRIMARY: {
    ORANGE: '#f97316',
    GREEN: '#16a34a',
    WHITE: '#ffffff'
  },
  GRADIENT: {
    ORANGE_GREEN: 'from-orange-500 to-green-600',
    ORANGE_GREEN_HOVER: 'from-orange-600 to-green-700'
  }
} as const;

/**
 * Configuration de l'élection
 */
export const ELECTION_CONFIG = {
  YEAR: '2025',
  TITLE: 'Election Présidentielle 2025',
  DESCRIPTION: 'Le vrai vote inclusif c\'est ici'
} as const;

/**
 * URLs et endpoints (à configurer selon l'environnement)
 */
export const API_ENDPOINTS = {
  CHECK_ELIGIBILITY: '/api/check-eligibility',
  GET_CANDIDATES: '/candidates',
  SUBMIT_VOTE: '/api/votes',
  GET_CONFIRMATION: '/vote/confirmation/:id'
} as const;

/**
 * Durées (en millisecondes)
 */
export const DURATIONS = {
  VERIFICATION_TIMEOUT: 30000, // 30 secondes
  VOTE_SUBMIT_TIMEOUT: 15000,  // 15 secondes
  TOAST_DURATION: 5000,         // 5 secondes
  AUTO_REDIRECT_DELAY: 3000     // 3 secondes
} as const;

/**
 * Configuration du local storage
 */
export const STORAGE_KEYS = {
  VOTER_SESSION: 'datacollect_voter_session',
  VOTE_DRAFT: 'datacollect_vote_draft',
  LAST_STEP: 'datacollect_last_step'
} as const;

export default {
  STEP_LABELS,
  TOTAL_STEPS,
  FILE_UPLOAD,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_COLORS,
  ELECTION_CONFIG,
  API_ENDPOINTS,
  DURATIONS,
  STORAGE_KEYS
};
