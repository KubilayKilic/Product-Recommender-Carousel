(() => {
  self.init = () => {
    self.buildCSS();
    self.setEvents();
  };

  self.buildCSS = () => {
    const css = `
      .wrapper {
        width: 1570px;
        background-color: #faf9f7;
        margin: 0 auto;
        padding: 10px;
        position: relative;
      }
      .product-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        gap: 10px;
        flex-direction: row;
        overflow-x: scroll;
        padding: 0px !important;
        scroll-behavior: smooth;
        margin: auto;
      }
      .product-wrapper::-webkit-scrollbar {
        display: none;
      }
      .product{
        position: relative;
        background-color: #fff;
      }
      .product-header {
        font-size: 32px;
        line-height: 43px;
        padding: 15px 0;
      }
      .product-image{
        width: 210px;
        height: 280px;
        margin: 10px;
      }
      .product-hearth-icon{
        cursor: pointer;
        position: absolute;
        top: 9px;
        right: 15px;
        width: 34px;
        height: 34px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .16);
        border: solid .5px #b6b7b9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .product-name{
        font-size: 12px;
        color: black;
        margin: 0 auto;
        width: 90%;
        height: 50px;
      }
      .product-price{
        font-size: 16px;
        color: #193db0;
        margin: 0 auto;
        width: 90%;
        font-weight: bold;
      }
      ul {
        list-style: none!important;
      }
      .prev-btn, .next-btn {
        border: none;
        background-color: transparent;
        font-weight: bold;
        width: 40px;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0% #fff 100%);
        cursor: pointer;
        z-index: 9;
        margin: 15px;
        position: absolute;
        top: 43%;
      }
      .prev-btn {
        left: -70px;
      }
      .next-btn {
        right: -70px;
      }
      @media only screen and (max-width: 1750px) {
        .wrapper {
          width: 1450px;
        }
      }
      @media only screen and (max-width: 1600px) {
        .wrapper {
          width: 1300px;
        }
      }
      @media only screen and (max-width: 1440px) {
        .wrapper {
          width: 1100px;
        }
      }
      @media only screen and (max-width: 1366px) {
        .wrapper {
          width: auto;
        }
        .prev-btn, .next-btn {
          display: none;
        }
      }
      }
  `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  self.setEvents = () => {
    async function getProductData() {
      const currentUrl = this.window.location.href;
      //const oldUrl = "https://www.lcwaikiki.com/tr-TR/TR/urun/LC-WAIKIKI/";
      const targetUrl = "https://www.lcw.com/";

      if (currentUrl.startsWith(targetUrl)) {
        const xhr = new XMLHttpRequest();
        const url =
          "https://gist.githubusercontent.com/KubilayKilic/3093349dd7e397a80bcce1a2d2aa53f1/raw/d8cd46013c055bc6d6ffff9a65ba7fedd482f938/product.json";

        return new Promise((resolve, reject) => {
          xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } else {
                reject(
                  new Error("Product datasını alma işlemi başarısız oldu.")
                );
              }
            }
          };
          xhr.open("GET", url);
          xhr.send();
        });
      } else {
        console.error("Yanlış sayfa!");
        return Promise.resolve();
      }
    }

    if (JSON.parse(localStorage.getItem("productData"))) {
      self.buildHTML(JSON.parse(localStorage.getItem("productData")));
      self.likeProduct();
    } else {
      getProductData()
        .then((data) => {
          localStorage.setItem("productData", JSON.stringify(data));
          self.buildHTML(data);
          self.likeProduct();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  self.buildHTML = (data) => {
    const carouselData = data
      .map((item) => {
        return `
          <li class="product" id=${item.id}>
          <div class="product-hearth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" id=${item.id} width="20.576" height="19.483" viewBox="0 0 20.576 19.483">
              <path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path>
            </svg>
          </div>
          <a href=${item.url} target="_blank">
            <img class="product-image" src="${item.img}"></img>
          </a>
            <div class="product-name">${item.name}</div>
            <div class="product-price">${item.price} TRY</div>
          </li>`;
      })
      .join("");

    const carouselHtml = `
      <div class="wrapper">
        <p class="product-header">You Might Also Like</p>
        <button class="prev-btn"><</button>
        <ul class="product-wrapper">
          ${carouselData}
        </ul>
        <button class="next-btn">></button>
      </div>
    `;

    $(".product-detail").append(carouselHtml);

    self.retriveLikedItems();
    self.slider();
  };

  self.retriveLikedItems = () => {
    const likedArray = JSON.parse(localStorage.getItem("liked"));

    if (likedArray) {
      likedArray.forEach((i) => {
        $(`svg[id=${i}] > path`).attr("fill", "#193db0");
        $(`svg[id=${i}] > path`).attr("stroke", "#193db0");
      });
    }
  };

  self.slider = () => {
    const productWrapper = $(".product-wrapper");
    const prevBtn = $(".prev-btn");
    const nextBtn = $(".next-btn");

    productWrapper.each((index, item) => {
      let productWidth = 230;

      $(nextBtn[index]).on("click", () => {
        item.scrollLeft += productWidth;
      });
      $(prevBtn[index]).on("click", () => {
        item.scrollLeft -= productWidth;
      });
    });
  };

  self.likeProduct = () => {
    $(".product-hearth-icon > svg").on("click", (event) => {
      const path = $(event.target).find("path");
      const id = $(event.target).attr("id");

      if (path.attr("fill") === "#193db0") {
        path.attr("stroke", "#555");
        path.attr("fill", "#fff");

        const currentLikes = JSON.parse(localStorage.getItem("liked")) ?? [];
        const filtered = currentLikes.filter((index) => index !== id);

        localStorage.setItem("liked", JSON.stringify(filtered));
      } else {
        path.attr("stroke", "#193db0");
        path.attr("fill", "#193db0");
        const currentLikes = JSON.parse(localStorage.getItem("liked")) ?? [];

        if (currentLikes.indexOf(id) === -1) {
          let likedProducts = [...currentLikes, id].filter(Boolean);
          localStorage.setItem("liked", JSON.stringify(likedProducts));
        }
      }
    });
  };

  self.init();
})();
