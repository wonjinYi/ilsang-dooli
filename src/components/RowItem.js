let RowItem = {
  props: ["iteminfo"],
  template:
    /* html */
    `
    <div id="row-item">
        <!-- type -->
        <span v-if="type=='habit'" class="typename-habit"> {{decodedType}} </span>
        <span v-else-if="type=='challenge'" class="typename-challenge"> {{decodedType}} </span>
        <span v-else-if="type=='learn'" class="typename-learn"> {{decodedType}} </span>
        
        <div id="edit-btn" class="btn" v-on:click="openRewriter">수정</div>
        <div id="delete-btn" class="btn" v-on:click="openDeleteConfirm">삭제</div>
        <p id="title" v-on:click="handleTitleClick">{{title}}</p>
    </div>
    `,
  data() {
    return {
      type: this.iteminfo.data.type,
      title: this.iteminfo.data.title,
    };
  },
  computed: {
    decodedType: function () {
      const type = this.type;
      if (type === "habit") return "습관";
      else if (type === "challenge") return "도전";
      else if (type === "learn") return "배우기";
      else return "알 수 없는 유형";
    },
  },
  methods: {
    handleTitleClick: function () {
      this.$emit("open-viewer", this.iteminfo);
    },
    openRewriter: function () {
      this.$emit("open-rewriter", this.iteminfo);
    },
    openDeleteConfirm: function () {
      this.$emit("open-confirm", this.iteminfo);
    },
  },
};
