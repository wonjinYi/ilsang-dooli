let Challenge = {
  props: ["articles_challenge", "email"],
  template:
    /* html */
    `
    <div id="route-challenge" class="route">
      <h2 id="type-title">도전</h2>
      <p id="type-desc">습관처럼 직접 실천 가능한 것이지만 비교적 노력과 시간, 혹은 그 이외의 것을 투자해야 하는 친환경 생활의 방법이 모여있습니다. <br> 습관과 도전의 아주 엄밀한 구분은 없습니다. 남들과 나누고픈 도전과제가 있다면 여기에 공유해주세요.</p>

      <div id="item-grid">
        <div id="new-article" v-on:click="handleNewBtnClick">
          <div class="img-wrap">
            <img src="./src/images/add.png" width="100px" />
          </div>
          <h3 class="item-title">새로운 도전 공유하기</h3>
        </div>
        <square-item v-for="article in articles_challenge" :key="article.id" :iteminfo="article" v-on:open-viewer="openViewer"></square-item>
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
        this.$emit("start-writing", "challenge");
      }
    },
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },
  },
};
