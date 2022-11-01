let Habit = {
  props: ["articles_habit", "email"],
  template:
    /* html */
    `
    <div id="route-habit" class="route">
      <h2 id="type-title">습관</h2>
      <p id="type-desc">누구나 쉽게 행동으로 옮길 수 있는 친환경의 실천방법들이 모여있습니다. 나만 알고 있는 사소한 친환경 습관이 있다면 모두가 일상에 녹일 수 있도록 나눠주세요</p>

      <div id="item-grid">
        <div id="new-article" v-on:click="handleNewBtnClick">
          <div class="img-wrap">
            <img src="./src/images/add.png" width="100px" />
          </div>
          <h3 class="item-title">새로운 습관 공유하기</h3>
        </div>
        <square-item v-for="article in articles_habit" :key="article.id" :iteminfo="article" v-on:open-viewer="openViewer"></square-item>
      </div>
    </div>
    `,
  data() {
    return {
      //articles: this.getArticles(),
    };
  },
  methods: {
    handleNewBtnClick: function () {
      if (!this.email) {
        this.$router.push("/auth");
      } else {
        this.$emit("start-writing", "habit");
      }
    },
    // getArticles: async function () {
    //   try {
    //     this.$emit("start-loading");
    //     const articlesRef = await firebaseFuncs.getCollectionRefFromFirestore("habit");
    //     await articlesRef.onSnapshot(async (snapshot) => {
    //       try {
    //         this.articles = await firebaseFuncs.getAtriclesFromSnapshot(snapshot);
    //       } catch (err) {
    //         console.error(err);
    //       } finally {
    //         this.$emit("finish-loading");
    //       }
    //     });
    //   } catch (err) {
    //     console.error(err);
    //     this.$emit("finish-loading");
    //   } finally {
    //     //
    //   }
    // },
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },
  },
};
