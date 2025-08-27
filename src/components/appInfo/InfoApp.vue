<template>
  <div class="app-container">
    <PhoneAppHeader title="Sobre" @back="$emit('back')" />
    <div class="content-area about-content">

      <section class="about-section">
        <p class="project-description">{{ aboutData.projectDescription }}</p>
      </section>

      <section class="about-section">
        <h2>{{ aboutData.technicalInfo.title }}</h2>
        <ul class="info-list">
          <li v-for="item in aboutData.technicalInfo.items" :key="item.label" class="info-item">
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </li>
        </ul>
      </section>

      <section class="about-section">
        <h2>{{ aboutData.credits.title }}</h2>
        <ul class="info-list">
          <li v-for="member in aboutData.credits.members" :key="member.role" class="info-item">
            <span class="label">{{ member.role }}</span>
            <span class="value">{{ member.name }}</span>
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
  margin-bottom: 30px;
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
}

h2 {
  font-size: 0.9em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  margin: 0 0 15px 0;
  letter-spacing: 0.5px;
}

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
