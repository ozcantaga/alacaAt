// plugins/hydration-debug.client.ts
// Bu plugin sadece production preview'da hydration mismatch'in kaynağını bulmak için kullanılır.
// Hata bulunup giderildikten sonra bu dosya silinmelidir.

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    if (msg.includes('Hydration') || msg.includes('mismatch')) {
      console.error('🔴 HYDRATION MISMATCH DETECTED')
      console.error('Message:', msg)
      console.error('Component Trace:', trace)
      
      // instance'dan component adını bul
      if (instance) {
        const componentName = instance.$options?.name 
          || instance.$options?.__name 
          || instance?.$?.type?.__name
          || instance?.$?.type?.name
          || 'Unknown'
        console.error('Component:', componentName)
        
        // Parent chain
        let parent = instance.$parent
        const chain: string[] = [componentName]
        let depth = 0
        while (parent && depth < 10) {
          const parentName = parent.$options?.name 
            || parent.$options?.__name 
            || parent?.$?.type?.__name
            || 'Unknown'
          chain.push(parentName)
          parent = parent.$parent
          depth++
        }
        console.error('Parent chain (child → root):', chain.join(' → '))
      }
    } else {
      // Diğer Vue uyarıları için normal davranış
      console.warn(msg, trace)
    }
  }
})
