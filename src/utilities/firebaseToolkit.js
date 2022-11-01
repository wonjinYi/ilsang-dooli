const firebaseConfig = {
  apiKey: "AIzaSyD1oalkeO1M2V4jv_wx4lCs_SsGqY_TLwk",
  authDomain: "ilsang-dooli.firebaseapp.com",
  projectId: "ilsang-dooli",
  storageBucket: "ilsang-dooli.appspot.com",
  messagingSenderId: "328481317952",
  appId: "1:328481317952:web:49db0e5e385b5baa9deba5",
  measurementId: "G-SJ2HNWC8HN",
};

const firebaseVars = {
  app: firebase.initializeApp(firebaseConfig),
  //analytics: firebase.analytics.getAnalytics(app),
  auth: firebase.auth(),
  db: firebase.firestore(),
  storage: firebase.storage(),
};

const firebaseFuncs = {
  register: async function (email, password) {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  },
  initUserMailSetting: async function (email) {
    // 계정에 연결된 이메일 수신 설정 초기값설정
    const db = firebase.firestore();
    const dbRes = await db.collection("mailSetting").add({
      user: email,
      sendType: [],
      sendTime: "no",
    });
    return dbRes;
  },
  getUserMailSetting: async function (email) {
    const db = firebase.firestore();
    const dbRes = await db.collection("mailSetting").where("user", "==", email).get();
    const doc = await dbRes.docs[0].data();
    return doc;
  },
  setUserMailSetting: async function (email, data) {
    const db = firebase.firestore();

    const getRes = await db.collection("mailSetting").where("user", "==", email).get();
    const docid = await getRes.docs[0].id;

    const mailSettingRef = await db.collection("mailSetting");
    const setRes = await mailSettingRef.doc(docid).set(data);
    return setRes;
  },
  login: async function (email, password) {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    sessionStorage.setItem("ilsangdooli_uc", userCredential);
    return userCredential.user;
  },
  loginWithExistingSession: async function () {
    const auth = firebase.auth();
    const user = auth.currentUser;
    return user;
  },
  logout: async function () {
    const res = await firebase.auth().signOut();
    return res;
  },

  sendImageToStorage: async function (file) {
    const ref = await firebase.storage().ref();
    const newFilename = file.name + Date.now();
    const dest = ref.child("image/" + newFilename);
    const res = await dest.put(file);

    const downloadurl = await dest.getDownloadURL();

    return { res: res, url: downloadurl };
  },

  writeNewArticleToFireStore: async function (articleType, data) {
    const db = firebase.firestore();
    return await db.collection(articleType).add(data);
  },
  rewriteArticleToFireStore: async function (articleType, docid, data) {
    const db = firebase.firestore();

    const mailSettingRef = await db.collection(articleType);
    const setRes = await mailSettingRef.doc(docid).set(data);
    return setRes;
  },
  deleteArticle: async function (data, docid) {
    const db = firebase.firestore();
    const storage = firebase.storage();

    // storage 이미지 삭제
    try {
      if (data.img) await storage.ref().child(data.img).delete();
    } catch (err) {}

    // firestore document 삭제
    await db.collection(data.type).doc(docid).delete();
  },

  getCollectionRefFromFirestore: async function (articleType) {
    const db = firebase.firestore();
    const ref = await db.collection(articleType).orderBy("createdAt", "desc");
    return ref;
  },

  getArticlesFromCollectionRef: async function (ref) {
    const storage = firebase.storage();
    const res = await ref.get();
    const articles = [];

    const promises = res.docs.map(async (doc, index) => {
      const id = doc.id;
      const data = doc.data();
      let imgUrl = "./src/images/no-pictures.png";
      if (data.img) imgUrl = await storage.ref().child(data.img).getDownloadURL();

      const newItem = { id: id, data: data, imgUrl: imgUrl };
      articles[index] = newItem;
    });

    await Promise.all(promises);

    return [...articles];
  },
  getAtriclesFromSnapshot: async function (snapshot) {
    const storage = firebase.storage();
    const articles = [];

    const promises = snapshot.docs.map(async (doc, index) => {
      const id = doc.id;
      const data = doc.data();
      let imgUrl = null;
      if (data.img) imgUrl = await storage.ref().child(data.img).getDownloadURL();

      const newItem = { id: id, data: data, imgUrl: imgUrl };
      articles[index] = newItem;
    });

    await Promise.all(promises);

    return [...articles];
  },
};
