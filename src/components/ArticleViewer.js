let ArticleViewer = {
  props: ["iteminfo"],
  template:
    /* html */
    `
      <div id="article-viewer">
          <div id="modal-container">
              <div id="header-wrap"> 
                <span v-if="articleType=='habit'" class="typename-habit"> {{decodedType}} </span>
                <span v-if="articleType=='challenge'" class="typename-challenge"> {{decodedType}} </span>
                <span v-if="articleType=='learn'" class="typename-learn"> {{decodedType}} </span>
                
                <div id="close-btn" v-on:click="closeViewer">
                 <img src="./src/images/cancel.png" />
                </div>
              </div>
              <div id="contents-wrap">
                <h3>{{articleTitle}}</h3>
                <p id="writtenDate" >{{formattedWrittenDate}}</p>
                <p id="desc"><pre>{{articleDesc}}</pre></p>
                <div>
                  <img :src="imgSrc" />
                </div>
              </div>
          </div>
      </div>
      `,
  data() {
    return {
      articleType: this.iteminfo.data.type,
      articleTitle: this.iteminfo.data.title,
      articleDesc: this.iteminfo.data.desc,
      WrittenDate: this.iteminfo.data.createdAt,
      imgSrc: this.iteminfo.imgUrl,
    };
  },
  methods: {
    closeViewer: function () {
      this.$emit("close-viewer");
    },
  },
  computed: {
    decodedType: function () {
      const type = this.articleType;
      if (type === "habit") return "습관";
      else if (type === "challenge") return "도전";
      else if (type === "learn") return "배우기";
      else return "알 수 없는 유형";
    },

    formattedWrittenDate: function () {
      const dateObj = new Date(this.WrittenDate);
      const formattedStr = dateObj.toLocaleString();
      return formattedStr;
    },
  },
};
