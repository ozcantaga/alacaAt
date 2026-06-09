export default defineAppConfig({
  ui: {
    // ─── Button Defaults ──────────────────────────────────────────────
    button: {
      defaultVariants: {
        color: 'primary',
      },
      variants: {
        // Premium round icon button (sosyal medya, navigasyon ikonları)
        premium: {
          base: 'rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 bg-black/5 hover:bg-(--color-primary-500) text-(--text-heading) hover:text-(--ui-bg-elevated) ring-0 shadow-none hover:shadow-lg cursor-pointer',
        },
      },
    },

    // ─── Container Defaults ───────────────────────────────────────────
    container: {
      base: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    },

    // ─── Card Defaults ────────────────────────────────────────────────
    card: {
      slots: {
        root: 'rounded-2xl border bg-(--ui-bg-elevated) shadow-sm transition-all duration-500',
        body: 'p-6',
      },
    },

    // ─── Badge Defaults ───────────────────────────────────────────────
    badge: {
      defaultVariants: {
        color: 'primary',
        variant: 'subtle',
      },
    },

    // ─── Modal Defaults ───────────────────────────────────────────────
    modal: {
      slots: {
        overlay: 'bg-black/80 backdrop-blur-sm',
        content: 'rounded-3xl',
      },
    },

    // ─── Popover Defaults ─────────────────────────────────────────────
    popover: {
      slots: {
        content: 'rounded-2xl shadow-xl border bg-(--ui-bg-elevated)',
      },
    },
  },
})
