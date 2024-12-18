<template>
  <v-dialog max-width="600" scrollable v-model="isOpen">

      <v-card color="#EEF5FC">
        <v-toolbar dark color="primary" style="z-index:999">
          <v-toolbar-title>API viewer</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="isOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="min-height:50vh" class="pa-4">

          <v-card class="mb-6">
            <v-card-title>
              About
            </v-card-title>
            <div class="px-4 pb-4" v-if="apiDialogUrl.indexOf('group_by=publication_year') > -1">
              This API call starts by <a href="https://docs.openalex.org/api-entities/works/get-lists-of-works">getting a list</a> of all
              <a href="https://docs.openalex.org/api-entities/works/work-object">Work objects</a> that satisfy the <a href="https://docs.openalex.org/api-entities/works/filter-works">filters applied.</a> Then it
              <a href="https://docs.openalex.org/api-entities/works/group-works">groups and counts</a> those works by publication year using the <code>group_by=publication_year</code> parameter.
            </div>

            <div class="px-4 pb-4" v-else-if="apiDialogUrl.indexOf('group_by=') > -1">
              This API call starts by <a href="https://docs.openalex.org/api-entities/works/get-lists-of-works">getting a list</a> of all
              <a href="https://docs.openalex.org/api-entities/works/work-object">Work objects</a> that satisfy the <a href="https://docs.openalex.org/api-entities/works/filter-works">filters applied.</a> Then it
              <a href="https://docs.openalex.org/api-entities/works/group-works">groups and counts</a> those works, based on the supplied <code>group_by</code> parameter.
            </div>

            <div class="px-4 pb-4" v-else-if="isSingletonApiCall">
              This API call gets information <a href="https://docs.openalex.org/how-to-use-the-api/get-single-entities">about a single entity,</a> based on its
              <a href="https://docs.openalex.org/how-to-use-the-api/get-single-entities#the-openalex-id">OpenAlex ID.</a>
            </div>

            <div class="px-4 pb-4" v-else>
              This API call <a href="https://docs.openalex.org/api-entities/works/get-lists-of-works">gets a list</a> of
              <a href="https://docs.openalex.org/api-entities/works/work-object">Work objects</a> with
              <a href="https://docs.openalex.org/api-entities/works/filter-works">your selected filters applied.</a>
            </div>
          </v-card>

          <v-card class="mb-6">
            <v-card-title>
              Request
              <v-spacer />
              <v-btn
                  icon
                  @click="copyToClipboard(apiDialogUrl)"
                  class="ml-2"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-card-title>
            <div class="pa-4" style="font-family: Monaco, monospace; font-size: 22px;">
              {{ apiDialogUrl }}
            </div>
          </v-card>

          <v-card outlined class="mb-12" :loading="isLoading">
            <v-card-title>
              Response
              <v-spacer />
              <v-btn
                  icon
                  :href="apiDialogUrl"
                  target="_blank"
                  class="ml-2"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn
                  icon
                  :disabled="!data"
                  @click="copyToClipboard(JSON.stringify(data))"
                  class="ml-2"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-card-title>
            <vue-json-pretty
                v-if="data"
                :data="data"
                :deep="3"
                :show-icon="true"
                :show-length="true"
                class="pa-4"
            />

          </v-card>

        </v-card-text>
      </v-card>

  </v-dialog>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import axios from "axios";
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css';
import {entityConfigs} from "@/entityConfigs";


export default {
  name: "Template",
  components: {
    VueJsonPretty,
  },
  props: {},
  data() {
    return {
      data: null,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters([

      "apiDialogUrl",
    ]),
    isSingletonApiCall(){
      return Object.keys(entityConfigs).some(k => {
        const searchString = `openalex.org/${k}/`
        return this.apiDialogUrl.indexOf(searchString) > -1
      })
    },
    isOpen: {
      get() {
        return !!this.$store.state.apiDialogUrl
      },
      set(val) {
        // you can only close it from here
        this.$store.state.apiDialogUrl = ""
      },
    },
  },

  methods: {
    ...mapMutations([
      "snackbar",
    ]),
    ...mapActions([]),
    async copyToClipboard(content) {
      await navigator.clipboard.writeText(content);
      this.snackbar("Copied to clipboard.")
    },

  },
  created() {
  },
  mounted() {
  },
  watch: {
    async isOpen(to, from) {
      console.log("apiDialog isOpen changed", to)
      if (!to) {
        this.data = null
        return
      }
      console.log("apiDialog getting data ")
      this.isLoading = true
      const resp = await axios.get(this.apiDialogUrl)
      console.log("apiDialog got data", resp)
      this.data = resp.data
      this.isLoading = false


    }
  }
}
</script>

<style scoped lang="scss">

</style>