let EmailSettingWriter = {
  props: ["email_setting"],
  template:
    /* html */
    `
      <div id="email-setting-writer">
          <div id="form-container">
              <div id="close-btn" v-on:click="closeWriter">
                  <img src="./src/images/cancel.png" />
              </div>
  
              <form>
                  <div class="input-set">
                      <p class="input-title">메일을 받을 이메일 주소</p>
                      <div class="input-content">
                          <p>{{ user }}</p>
                      </div>
                  </div>
  
                  <div class="input-set">
                      <p class="input-title">받을 시간</p>
                      <div class="input-content">
                          <select v-model="sendTime">
                              <option value="no">받지 않음</option>
                              <option value="morning">아침 (오전 6시)</option>
                              <option value="night">밤 (오후 8시)</option>
                          </select>
                      </div>
                  </div>
  
                  <div class="input-set">
                      <p class="input-title">받을 글의 유형</p>
                      <div class="input-content">
                        <ul>
                            <li> 
                                <input type="checkbox" v-model="sendType" value="habit" />
                                <span>습관 </span>
                            </li>
                            <li> 
                                <input type="checkbox" v-model="sendType" value="challenge" />
                                <span>도전 </span>
                            </li>
                            <li> 
                                <input type="checkbox" v-model="sendType" value="learn" />
                                <span>배우기 </span>
                            </li>
                        </ul>
                      </div>
                  </div>
            
                  
                    <div class="input-set">
                        <button v-on:click="write">설정 저장하기</button>
                    </div>
                </form>
          </div>
      </div>
      `,
  data() {
    return {
      user: this.email_setting.user,
      sendTime: this.email_setting.sendTime,
      sendType: this.email_setting.sendType,
    };
  },
  methods: {
    closeWriter: function () {
      const data = { user: this.user, sendTime: this.sendTime, sendType: this.sendType };
      this.$emit("finish-writing", data);
    },
    isValid: function () {
      //
      return true;
    },
    write: async function () {
      if (this.isValid()) {
        this.$emit("start-loadig");
        try {
          this.$emit("start-loading");
          const data = {
            user: this.user,
            sendTime: this.sendTime,
            sendType: this.sendType,
          };
          await firebaseFuncs.setUserMailSetting(this.user, data);
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
