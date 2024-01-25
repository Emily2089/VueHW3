import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
let productModal = '';
let delProductModal = '';

createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'emily-apitest',
      products: [],
      tempProduct: {
        demoImg: [],
        features: [],
      },
      // note：建立屬性 is_new 來切換"新增"和"編輯"的狀態
      is_new: true,
    }
  },
  methods: {
    // 驗證登入
    checkAdmin() {
      axios.post(`${this.url}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'index.html';
        })
    },
    // 取得後台資料
    getData() {
      axios.get(`${this.url}/api/${this.path}/admin/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 新增產品
    openModal(action, item) {
      if(action === '新增') {
        productModal.show();
        this.is_new = true;
        this.tempProduct = {
          demoImg: [],
          features: [],
        }

      }else if (action === '編輯') {
        productModal.show();
        this.is_new = false;
        this.tempProduct = { ...item };

      }else if(action === '刪除') {
        delProductModal.show();
        this.tempProduct = { ...item };
      }
    },
    updateData() {
      if(this.is_new === false) {
        // 編輯資料
        // note：API 文件有提到 put 須帶入的參數有三個，api_path、id、data(物件)，前兩個會夾帶在路徑中，最後一個會用一個物件帶進去，key 為 data，value 為要帶入的資料
        axios.put(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            this.getData();
          })
          .catch((err) => {
            alert(err.response.data.message);
          })
      }else if(this.is_new === true){
        // 新增資料
        axios.post(`${this.url}/api/${this.path}/admin/product`, { data: this.tempProduct})
          .then((res) =>{
            alert(res.data.message);
            productModal.hide();
            this.getData();
          })
          .catch((err) => {
            alert(err.response.data.message);
          })
      }
      // // note：上面這段程式碼可再簡化成這樣
      // let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      // let http = 'post';

      // if (!this.is_new) {
      //   // note：當 is_new 的值為 false 時，代表要修改資料，所以使用 put，url 須加上參數 id
      //   url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      //   http = 'put'
      // }

      // axios[http](url, { data: this.tempProduct }).then((response) => {
      //   alert(response.data.message);
      //   productModal.hide();
      //   this.getData();
      // }).catch((err) => {
      //   alert(err.response.data.message);
      // })
    },
    // 刪除資料
    deleteData() {
      axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
  },
  mounted() {
    // 將 cookie 裡的 token 夾在 headers 裡
    const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)emilyToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
    axios.defaults.headers.common['Authorization'] = token;

    this.checkAdmin();

    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
  }
}).mount('#app');