import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const products = ref([]);
    const tempProduct = ref({
      imageUrl: [],
    });
    const status = ref(false);
    const url = "https://vue3-course-api.hexschool.io/v2";
    const path = "rubby-api";

    // 1.確認是否登入
    const checkLogin = () => {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          getData();
        })
        .catch((err) => {
          console.dir(err);
          window.location = "login.html";
        });
    };

    // 2.取得產品資料
    const getData = () => {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          products.value = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }

    
    // 3.查看產品細節
    const openModal = (isNew,product) => {
      // isNew === 'new' 新增產品
      if(isNew === 'new'){
        tempProduct.value = {
          imageUrl: [],
        }
        status.value = true
        productModal.show()
      }
      // isNew === 'edit' 編輯產品
      else if(isNew === 'edit'){
        tempProduct.value = {...product}
        status.value = false
        productModal.show()
      }
      // isNew === 'delete' 刪除產品
      else if(isNew === 'delete'){
        tempProduct.value = {...product}
        delProductModal.show()
      }
  }

    // 4.新增、編輯產品
    const updateProduct = () => {
      // 新增
      let productUrl = `${url}/api/${path}/admin/product`;
      let http = 'post';

      // 編輯
      if(!status.value){
        productUrl = `${url}/api/${path}/admin/product/${tempProduct.value.id}`;
        http = 'put';
      }
    axios[http](productUrl, { data: tempProduct.value })
    .then((res) => {
      alert(res.data.message);
      // 隱藏modal
      productModal.hide();
      // 獲取最新資料
      getData()
    })
    .catch((err) => {
      alert(err.response.data.message);
    })
    }


    // 5.刪除產品
    const delProduct = () => {
      axios
        .delete(`${url}/api/${path}/admin/product/${tempProduct.value.id}`)
        .then((res) => {
          alert(res.data.message);
          // 隱藏modal
          delProductModal.hide();
          // 獲取最新資料
          getData()
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }

    // 6.產品圖片
    const createImages = () => {
      tempProduct.value.imagesUrl = []
      tempProduct.value.imagesUrl.push('')
    }

  onMounted(() => {
      // Retrieve Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)rubbyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      axios.defaults.headers.common["Authorization"] = token;
//  modal
productModal = new bootstrap.Modal('#productModal',{keyboard:false})
// delete modal
delProductModal = new bootstrap.Modal('#delProductModal',{keyboard:false})
      checkLogin();
    });

    return {
      products,
      tempProduct,
      openModal,
      status,
      updateProduct,
      delProduct,
      createImages
    };
  },
});

app.mount("#app");
