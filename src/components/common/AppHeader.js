let AppHeader = {
  props: ["hasuserdata"],
  template:
    /* html */
    `
    <header id="app-header">
        
        <div id="logo">
          <img src="./src/images/logoSymbol.png" />
          <router-link to="/">
            <h1>일상두리</h1>
          </router-link>
        </div>
       

        <nav id="left-nav">
          <router-link to="/habit" class="nav-item">습관</router-link>
          <router-link to="/challenge" class="nav-item">도전</router-link>
          <router-link to="/learn" class="nav-item">배우기</router-link>
        </nav>
        <nav id="right-nav">

          <router-link v-if="!hasuserdata" to="/auth" class="nav-item">
            <img src="./src/images/user.png" />
          </router-link>  
          <router-link v-else to="/mypage" class="nav-item">
            <div style="border:1px solid black; border-radius:100%;">
              <img src="./src/images/user.png" />
              </div>
          </router-link>
          
        </nav>
    </header>
    `,
  methods: {},
};
