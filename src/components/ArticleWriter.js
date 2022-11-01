let ArticleWriter = {
  props: ["type", "email"],
  template:
    /* html */
    `
    <div id="article-writer">
        <div id="form-container">
            <div id="close-btn" v-on:click="closeWriter">
                <img src="./src/images/cancel.png" />
            </div>
            <form>
              <div class="input-set">
                  <p class="input-title">작성자</p>
                  <div class="input-content">
                      <p>{{ email }}</p>
                  </div>
              </div>

              <div class="input-set">
                  <p class="input-title">종류</p>
                  <div class="input-content">
                      <select v-model="articleType">
                          <option value="habit">습관</option>
                          <option value="challenge">도전</option>
                          <option value="learn">배우기</option>
                      </select>
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
                  <p class="input-title">사진첨부</p>
                  <div class="input-content">
                      <input type="file" v-on:change="setImgfile" accept="image/*" />
                  </div>
              </div>
              <div class="input-set">
                  <button v-on:click="write">게시하기</button>
              </div>
            </form>
            
        </div>
    </div>
    `,
  data() {
    return {
      articleType: this.type,
      articleTitle: "",
      articleDesc: "",
      imgfile: "",

      descriptionAdvice:
        "설명의 길이는 짧아도 길어도 좋아요. 서술방식이 간략해도 자세해도 좋아요. 😉 \n어떤 과정에서 이런 훌륭한 친환경🌿 실천 방법을 떠올리거나 배우셨을까요?\n먼저 이런 실천을 하고 지식을 익히신 입장에서 이와 관련한 어떤 일들이 있었는지 궁금해요.🧐 \n또, 공유해주신 이 내용은 환경에 구체적으로 어떻게 💪도움이 될 수 있을까요?\n\n그리고.. 👀 혹시 내용의 대부분이 다른사람의 것이라면 저작권에 위배되지 않도록 잘 살펴주세요!🙏",
    };
  },
  methods: {
    closeWriter: function () {
      this.$emit("finish-writing");
    },
    setImgfile: function (e) {
      this.imgfile = e.target.files[0];
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
    write: async function () {
      if (this.isValid()) {
        try {
          this.$emit("start-loading");

          let imgPath = null;
          let imgdownloadUrl = null;

          if (this.imgfile) {
            const storageRes = await firebaseFuncs.sendImageToStorage(this.imgfile);
            imgPath = storageRes.res._delegate.metadata.fullPath;
            imgdownloadUrl = storageRes.url;
          }

          const reqData = {
            type: this.articleType,
            title: this.articleTitle,
            desc: this.articleDesc,
            img: imgPath,
            writer: this.email,
            createdAt: Date.now(),
            editedAt: null,
            imgdownloadUrl: imgdownloadUrl,
          };
          const firestoreRes = await firebaseFuncs.writeNewArticleToFireStore(
            this.articleType,
            reqData
          );

          this.closeWriter();
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
