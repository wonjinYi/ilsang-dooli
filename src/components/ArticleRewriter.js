let ArticleRewriter = {
  props: ["iteminfo"],
  template:
    /* html */
    `
      <div id="article-rewriter">
          <div id="form-container">
              <div id="close-btn" v-on:click="closeRewriter">
                  <img src="./src/images/cancel.png" />
              </div>
              <form>
                <div class="input-set">
                    <p class="input-title">작성자</p>
                    <div class="input-content">
                        <p>{{ iteminfo.data.writer }}</p>
                    </div>
                </div>
  
                <div class="input-set">
                    <p class="input-title">제목</p>
                    <div class="input-content">
                    <input type="text" v-model="articleTitle" placeholder="내용을 잘 설명하는 제목을 정해주세요 😃" />
                    </div>
                </div>
  
  
                <div class="input-set">
                    <p class="input-title">설명</p>
                    <div class="input-content">
                        <textarea v-model="articleDesc" :placeholder="descriptionAdvice"></textarea>
                    </div>
                </div>
  
                <div class="input-set">
                    <button v-on:click="rewrite">게시하기</button>
                </div>
              </form>
              
          </div>
      </div>
      `,
  data() {
    return {
      articleType: this.iteminfo.data.type,
      articleTitle: this.iteminfo.data.title,
      articleDesc: this.iteminfo.data.desc,

      descriptionAdvice:
        "설명의 길이는 짧아도 길어도 좋아요. 서술방식이 간략해도 자세해도 좋아요. 😉 \n어떤 과정에서 이런 훌륭한 친환경🌿 실천 방법을 떠올리거나 배우셨을까요?\n먼저 이런 실천을 하고 지식을 익히신 입장에서 이와 관련한 어떤 일들이 있었는지 궁금해요.🧐 \n또, 공유해주신 이 내용은 환경에 구체적으로 어떻게 💪도움이 될 수 있을까요?\n\n그리고.. 👀 혹시 내용의 대부분이 다른사람의 것이라면 저작권에 위배되지 않도록 잘 살펴주세요!🙏",
    };
  },
  methods: {
    closeRewriter: function () {
      this.$emit("close-rewriter", this.articleTitle);
    },
    isValid: function () {
      if (!this.articleType.trim() || !this.articleTitle.trim() || !this.articleDesc.trim()) {
        alert("종류, 제목, 설명 중 비어있는 곳이 있습니다.");
        return false;
      }

      if (!serviceEnum.getItem("articleType").includes(this.articleType)) {
        alert("올바르지 않은 게시글 종류입니다. 습관, 도전, 배우기만 가능합니다.");
        return false;
      }

      return true;
    },
    rewrite: async function () {
      if (this.isValid()) {
        try {
          this.$emit("start-loading");

          const reqData = {
            type: this.articleType,
            title: this.articleTitle,
            desc: this.articleDesc,
            img: this.iteminfo.data.img,
            writer: this.iteminfo.data.writer,
            createdAt: this.iteminfo.data.createdAt,
            editedAt: Date.now(),
            imgdownloadUrl: this.iteminfo.data.imgdownloadUrl,
          };
          const firestoreRes = await firebaseFuncs.rewriteArticleToFireStore(
            this.articleType,
            this.iteminfo.id,
            reqData
          );

          this.closeRewriter();
        } catch (err) {
          console.log(err);
          alert("예상치 못한 문제가 발생했습니다. : " + err.code + " / " + err.message);
        } finally {
          this.$emit("finish-loading");
        }
      }
    },
  },
};
