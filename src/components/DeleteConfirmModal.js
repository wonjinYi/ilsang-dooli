let DeleteConfirmModal = {
  props: ["iteminfo"],
  template:
    /* html */
    `
    <div id="delete-confirm-modal">
      <div id="modal-container">
        <p>정말 삭제할까요?</p>
        <button v-on:click="remove">네</button>
        <button v-on:click="closeConfirm">아니요</button>
      </div>
    </div>
    `,
  methods: {
    closeConfirm: function () {
      this.$emit("close-confirm", this.docid);
    },
    remove: async function () {
      try {
        this.$emit("start-loading");
        await firebaseFuncs.deleteArticle(this.iteminfo.data, this.iteminfo.id);
        this.closeConfirm();
      } catch (err) {
        console.error(err);
        alert("예상치 못한 오류가 발생하여 삭제하지 못했습니다.\n" + err);
      } finally {
        this.$emit("refresh-articles");
        this.$emit("finish-loading");
      }
    },
  },
};
