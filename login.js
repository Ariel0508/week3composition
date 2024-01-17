import {
  createApp,
  ref,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = createApp({
  setup() {
    const user = ref({
      username: "",
      password: "",
    });

    const login = () => {
      const url = "https://vue3-course-api.hexschool.io/v2";

      axios
        .post(`${url}/admin/signin`, user.value)
        .then((res) => {
          // console.log(res);
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `rubbyToken=${token}; expires=${new Date(expired)};`;
          window.location = "index.html";
        })
        .catch((err) => {
            alert(err.response.data.message);
        });
    };
    

    return {
      user,
      login,
    };
  },
});

app.mount("#app");
