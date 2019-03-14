<template>
  <v-app>
    <section v-if="errored">
      <p>Unable to fetch beers! Please try again later...</p>
    </section>

    <section v-else>
      <div v-if="loading">Fetching beers for you...</div>

      <div v-else>
        <v-data-table
          :headers="headers"
          :items="filteredBeers"
          hide-actions
          :pagination.sync="pagination"
        >
          <template v-slot:items="props">
            <td>
              <img
                :src="props.item.image_url"
                width="20"
                height="60"
                :title="props.item.description"
                :alt="props.item.name"
              >
            </td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.abv }}%</td>
            <td>{{ props.item.ibu }}</td>
            <td>{{ props.item.first_brewed }}</td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
        <v-switch v-model="strong_beers" :label="`Strong beers only (>7%)`"></v-switch>
      </div>
    </section>
  </v-app>
</template>

<script>
import beersRepository from './api/beersRepository';

export default {
  name: "App",

  data() {
    return {
      pagination: {},
      headers: [
        {
          sortable: false
        },
        {
          text: "Beer",
          align: "left",
          value: "name"
        },
        { text: "ABV", value: "abv" },
        { text: "IBU", value: "ibu" },
        { text: "First Brewed", value: "first_brewed" }
      ],
      strong_beers: false,
      beers: [],
      loading: true,
      errored: false
    };
  },
  mounted() {
    beersRepository.getByMalt("extra_pale")
      .then(response => {
        this.beers = response.data;
        this.pagination.rowsPerPage = 5;
        this.pagination.totalItems = this.beers.length;
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    },
    filteredBeers() {
      if (this.beers.length == 0) return [];

      // apply filter based on strong beers Switch
      const filtered = this.beers.filter(
        beer => !this.strong_beers || beer.abv > 7.0
      );

      // update number of pages to display
      this.pagination.totalItems = filtered.length;

      return filtered;
    }
  }
};
</script>
