<script setup lang="ts">
import {BRAND_IDS, CHART_IDS, getBrand} from '~/helper/beads/brands'
import {BEADWORK_IDS, CRAFTS} from '~/helper/beads/crafts'
import {GUIDES} from '~/helper/guides'
</script>

<template>
  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div>
          <h2 class="footer-title">Pattern makers</h2>
          <ul>
            <li v-for="id in BRAND_IDS" :key="id"><NuxtLink :to="`/${getBrand(id).slug}`">{{ getBrand(id).name }} bead pattern maker</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Beadwork</h2>
          <ul>
            <li v-for="id in BEADWORK_IDS" :key="id"><NuxtLink :to="`/${CRAFTS[id].slug}`">{{ CRAFTS[id].title }}</NuxtLink></li>
            <li><NuxtLink to="/bead-letters">Bead letters</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Colour charts</h2>
          <ul>
            <li v-for="id in CHART_IDS" :key="id"><NuxtLink :to="`/colors/${id}`">{{ getBrand(id).name }} colour chart</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Patterns</h2>
          <ul>
            <li><NuxtLink to="/patterns">All bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/tag">Themes A to Z</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/easy">Easy bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/medium">Medium bead patterns</NuxtLink></li>
            <li><NuxtLink to="/patterns/level/hard">Hard bead patterns</NuxtLink></li>
            <li><a href="https://simplepixelart.com">Draw pixel art on SimplePixelArt</a></li>
          </ul>
        </div>
        <div>
          <h2 class="footer-title">Guides</h2>
          <ul>
            <li v-for="g in GUIDES" :key="g.slug"><NuxtLink :to="`/guides/${g.slug}`">{{ g.title }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <p class="credit">Bead colours from <a href="https://github.com/maxcleme/beadcolors">beadcolors</a> (MIT). DMC floss numbers from our own reference table. Perler, Hama, Artkal, Nabbi, MARD, DMC, Miyuki and Toho are trademarks of their owners; this site is not affiliated with them.</p>
    </div>
  </footer>
</template>
