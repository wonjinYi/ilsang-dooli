let HorizontalList = {
  props: ["datalist"],
  template:
    /* html */
    `
    <div id="horizontal-list"> 
        <div class="item-container" ref="ic">
          <square-item v-if="datalistLength==0" :iteminfo="dummydata" ></square-item>
          <square-item v-else v-on:open-viewer="openViewer" v-for="data in datalist" :iteminfo="data" :key="data.id"></square-item>
        </div>
        
        <div class="left-scroll scroll" v-on:click="scrollLeft"><img src="./src/images/leftScroll.png" /></div>
        <div class="right-scroll scroll"v-on:click="scrollRight"><img src="./src/images/rightScroll.png" /></div>
    </div>
    `,
  data() {
    return {
      scrollDistance: 0,
      showDefaultItem: false,
      dummydata: {
        id: null,
        data: {
          title: "첫 번째 글을 적어주세요",
          img: null,
        },
        imgUrl: "./src/images/no-pictures.png",
      },
    };
  },
  computed: {
    datalistLength: function () {
      if (!this.datalist) return 0;

      return this.datalist.length;
    },
  },
  methods: {
    scrollLeft: function () {
      this.scroll(1);
    },
    scrollRight: function () {
      this.scroll(-1);
    },
    scroll: function (direction) {
      // direction : 1이면 left, -1이면 right
      const ITEM_WIDTH = 256 + 32;
      const ITEM_CONTAINER_LEFT_MARGIN = 32;

      const el = this.$refs.ic;

      const realWidth = (this.datalist.length + 1) * ITEM_WIDTH + ITEM_CONTAINER_LEFT_MARGIN; // overflow된 요소를 포함한 width
      const visibleWidth = el.offsetWidth; // 화면에 표시되는 width
      const diff = realWidth - visibleWidth; // overflow된 width.

      if (diff <= 0) return;

      this.scrollDistance += direction * ITEM_WIDTH;

      if (Math.abs(diff) < Math.abs(this.scrollDistance))
        // 오버플로우 된 만큼을 초과해서 스크롤했으면
        this.scrollDistance -= direction * ITEM_WIDTH; // 다시 돌아가
      if (this.scrollDistance > 0) this.scrollDistance = 0; // 원래 오버플로우 안된쪽으론 못가

      el.style.transform = `translateX(${this.scrollDistance}px)`;
      el.style.transitionDuration = "500ms";
    },
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },
  },
};
