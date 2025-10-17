/**
 * Types et Interfaces TypeScript
 * @description Définitions de types pour l'application DataCollect
 */

// ==================== ENUMS ====================

/**
 * Étapes du processus de vote
 */
export enum VoteStep {
  VERIFICATION = 0,
  VOTE = 1,
  CONFIRMATION = 2,
  SUCCESS = 3
}

/**
 * Statuts de requête
 */
export enum RequestStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// ==================== INTERFACES ====================

/**
 * Interface pour un candidat
 */
export interface Candidate {
  id: number;
  name: string;
  party: string;
  photo: string;
  program: string;
  biography?: string;
}

/**
 * Interface pour les données d'un électeur (pas utilisée avec la nouvelle API)
 */
export interface VoterData {
  cardNumber: string;
  cardImage?: File;
  eligible: boolean;
  verifiedAt?: string;
}

/**
 * Interface pour les données formatées d'un électeur
 */
export interface FormattedVoterData {
  number: string;
  displayNumber: string;
  eligible: boolean;
  verifiedAt: Date;
}

/**
 * Interface pour la validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  cleanValue?: string;
  fileInfo?: FileInfo;
}

/**
 * Interface pour les informations de fichier
 */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  sizeInMB: string;
}

/**
 * Interface pour l'état du vote (Store)
 */
export interface VoteState {
  currentStep: VoteStep;
  voterCardNumber: string;
  voterCardImage: File | null;
  candidates: Candidate[];
  selectedCandidateId: number | null;
  selectedCandidateData: Candidate | null;
  confirmationNumber: string;
  isLoading: boolean;
  error: string | null;
  isEligible: boolean | null;
}

/**
 * Interface pour les erreurs API
 */
export interface ApiError {
  status: number;
  message: string;
  data: any;
}

/**
 * Type pour les headers HTTP
 */
export type HttpHeaders = Record<string, string>;

/**
 * Type pour les paramètres de configuration
 */
export interface AppConfig {
  apiBaseUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  electionYear: string;
  electionTitle: string;
}

// ==================== INTERFACES API ====================

/**
 * Interface pour la réponse API générique
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Interface pour un candidat de l'API
 */
export interface ApiCandidate {
  id: number;
  name: string;
  party: string;
  photo_url: string;
  order_number: number;
  description?: string;
}

/**
 * Interface pour la réponse de la liste des candidats
 */
export interface CandidatesApiResponse {
  success: boolean;
  data: ApiCandidate[];
  generated_at: string;
}

/**
 * Interface pour la réponse de vérification d'éligibilité
 */
export interface EligibilityApiResponse {
  success: boolean;
  eligible: boolean;
  message: string;
}

/**
 * Interface pour la réponse de soumission de vote
 */
export interface VoteApiResponse {
  success: boolean;
  message: string;
  vote_id: string;
  voted_at: string;
}

/**
 * Interface pour les erreurs de validation de l'API
 */
export interface ValidationApiError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

// ==================== TYPE GUARDS ====================

/**
 * Vérifier si un objet est un Candidate
 */
export function isCandidate(obj: any): obj is Candidate {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.party === 'string' &&
    typeof obj.photo === 'string' &&
    typeof obj.program === 'string'
  );
}

/**
 * Vérifier si un objet est VoterData
 */
export function isVoterData(obj: any): obj is VoterData {
  return (
    typeof obj === 'object' &&
    typeof obj.cardNumber === 'string' &&
    typeof obj.eligible === 'boolean'
  );
}

/**
 * Vérifier si c'est une erreur API
 */
export function isApiError(obj: any): obj is ApiError {
  return (
    typeof obj === 'object' &&
    typeof obj.status === 'number' &&
    typeof obj.message === 'string'
  );
}

// ==================== UTILITY TYPES ====================

/**
 * Type pour une fonction de callback
 */
export type CallbackFunction<T = void> = (data?: T) => void;

/**
 * Type pour les props des composants Step
 */
export interface StepProps {
  onNext?: CallbackFunction;
  onBack?: CallbackFunction;
  onError?: CallbackFunction<string>;
}

/**
 * Props pour le composant VerificationStep
 */
export interface VerificationStepProps extends StepProps {
  onVerified: (cardNumber: string, cardImage: File) => void;
}

/**
 * Props pour le composant VoteStep
 */
export interface VoteStepProps extends StepProps {
  cardNumber: string;
  onVoteSelected: (candidateId: number, candidateData: Candidate) => void;
}

/**
 * Props pour le composant ConfirmationStep
 */
export interface ConfirmationStepProps extends StepProps {
  selectedCandidate: Candidate;
  onConfirm: () => void;
  onBack: () => void;
}

/**
 * Props pour le composant SuccessStep
 */
export interface SuccessStepProps {
  confirmationNumber: string;
}

/**
 * Props pour le composant CandidateCard
 */
export interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidateId: number) => void;
}

/**
 * Props pour le composant ProgressStep
 */
export interface ProgressStepProps {
  currentStep: VoteStep;
  totalSteps: number;
}

// ==================== EXPORTS ====================

export default {
  VoteStep,
  RequestStatus,
  isCandidate,
  isVoterData,
  isApiError
};
