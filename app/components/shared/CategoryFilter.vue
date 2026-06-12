<template>
  <div class="overflow-x-auto no-scrollbar px-6 flex justify-start md:justify-center" :class="wrapperClass">
    <div class="flex gap-2 flex-nowrap pb-2">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        :class="[
          'px-6 py-2.5 text-[9px] tracking-[0.2em] uppercase font-bold whitespace-nowrap transition-all duration-500 rounded-full border cursor-pointer',
          modelValue === cat.id
            ? 'bg-(--color-primary-500) text-white border-(--color-primary-500) shadow-lg'
            : 'bg-transparent text-(--text-heading) border-black/10 hover:bg-black/5 hover:border-black/20'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CategoryItem {
  id: string
  label: string
}

const props = withDefaults(defineProps<{
  categories: CategoryItem[]
  modelValue: string
  wrapperClass?: string
}>(), {
  wrapperClass: 'mb-10',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const selectCategory = (id: string) => {
  emit('update:modelValue', id)
  emit('change', id)
}
</script>
