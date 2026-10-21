<template>
  <div class="blank-shell">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.blank-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>
