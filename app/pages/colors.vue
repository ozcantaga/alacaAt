<template>
  <!-- 1. Zemin Rengi (Page Background) -->
  <div class="page-wrapper">
    
    <div class="system-label absolute-label">
      Zemin: var(--color-page-bg) <span class="code">#bfe4f6</span>
    </div>

    <!-- Yükseltilmiş Kart (Elevated UI) -->
    <div class="ui-card">
      
      <div class="system-label">
        Kart Arka Plan: var(--ui-bg-elevated) <span class="code">rgba(255, 255, 255, 0.85)</span>
      </div>

      <!-- 2. Metin Renkleri -->
      <h1 class="title">
        Alaçatı'nın İncisine Hoş Geldiniz
        <span class="color-badge heading-badge">#3D405B</span>
      </h1>
      
      <p class="body-text">
        Ege'nin huzur veren maviliğinde, 
        <span class="highlight">
          unutulmaz bir tatil 
          <span class="color-badge highlight-badge">#E07A5F</span>
        </span> 
        deneyimi sizi bekliyor. Taş evlerimizin sıcaklığında kendinizi evinizde hissedin.
        <span class="color-badge body-badge">#3D405B</span>
      </p>
      
      <p class="muted-text">
        * Kahvaltı servisimiz sabah 08:30 - 11:00 arasındadır.
        <span class="color-badge muted-badge">#3D405B (Opacity: 0.7)</span>
      </p>

      <!-- 3. Buton & CTA (Call to Action) Renkleri -->
      <div class="button-group">
        <div class="btn-container">
          <button class="btn-primary">
            Hemen Rezervasyon Yap
          </button>
          <div class="system-label text-center">
            BG: <span class="code">#E07A5F</span> <br>
            Hover: <span class="code">#b1442a</span> <br>
            Yazı: <span class="code">rgba(255,255,255,0.85)</span>
          </div>
        </div>

        <div class="btn-container">
          <button class="btn-outline">
            Odaları İncele
          </button>
          <div class="system-label text-center">
            Çizgi/Yazı: <span class="code">#3D405B</span> <br>
            Hover BG: <span class="code">#3D405B</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
:root {
  --animate-duration-slow: 800ms;
  --color-page-bg: #bfe4f6;
  --ui-bg-elevated: rgba(255, 255, 255, 0.85);
  --text-heading: #3D405B;
  --text-body: #3D405B;
  --text-muted: #3D405B;
  --text-highlight: #E07A5F;
  --color-primary-500: #E07A5F;
  --color-primary-600: #3D405B;
  --color-primary-700: #b1442a;
  --text-inverse: rgba(255, 255, 255, 0.85);
}

/* --- YAPI STİLLERİ --- */

.page-wrapper {
  background-color: var(--color-page-bg);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
}

.ui-card {
  background-color: var(--ui-bg-elevated);
  padding: 3rem;
  border-radius: 1rem;
  max-width: 650px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
}

/* --- BİLGİ ETİKETLERİ (DESIGN SYSTEM GÖSTERİMİ İÇİN) --- */

.system-label {
  font-size: 0.75rem;
  color: #64748b; /* Nötr bir gri */
  margin-bottom: 1rem;
  font-family: monospace;
}

.absolute-label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255,255,255,0.5);
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.code {
  font-weight: bold;
  color: #0f172a;
  background: rgba(0,0,0,0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
}

.text-center {
  text-align: center;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.color-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-family: monospace;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  vertical-align: middle;
  margin-left: 0.5rem;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

/* Badge Renk Eşleştirmeleri */
.heading-badge, .body-badge { background-color: var(--text-heading); color: #fff; }
.highlight-badge { background-color: var(--text-highlight); color: #fff; }
.muted-badge { background-color: var(--text-muted); color: #fff; opacity: 0.7; }

/* --- TİPOGRAFİ STİLLERİ --- */

.title {
  color: var(--text-heading);
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.body-text {
  color: var(--text-body);
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--text-highlight);
  font-weight: 600;
}

.muted-text {
  color: var(--text-muted);
  font-size: 0.875rem;
  opacity: 0.7;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
}

/* --- BUTON STİLLERİ --- */

.button-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-primary {
  background-color: var(--color-primary-500);
  color: var(--text-inverse);
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color var(--animate-duration-slow) ease; 
  width: 100%;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary-600);
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 2px solid var(--color-primary-600);
  cursor: pointer;
  transition: all var(--animate-duration-slow) ease;
  width: 100%;
}

.btn-outline:hover {
  background-color: var(--color-primary-600);
  color: var(--text-inverse);
}
</style>