<template>
  <div class="app-container">
    <PhoneAppHeader title="Sobre" @back="$emit('back')" />
    <div class="content-area about-content">

      <section class="about-section">
        <p class="project-description">{{ aboutData.projectDescription }}</p>
      </section>

      <!-- Seção de Créditos Redesenhada -->
      <section class="about-section">
        <h2 class="main-title">{{ aboutData.credits.title }}</h2>
        <div 
          v-for="group in aboutData.credits.groups" 
          :key="group.title" 
          class="credit-group-card"
        >
          <h3 class="group-title">{{ group.title }}</h3>
          <div 
            v-for="member in group.members" 
            :key="member.role" 
            class="credit-item"
          >
            <span class="role">{{ member.role }}</span>
            <span class="name">{{ member.name }}</span>
          </div>
        </div>
      </section>

      <!-- Seção Técnica (sem alterações de design necessárias) -->
      <section class="about-section">
        <h2 class="main-title">{{ aboutData.technicalInfo.title }}</h2>
        <ul class="info-list">
          <li v-for="item in aboutData.technicalInfo.items" :key="item.label" class="info-item">
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </li>
        </ul>
      </section>
      
    </div>
  </div>
</template>

<script setup>
import PhoneAppHeader from '../phone/PhoneAppHeader.vue';
import aboutData from '@/data/about.json';

defineEmits(['back']);
</script>

<style scoped>
.about-content {
  padding: 15px 20px;
}

.about-section {
  margin-bottom: 35px;
}

.about-section:last-child {
  margin-bottom: 0;
}

.project-description {
  font-family: var(--font-narrative);
  font-size: 1.1em;
  line-height: 1.7;
  color: var(--color-text-primary);
  margin: 0;
  font-style: italic;
  opacity: 0.9;
  text-align: center;
  padding: 10px 0;
}

.main-title {
  font-size: 0.9em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  margin: 0 0 15px 0;
  letter-spacing: 0.5px;
}

/* --- NOVOS ESTILOS PARA OS CARDS DE CRÉDITO --- */
.credit-group-card {
  background-color: #2c2f33;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid var(--color-border);
}

.group-title {
  font-size: 1.1em;
  color: var(--color-primary);
  margin: 0 0 15px 0;
  font-weight: 600;
}

.credit-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.credit-item:last-child {
  margin-bottom: 0;
}

.role {
  font-size: 0.8em;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.name {
  font-size: 1em;
  color: var(--color-text-primary);
  line-height: 1.5;
}


/* Estilos antigos para a lista técnica */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
}

.label {
  color: var(--color-text-muted);
}

.value {
  color: var(--color-text-primary);
  font-weight: 500;
  text-align: right;
}
</style>
