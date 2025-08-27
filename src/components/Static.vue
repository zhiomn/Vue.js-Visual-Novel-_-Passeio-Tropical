<template>
  <div class="static-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// --- NEW: Props for configuration ---
const props = defineProps({
  // The desired frames per second for the static animation.
  // A lower number means the static will update less frequently (slower).
  // A higher number means it will update more frequently (faster).
  fps: {
    type: Number,
    default: 5, // A good default value. 60 would be max speed.
  },
});

const canvasRef = ref(null);
let animationFrameId = null;

// --- NEW: Variables for timing the animation ---
let lastTime = 0;
// Calculate the time that needs to pass between frames to achieve the desired FPS.
// e.g., for 30 FPS, frameInterval will be 1000 / 30 = 33.33ms.
const frameInterval = 1000 / props.fps;


onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // The main drawing loop now receives a 'timestamp' from requestAnimationFrame
  const draw = (timestamp) => {
    // Request the next frame immediately.
    animationFrameId = requestAnimationFrame(draw);

    // --- NEW: Throttling logic ---
    // Calculate the time elapsed since the last frame was drawn.
    const elapsed = timestamp - lastTime;

    // If not enough time has passed, skip this frame.
    if (elapsed < frameInterval) {
      return;
    }
    
    // Update lastTime, accounting for any potential lag.
    // This prevents the animation from "drifting" over time.
    lastTime = timestamp - (elapsed % frameInterval);


    // --- The drawing logic (now runs only when the time is right) ---
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const imageData = ctx.createImageData(width, height);
    const buffer = imageData.data;

    for (let i = 0; i < buffer.length; i += 4) {
      const randomGrayValue = Math.random() * 255;
      buffer[i] = randomGrayValue;
      buffer[i + 1] = randomGrayValue;
      buffer[i + 2] = randomGrayValue;
      buffer[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Start the animation loop
  draw(0); // Start with an initial timestamp of 0
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
.static-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  pointer-events: none;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
