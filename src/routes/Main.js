let Main = {
  props: ["articles"],
  template:
    /* html */
    `
    <div id="route-main" class="route">
    <div id="intro">
      <img src="./src/images/wooden-board-with-unfocused-nature-background (1).jpg" />
      <div id="intro-txt">
        <h3> 오늘의 환경문제에 맞서 우리의 할 일을 찾는 곳</h3>
        <br>
        <p>공유된 글들을 둘러보고 내가 참여할 일상을 찾아보세요.<br>나누고 싶은 또 다른 일상이 있다면 모두에게 알려주세요.</p>
        </div>
    </div>

      <div class="group-container">
        <h2 class="group-title">습관</h2>
        <p class="group-desc">언제든 부담없이 지속적으로 실천할 수 있는 일이에요.</p>
        <horizontal-list :datalist="articles.habit" v-on:open-viewer="openViewer"></horizontal-list>
      </div>

      <div class="group-container">
        <h2 class="group-title">도전</h2>
        <p class="group-desc">습관보다는 약간 어렵지만 시간과 마음이 허락한다면 충분히 해볼만 한 일이에요.</p>
        <horizontal-list :datalist="articles.challenge" v-on:open-viewer="openViewer"></horizontal-list>
      </div>

      <div class="group-container">
        <h2 class="group-title">배우기</h2>
        <p class="group-desc">앞으로의 친환경 실천에 큰 도움이 될 정보들을 얻어보세요.</p>
        <horizontal-list :datalist="articles.learn" v-on:open-viewer="openViewer"></horizontal-list>
      </div>
    </div>
    `,
  data() {
    return {
      habitDistance: 0,
      challengeDistance: 0,
      learnDistance: 0,
    };
  },
  methods: {
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },
  },
};
