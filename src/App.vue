<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout">
    <!-- <el-container> -->
    <!-- <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <RouterLink to="/">view1</RouterLink>
          <RouterLink to="/view2">view2</RouterLink>
          <el-button type="primary" @click="$router.push({ name: 'v1children' })">跳转</el-button>
          <RouterView />
        </el-main>
      </el-container>
    </el-container> -->

    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;

    .el-header {
      background-color: #c6e2ff;
    }

    .el-container {
      .el-aside {
        background-color: #d9ecff;
      }

      .el-main {
        background-color: #ecf5ff;
      }
    }
  }
}
</style>
