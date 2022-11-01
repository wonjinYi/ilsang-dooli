const serviceEnum = {
  data: {
    articleType: ["habit", "challenge", "learn"],
  },

  getItem: function (key) {
    return this.data[key];
  },
};
