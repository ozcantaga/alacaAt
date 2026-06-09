<template>
  <form id="contact-form" class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField :label="$t('contact.form.name')" name="name" required>
        <UInput
          v-model="form.name"
          :placeholder="$t('contact.form.name')"
          icon="i-heroicons-user"
          size="lg"
          class="w-full"
          required
        />
      </UFormField>

      <UFormField :label="$t('contact.form.email')" name="email" required>
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="$t('contact.form.email')"
          icon="i-heroicons-envelope"
          size="lg"
          class="w-full"
          required
        />
      </UFormField>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UFormField :label="$t('contact.form.phone')" name="phone">
        <UInput
          v-model="form.phone"
          type="tel"
          :placeholder="$t('contact.form.phone')"
          icon="i-heroicons-phone"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('contact.form.subject')" name="subject" required>
        <UInput
          v-model="form.subject"
          :placeholder="$t('contact.form.subject')"
          icon="i-heroicons-chat-bubble-left-right"
          size="lg"
          class="w-full"
          required
        />
      </UFormField>
    </div>

    <UFormField :label="$t('contact.form.message')" name="message" required>
      <UTextarea
        v-model="form.message"
        :placeholder="$t('contact.form.message')"
        :rows="6"
        size="lg"
        class="w-full"
        required
      />
    </UFormField>

    <!-- Submit -->
    <div class="flex items-center justify-between pt-2">
      <p v-if="status === 'success'" class="text-sm flex items-center gap-2">
        <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
        {{ $t('contact.form.success') }}
      </p>
      <p v-else-if="status === 'error'" class="text-sm flex items-center gap-2">
        <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
        {{ $t('contact.form.error') }}
      </p>
      <div v-else />

      <UButton
        type="submit"
        :label="submitting ? $t('contact.form.sending') : $t('contact.form.send')"
        :loading="submitting"
        size="lg"
        class="border-0"
        trailing-icon="i-heroicons-paper-airplane"
       color="primary"/>
    </div>
  </form>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')

const handleSubmit = async () => {
  submitting.value = true
  status.value = 'idle'

  try {
    // TODO: Integrate with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1500))
    status.value = 'success'
    // Reset form
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' })
  } catch {
    status.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>
