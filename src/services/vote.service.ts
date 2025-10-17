/**
 * Voter Service - Logique métier pour les électeurs
 */

import type {
  ValidationResult,
  FileInfo
} from '@/types';
import { VALIDATION_RULES, FILE_UPLOAD, ERROR_MESSAGES } from '@/utils/constants';

/**
 * Validation du numéro de carte d'électeur
 * @param cardNumber - Numéro à valider
 * @returns Résultat de validation
 */
export const validateCardNumber = (cardNumber: string): ValidationResult => {
  const errors: string[] = [];

  if (!cardNumber) {
    errors.push(ERROR_MESSAGES.VOTER_NUMBER_REQUIRED);
    return { isValid: false, errors };
  }

  // Nettoyer les espaces
  const cleanNumber = cardNumber.trim();

  // Vérifier la longueur (6-20 caractères selon l'API)
  if (cleanNumber.length < 6) {
    errors.push('Le numéro de carte doit contenir au moins 6 caractères');
  }

  if (cleanNumber.length > 20) {
    errors.push('Le numéro de carte ne doit pas dépasser 20 caractères');
  }

  // Vérifier le format (alphanumérique)
  if (!VALIDATION_RULES.VOTER_NUMBER.PATTERN.test(cleanNumber)) {
    errors.push(ERROR_MESSAGES.VOTER_NUMBER_INVALID_FORMAT);
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanValue: cleanNumber
  };
};

/**
 * Validation du fichier de carte d'électeur
 * @param file - Fichier à valider
 * @returns Résultat de validation
 */
export const validateCardFile = (file: File | null): ValidationResult => {
  const errors: string[] = [];

  if (!file) {
    errors.push(ERROR_MESSAGES.FILE_REQUIRED);
    return { isValid: false, errors };
  }

  // Vérifier la taille du fichier (max 5MB)
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    errors.push(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  // Vérifier le type MIME (JPG/PNG/WEBP)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Format de fichier non autorisé (JPG, PNG ou WEBP uniquement)');
  }

  // Vérifier l'extension du fichier
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push('Extension de fichier non autorisée');
  }

  const fileInfo: FileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
  };

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo
  };
};

/**
 * Vérifier la résolution de l'image (min 800x600px selon l'API)
 * @param file - Fichier image
 * @returns Promise avec le résultat
 */
export const validateImageResolution = (file: File): Promise<{
  isValid: boolean;
  width?: number;
  height?: number;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      if (img.width < 800 || img.height < 600) {
        resolve({
          isValid: false,
          width: img.width,
          height: img.height,
          error: 'Résolution minimale requise: 800x600 pixels'
        });
      } else {
        resolve({
          isValid: true,
          width: img.width,
          height: img.height
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        isValid: false,
        error: 'Impossible de lire l\'image'
      });
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compresser une image côté client via canvas
 * @param file - Fichier image source
 * @param options - Options de compression
 * @returns Nouveau fichier compressé
 */
export const compressImage = (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0..1
    mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
  } = {}
): Promise<File> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(image.src);

      // Calcul des dimensions cibles en respectant le ratio
      let targetWidth = image.width;
      let targetHeight = image.height;
      const widthRatio = maxWidth / targetWidth;
      const heightRatio = maxHeight / targetHeight;
      const ratio = Math.min(1, widthRatio, heightRatio);
      targetWidth = Math.floor(targetWidth * ratio);
      targetHeight = Math.floor(targetHeight * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas non supporté'));
        return;
      }
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Echec de la compression'));
            return;
          }
          const compressedFile = new File([blob], file.name.replace(/\.(jpe?g|png|webp)$/i, '.jpg'), {
            type: mimeType,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error('Impossible de lire le fichier image'));
    };

    image.src = URL.createObjectURL(file);
  });
};

/**
 * Validation complète avant soumission
 * @param cardNumber - Numéro de carte
 * @param cardFile - Fichier de carte
 * @returns Résultat de validation
 */
export const validateVoteSubmission = async (
  cardNumber: string,
  cardFile: File | null
): Promise<ValidationResult> => {
  const errors: string[] = [];

  // Validation du numéro
  const cardValidation = validateCardNumber(cardNumber);
  if (!cardValidation.isValid) {
    errors.push(...cardValidation.errors);
  }

  // Validation du fichier
  const fileValidation = validateCardFile(cardFile);
  if (!fileValidation.isValid) {
    errors.push(...fileValidation.errors);
  } else if (cardFile) {
    // Validation de la résolution
    const resolutionValidation = await validateImageResolution(cardFile);
    if (!resolutionValidation.isValid) {
      errors.push(resolutionValidation.error || 'Résolution d\'image invalide');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanValue: cardValidation.cleanValue,
    fileInfo: fileValidation.fileInfo
  };
};

/**
 * Formater un numéro de carte pour l'affichage (masqué)
 * @param cardNumber - Numéro complet
 * @returns Numéro masqué
 */
export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 6) {
    return cardNumber;
  }

  const start = cardNumber.substring(0, 3);
  const end = cardNumber.substring(cardNumber.length - 3);
  const middle = '*'.repeat(cardNumber.length - 6);

  return `${start}${middle}${end}`;
};

export default {
  validateCardNumber,
  validateCardFile,
  validateImageResolution,
  compressImage,
  validateVoteSubmission,
  maskCardNumber
};
