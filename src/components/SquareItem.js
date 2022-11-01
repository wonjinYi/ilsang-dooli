let SquareItem = {
  props: ["iteminfo"], // title, imgurl, type, id
  template:
    /* html */
    `
    <div id="square-item" v-on:click="openViwer">
        <div class="img-wrap">
            <img :src="iteminfo.imgUrl" />
        </div>
        <h3 class="item-title">{{ iteminfo.data.title }}</h3>
    </div>
    `,
  methods: {
    openViwer: function () {
      this.$emit("open-viewer", this.iteminfo);
    },
  },
};
