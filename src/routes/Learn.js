let Learn = {
  props: ["articles_learn", "email"],
  template:
    /* html */
    `
    <div id="route-learn" class="route">
      <h2 id="type-title">배우기</h2>
      <p id="type-desc">친환경적 활동에 도움이 되는 지식이 모여있는 곳입니다. 모두에게 도움이 될 만한 자신의 정보와 노하우를 공유해주세요.</p>

      <div id="item-grid">
        <div id="new-article" v-on:click="handleNewBtnClick">
          <div class="img-wrap">
            <img src="./src/images/add.png" width="100px" />
          </div>
          <h3 class="item-title">새로운 지식 공유하기</h3>
        </div>
        <square-item v-for="article in articles_learn" :key="article.id" :iteminfo="article" v-on:open-viewer="openViewer"></square-item>
      </div>
    </div>
    `,
  data() {
    return {
      //
    };
  },
  methods: {
    handleNewBtnClick: function () {
      if (!this.email) {
        this.$router.push("/auth");
      } else {
        this.$emit("start-writing", "learn");
      }
    },
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },
  },
};
