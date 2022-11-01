// 라우팅 설정
const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Main,
    },
    {
      path: "/habit",
      component: Habit,
    },
    {
      path: "/challenge",
      component: Challenge,
    },
    {
      path: "/learn",
      component: Learn,
    },
    {
      path: "/auth",
      component: Auth,
    },
    {
      path: "/mypage",
      component: Mypage,
    },
  ],
});

// 전역 컴포넌트
Vue.component("square-item", SquareItem);
Vue.component("row-item", RowItem);
Vue.component("horizontal-list", HorizontalList);
Vue.component("article-writer", ArticleWriter);
Vue.component("article-viewer", ArticleViewer);
Vue.component("email-setting-writer", EmailSettingWriter);
Vue.component("article-rewriter", ArticleRewriter);
Vue.component("delete-confirm-modal", DeleteConfirmModal);

// Vue 인스턴스 및 지역 컴포넌트
new Vue({
  el: "#app",
  router: router,
  data: {
    user: null,
    email: null,
    loading: false,
    writing: false,
    writingCause: null,
    viewing: false,
    viewerContent: null,
    articles: {
      habit: null,
      challenge: null,
      learn: null,
    },
  },
  methods: {
    showLoadingOverlay: function () {
      this.loading = true;
    },
    hideLoadingOverlay: function () {
      this.loading = false;
    },
    showArticleWriter: function (value) {
      this.writing = true;
      this.writingCause = value;
    },
    hideArticleWriter: function () {
      this.writing = false;
    },
    showArticleViewer: function (value) {
      this.viewerContent = value;
      this.viewing = true;
    },
    hideArticleViewer: function () {
      this.viewing = false;
    },
    setUserdata: function (value) {
      this.user = value;
      this.email = value.email;
    },
    resetUserdata: function () {
      this.user = null;
      this.email = null;
    },
    setUserdataFromSession: function () {
      let num = 0;
      const vm = this;
      const id = setInterval(async () => {
        const _user = await firebaseFuncs.loginWithExistingSession();
        if (_user) {
          clearInterval(id);
          vm.user = _user;
          vm.email = _user.email;
        } else {
          num++;
          if (num > 20) {
            clearInterval(id);
          }
        }
      }, 100);
    },
    setUseremail: function (value) {
      this.useremail = value;
    },
    // ---
    getOnetypeArticles: async function (type) {
      try {
        this.showLoadingOverlay();
        const articlesRef = await firebaseFuncs.getCollectionRefFromFirestore(type);
        this.articles[type] = await firebaseFuncs.getArticlesFromCollectionRef(articlesRef);
        await articlesRef.onSnapshot(async (snapshot) => {
          try {
            this.articles[type] = await firebaseFuncs.getArticlesFromCollectionRef(articlesRef);
          } catch (err) {
            console.error(err);
          } finally {
            //
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.hideLoadingOverlay();
      }
    },
    getAllTypesArticles: async function () {
      try {
        this.showLoadingOverlay();

        const promises = [];
        promises.push(this.getOnetypeArticles("habit"));
        promises.push(this.getOnetypeArticles("challenge"));
        promises.push(this.getOnetypeArticles("learn"));

        await Promise.all(promises);
      } catch (err) {
        console.error(err);
      } finally {
        this.articles = { ...this.articles };
        this.hideLoadingOverlay();
      }
    },
    //
    refreshArticles: function () {
      this.getAllTypesArticles();
    },
  },
  components: {
    "app-header": AppHeader,
    "app-footer": AppFooter,
    "loading-overlay": LoadingOverlay,
  },
  computed: {
    hasuserdata() {
      return this.user != null;
    },
  },
  mounted() {
    this.setUserdataFromSession();
    this.getAllTypesArticles();
  },
});
