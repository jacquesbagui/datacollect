<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CandidateCardProps } from '@/types';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, User } from 'lucide-vue-next';

const props = defineProps<CandidateCardProps>();

const imageError = ref(false);
const imageLoaded = ref(false);

/**
 * Classes dynamiques pour la carte
 */
const cardClasses = computed(() => [
  'relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg',
  props.isSelected
    ? 'border-orange-500 shadow-md'
    : 'border-gray-200 hover:border-gray-300 bg-white'
]);

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

/**
 * Obtenir les initiales du candidat
 */
const getInitials = computed(() => {
  if (!props.candidate.name) return '??';
  const names = props.candidate.name.split(' ');
  if (names.length >= 2 && names[0] && names[names.length - 1]) {
    return `${names[0].charAt(0)}${names[names.length - 1]!.charAt(0)}`;
  }
  return props.candidate.name.substring(0, 2).toUpperCase();
});
</script>

<template>
  <label :class="cardClasses">
    <!-- Badge de sélection -->
    <div
      v-if="isSelected"
      class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg z-10"
    >
      <CheckCircle2 class="h-5 w-5" />
    </div>

    <!-- Radio button caché mais accessible -->
    <div class="absolute top-4 left-4">
      <RadioGroupItem
        :value="candidate.id.toString()"
        :id="`candidate-${candidate.id}`"
        class="border-2"
      />
    </div>

    <!-- Contenu de la carte -->
    <div class="flex flex-col items-center space-y-3 pt-8">
      <!-- Photo du candidat -->
      <div
        :class="[
          'relative w-24 h-24 rounded-full overflow-hidden border-4 shadow-md transition-transform duration-200',
          isSelected ? 'border-orange-500 scale-105' : 'border-gray-200'
        ]"
      >
        <!-- Image -->
        <img
          v-if="!imageError"
          :src="candidate.photo"
          :alt="candidate.name"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="handleImageError"
          @load="handleImageLoad"
          :class="{ 'opacity-0': !imageLoaded }"
        />

        <!-- Placeholder avec initiales -->
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

      <!-- Informations du candidat -->
      <div class="text-center space-y-2 flex-1 w-full">
        <!-- Nom -->
        <h3
          :class="[
            'font-bold text-lg leading-tight',
            isSelected ? 'text-orange-600' : 'text-gray-900'
          ]"
        >
          {{ candidate.name }}
        </h3>

        <!-- Parti -->
        <div
          :class="[
            'inline-block px-3 py-1 rounded-full text-sm font-medium',
            isSelected
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-700'
          ]"
        >
          {{ candidate.party }}
        </div>

        <!-- Programme -->
        <p
          :class="[
            'text-sm leading-relaxed mt-2 px-2',
            isSelected ? 'text-gray-700' : 'text-gray-600'
          ]"
        >
          {{ candidate.program }}
        </p>
      </div>
    </div>

    <!-- Indicateur de sélection en bas -->
    <div
      v-if="isSelected"
      class="mt-3 pt-3 border-t border-orange-200"
    >
      <p class="text-center text-sm font-medium text-orange-600">
        ✓ Candidat sélectionné
      </p>
    </div>
  </label>
</template>

<style scoped>
/* Animation au hover */
label:hover {
  transform: translateY(-2px);
}

label:active {
  transform: translateY(0);
}

/* Animation de l'image */
img {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

label:hover img {
  transform: scale(1.05);
}
</style>
