let Auth = {
  template:
    /* html */
    `
    <div id="route-auth" class="route">
        <img src="./src/images/auth.png" />
        <p id="login-needed">로그인이 필요한 기능입니다.<br>처음 이용하신다면 회원가입을 먼저 진행해주세요.</p>
        <form>
            <input type="email" v-model="email" placeholder="이메일" />
            <input type="password" v-model="password" placeholder="비밀번호" />
        </form>
        <p v-if="hasProblem" id="problem-teller">{{ problem }}</p> 
        <div>
            <button v-on:click="login">로그인</button>
            <button v-on:click="register">회원가입</button>
        </div>
    </div>
    `,
  props: ["user"],
  data() {
    return {
      email: "",
      password: "",
      hasProblem: false,
      problem: "",
    };
  },
  watch: {
    user: function () {
      // if (this.user) {
      //   this.$router.push("/mypage");
      // }
    },
  },
  methods: {
    areValid: function () {
      const mail = this.email;
      const pw = this.password;

      this.hasProblem = false;
      if (!mail.trim() || !pw.trim()) {
        this.hasProblem = true;
        this.problem = "이메일 또는 비밀번호가 입력되지 않았습니다.";
        return false;
      }
      if (!mail.includes("@") || !mail.split("@")[0] || !mail.split("@")[1]) {
        this.hasProblem = true;
        this.problem = "이메일의 형식이 올바르지 않습니다. (예시 : gorani@gmail.com)";
        return false;
      }
      if (pw.length < 6) {
        this.hasProblem = true;
        this.problem = "비밀번호는 6자 이상으로 결정해야 합니다.";
        return false;
      }

      return true;
    },
    register: async function () {
      if (this.areValid()) {
        this.$emit("start-loading");

        // auth
        try {
          const user = await firebaseFuncs.register(this.email, this.password); // from "utilities/firebaseToolkit.js"
        } catch (err) {
          this.hasProblem = false;
          if (err.code === "auth/email-already-in-use") {
            this.hasProblem = true;
            this.problem = "이미 사용중인 이메일입니다.";
            return;
          }
          if (err.code === "auth/weak-password") {
            this.hasProblem = true;
            this.problem = "비밀번호는 6자 이상으로 결정해야 합니다.";
            return;
          }
          if (err.code === "auth/invalid-email") {
            this.hasProblem = true;
            this.problem = "이메일의 형식이 올바르지 않습니다. (예시 : gorani@gmail.com)";
            return;
          }
          if (err.code === "auth/too-many-requests") {
            this.hasProblem = true;
            this.problem =
              "해당 이메일로 회원가입 하려는 시도가 너무 많습니다. 잠시 후 시도해주세요.";
            return;
          }

          console.log(err);
          alert(
            "예상치 못한 이유로 회원가입이 실패했습니다. 다시 시도해도 문제가 지속되면 studioplug17@gmail.com 로 문의 부탁드립니다." +
              err
          );
          return;
        } finally {
          this.$emit("finish-loading");
        }

        // firestore
        try {
          this.$emit("start-loading");
          const initMailSetting = await firebaseFuncs.initUserMailSetting(this.email);
          alert("회원가입이 완료되었습니다. 이제 로그인 할 수 있습니다.");
        } catch (err) {
          console.error(err);
          alert(
            "예상치 못한 이유로 회원가입이 실패했습니다. 다시 시도해도 문제가 지속되면 studioplug17@gmail.com 로 문의 부탁드립니다." +
              err
          );
        } finally {
          this.$emit("finish-loading");
        }
      }
    },
    login: async function () {
      if (this.areValid()) {
        this.$emit("start-loading");
        try {
          let user = await firebaseFuncs.login(this.email, this.password); // from "utilities/firebaseToolkit.js"
          this.$emit("login-success", user);
          this.$router.go(-1);
        } catch (err) {
          this.hasProblem = false;
          if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
            this.hasProblem = true;
            this.problem = "이메일 또는 비밀번호가 올바르지 않습니다.";
            return;
          }
          if (err.code === "auth/too-many-requests") {
            this.hasProblem = true;
            this.problem = "해당 이메일로 로그인하려는 시도가 너무 많습니다. 잠시 후 시도해주세요.";
            return;
          }

          console.log(err);
          alert(
            "예상치 못한 이유로 로그인이 실패했습니다. 다시 시도해도 문제가 지속되면 studioplug17@gmail.com 로 문의 부탁드립니다."
          );
        } finally {
          this.$emit("finish-loading");
        }
      }
    },
  },
};
