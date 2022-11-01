let Mypage = {
  props: ["email", "articles"],
  template:
    /* html */
    `
    <div id="route-mypage" class="route">
      <h2 id="route-title">내 방</h2>

      <div class="group-container">
        <h3 class="group-title">계정</h3>
        <p>현재 접속하신 계정은 {{ email }} 입니다.</p>
        <button v-on:click="logout">로그아웃</button>
      </div>

      <div class="group-container">
        <h3 class="group-title">이메일 받기 설정</h3>
        <p>원하는 종류의 글을 하루 한 번 이메일로 받아볼 수 있습니다.</p>
        <p>현재 설정은 <strong>{{ emailSettingDesciption }}</strong>로 되어있습니다.</p>
        <button v-on:click="openMailSettingWriter">설정 변경하기</button>
      </div>
      <email-setting-writer v-if="writing" 
        :email_setting="emailsettingData" 
        v-on:finish-writing="closeMailSettingWriter"
        v-on:start-loading="startLoading"
        v-on:finish-loading="finishLoading">
      </email-setting-writer>


      <div class="group-container">
        <h3 class="group-title">내가 쓴 글</h3>
        <p>그동안 쓴 글을 모아서 보여드립니다. 내용을 수정하거나 글을 삭제할 수 있습니다.</p>
        <div>
          <row-item 
            v-for="article in myArticles" 
            :key="article.id + article.data.title" 
            :iteminfo="article" 
            v-on:open-viewer="openViewer" 
            v-on:open-rewriter="openRewriter" 
            v-on:open-confirm="openConfirm">
          </row-item>
        </div>
      </div>

      <article-rewriter 
        v-if="showRewriter" 
        v-on:close-rewriter="closeRewriter" 
        v-on:start-loading="startLoading" 
        v-on:finish-loading="finishLoading" 
        :iteminfo="targetArticle">
      </article-rewriter>
      <delete-confirm-modal 
        v-if="showDeleteConfirm" 
        v-on:close-confirm="closeConfirm" 
        v-on:start-loading="startLoading"
        v-on:finish-loading="finishLoading"
        v-on:refresh-articles="refreshArticles"
        :iteminfo="targetArticle">
      </delete-confirm-modal>
    </div>
    `,
  data() {
    return {
      writing: false,
      emailsettingData: null,
      emailSettingDesciption: "",
      decodedType: {
        habit: "습관",
        challenge: "도전",
        learn: "배우기",
      },

      //
      myArticles: [],
      showRewriter: false,
      showDeleteConfirm: false,
      targetArticle: null,
    };
  },
  methods: {
    logout: async function () {
      try {
        this.$emit("startloading");
        firebaseFuncs.logout();
        this.$router.push("/");
        this.$emit("logout-success");
      } catch (err) {
        alert("로그아웃이 정상적으로 수행되지 않았습니다. 재시도해주세요.");
      } finally {
        this.$emit("finishloading");
      }
    },
    // -------------
    openMailSettingWriter: function () {
      this.writing = true;
    },
    closeMailSettingWriter: function (value) {
      this.writing = false;
      this.emailsettingData = value;
      this.emailSettingDesciption = this.getEmailSettingDesciption(value);
    },
    getEmailSettingData: async function () {
      try {
        this.startLoading();
        const emailSetting = await firebaseFuncs.getUserMailSetting(this.email);
        this.emailsettingData = emailSetting;
        this.emailSettingDesciption = this.getEmailSettingDesciption(emailSetting);
      } catch (err) {
        console.error(err);
      } finally {
        this.finishLoading();
      }
    },
    startLoading: function () {
      this.$emit("start-loading");
    },
    finishLoading: function () {
      this.$emit("finish-loading");
    },
    getEmailSettingDesciption: function (emailSetting) {
      let result = "";
      const time = emailSetting.sendTime;
      const type = emailSetting.sendType;
      const typeNum = type.length;

      if (time === "no" || typeNum <= 0) {
        result = "이메일 받지 않기";
      } else {
        // time
        let timeDesc = "";
        if (time == "morning") timeDesc = "오전 6시";
        else if (time == "night") timeDesc = "오후 8시";

        // type
        let typeDesc = `${typeNum}개 유형`;
        if (typeNum > 0) {
          typeDesc += "( ";
          if (type.includes("habit")) typeDesc += "습관 ";
          if (type.includes("challenge")) typeDesc += "도전 ";
          if (type.includes("learn")) typeDesc += "배우기 ";
          typeDesc += ")";
        }

        // combine
        result = `매일 ${timeDesc}에 ${typeDesc}의 글을 이메일로 받기`;
      }

      return result;
    },
    // --------------------

    getMyArticles: function () {
      if (
        !this.articles ||
        !this.articles.habit ||
        !this.articles.challenge ||
        !this.articles.learn
      )
        return [];

      const arr = [];
      const habit = this.articles.habit;
      const challenge = this.articles.challenge;
      const learn = this.articles.learn;

      for (let i = 0; i < habit.length; i++) {
        if (habit[i].data.writer == this.email) arr.push(habit[i]);
      }
      for (let i = 0; i < challenge.length; i++) {
        if (challenge[i].data.writer == this.email) arr.push(challenge[i]);
      }
      for (let i = 0; i < learn.length; i++) {
        if (learn[i].data.writer == this.email) arr.push(learn[i]);
      }

      return arr;
    },
    openViewer: function (value) {
      this.$emit("open-viewer", value);
    },

    openRewriter: function (value) {
      this.targetArticle = value;
      this.showRewriter = true;
    },
    closeRewriter: function (value) {
      this.showRewriter = false;
    },
    openConfirm: function (value) {
      this.targetArticle = value;
      this.showDeleteConfirm = true;
    },
    closeConfirm: function () {
      this.showDeleteConfirm = false;
    },
    refreshArticles: function () {
      this.$emit("refresh-articles");
    },
  },
  mounted() {
    if (!this.email) {
      this.$router.push("/auth");
    } else {
      this.getEmailSettingData();
      this.myArticles = this.getMyArticles();
    }
  },
  watch: {
    articles: function () {
      this.myArticles = this.getMyArticles();
    },
  },
};
