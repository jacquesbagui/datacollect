<script setup lang="ts">
import { ref } from 'vue';
import { Upload, User, FileText, ChevronRight, AlertCircle, CheckCircle } from 'lucide-vue-next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVoteStore } from '@/stores/vote.store';
import { validateCardNumber, validateCardFile, validateImageResolution, compressImage } from '@/services/vote.service';

const voteStore = useVoteStore();

// State local
const cardNumber = ref<string>('');
const cardFile = ref<File | null>(null);
const error = ref<string>('');
const fileInputRef = ref<HTMLInputElement | null>(null);

/**
 * Gestion du changement de fichier
 */
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;

  if (file) {
    // Validation basique du fichier
    const validation = validateCardFile(file);
    if (!validation.isValid) {
      error.value = validation.errors[0] || 'Erreur de validation';
      cardFile.value = null;
      return;
    }

    // Validation de la résolution
    const resolutionCheck = await validateImageResolution(file);
    if (!resolutionCheck.isValid) {
      error.value = resolutionCheck.error || 'Résolution d\'image invalide';
      cardFile.value = null;
      if (target) target.value = '';
      return;
    }

    // Compression de l'image (réduction taille et dimensions)
    try {
      const compressed = await compressImage(file, {
        maxWidth: 1400,
        maxHeight: 1400,
        quality: 0.8,
        mimeType: 'image/jpeg'
      });
      cardFile.value = compressed.size < file.size ? compressed : file;
    } catch (e) {
      // En cas d'échec, fallback au fichier original
      cardFile.value = file;
    }
    error.value = '';
  }
};

/**
 * Vérification de l'électeur
 */
const handleVerification = async () => {
  error.value = '';

  // Validation locale du numéro
  const numberValidation = validateCardNumber(cardNumber.value);
  if (!numberValidation.isValid) {
    error.value = numberValidation.errors[0] || 'Erreur de validation';
    return;
  }

  // Validation du fichier
  const fileValidation = validateCardFile(cardFile.value);
  if (!fileValidation.isValid) {
    error.value = fileValidation.errors[0] || 'Erreur de validation';
    return;
  }

  // Appel au store pour sauvegarder et vérifier l'éligibilité
  try {
    await voteStore.saveVerificationData(cardNumber.value, cardFile.value!);
  } catch (err: any) {
    error.value = err.message || 'Erreur de vérification';
  }
};
</script>

<template>
  <Card class="border-2 shadow-xs pt-0">
    <CardHeader class="bg-orange-600 text-white py-4 rounded-t-lg">
      <CardTitle class="flex items-center space-x-2">
        <User class="h-6 w-6" />
        <span>Vérification de l'Électeur</span>
      </CardTitle>
      <CardDescription class="text-orange-50">
        Veuillez fournir vos informations pour accéder au sondage
      </CardDescription>
    </CardHeader>

    <CardContent class="pt-6 space-y-6">
      <!-- Alerte d'erreur -->
      <Alert v-if="error || voteStore.error" variant="destructive">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error || voteStore.error }}</AlertDescription>
      </Alert>

      <!-- Numéro de carte d'électeur -->
      <div class="space-y-2">
        <Label for="cardNumber" class="text-base font-semibold">
          Numéro de Carte d'Électeur
        </Label>
        <div class="relative">
          <Input
            id="cardNumber"
            v-model="cardNumber"
            type="text"
            placeholder="Ex: ABC123456789"
            class="pl-10 h-12 text-lg border-2 focus:border-orange-500"
            maxlength="20"
          />
          <FileText class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500">
          Votre numéro est inscrit sur votre carte d'électeur (6-20 caractères)
        </p>
      </div>

      <!-- Upload carte -->
      <div class="space-y-2">
        <Label for="cardUpload" class="text-base font-semibold">
          Photo de la Carte d'Électeur
        </Label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
          <input
            id="cardUpload"
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            class="hidden"
            @change="handleFileChange"
          />
          <label for="cardUpload" class="cursor-pointer">
            <Upload class="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p class="text-sm font-medium text-gray-700">
              {{ cardFile ? cardFile.name : 'Cliquez pour télécharger' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              JPG, PNG ou WEBP (max 5MB, min 800x600px)
            </p>
          </label>
        </div>
        <div v-if="cardFile" class="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded">
          <CheckCircle class="h-4 w-4" />
          <span class="text-sm">Fichier chargé avec succès</span>
        </div>
      </div>
    </CardContent>

    <CardFooter>
      <Button
        @click="handleVerification"
        :disabled="voteStore.isLoading"
        class="w-full h-12 text-lg bg-green-600 hover:from-orange-600 hover:to-green-700"
      >
        <template v-if="voteStore.isLoading">
          Vérification en cours...
        </template>
        <template v-else>
          Continuer <ChevronRight class="ml-2 h-5 w-5" />
        </template>
      </Button>
    </CardFooter>
  </Card>
</template>
