import "uikit/dist/css/uikit.min.css";
import "../styles/style.scss";

import UiKit from "uikit";
import _ from "lodash";
import { coctailsUrls } from "./http";
import { data } from "./vue-page/vueData";

const app = new Vue({
  el: "#app",
  data: data,
  methods: {
    async getRandomCoctail() {
      try {
        const res = await fetch(coctailsUrls.random);
        const parsedRes = await res.json();
        UiKit.notification({
          message: "Data loaded successfuly",
          status: "success",
        });
        return parsedRes;
      } catch (error) {
        UiKit.notification({ message: error, status: "danger" });
      }
    },
    async getSearchedCoctails() {
      if (!this.searchQuery) {
        this.coctails = [];
      } else {
        try {
          const res = await fetch(
            `${coctailsUrls.search}?s=${this.searchQuery}`
          );
          const parsedRes = await res.json();
          this.coctails = await parsedRes.drinks;
        } catch (error) {
          UiKit.notification({ message: error, status: "danger" });
        }
      }
    },
    debouncedCoctailSearch() {
      _.debounce(this.getSearchedCoctails(), 500);
    },
  },
  async created() {
    const data = await this.getRandomCoctail();
    this.randomCoctail = data.drinks[0];
  },
  watch: {
    searchQuery() {
      update: this.getSearchedCoctails()
    },
  },
});
