import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DATA_URL } from "../src/config/config";
import axios from "axios";
function App() {
  const [products, setProudcts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    let arr = JSON.parse(localStorage.getItem("productsArr"));
    if (arr == null || !arr.length) {
      axios.get(DATA_URL).then((res) => {
        let temp = res.data.products.map((obj) => {
          obj.quantity = 1;
          obj.actualPrice = obj.price;
          return obj;
        });
        localStorage.setItem("productsArr", JSON.stringify(res.data.products));
        calculateTotalItems(res.data.products);
        calculateTotalPrice(res.data.products);
        setProudcts(temp);
      });
    } else {
      calculateTotalItems(arr);
      calculateTotalPrice(arr);
      setProudcts(arr);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("productsArr", JSON.stringify(products));
  }, [products]);
  function negativeHandler(e, id) {
    let temp = products.map((obj) => {
      if (obj.id === id) {
        obj.quantity = obj.quantity - 1;
        obj.actualPrice = obj.price * obj.quantity;
      }
      return obj;
    });
    calculateTotalItems(temp);
    calculateTotalPrice(temp);
    setProudcts(temp);
  }
  function positiveHandler(e, id) {
    let temp = products.map((obj) => {
      if (obj.id === id) {
        obj.quantity = Number(obj.quantity) + 1;
        obj.actualPrice = obj.price * obj.quantity;
      }
      return obj;
    });
    calculateTotalItems(temp);
    calculateTotalPrice(temp);
    setProudcts(temp);
  }
  function quantityChange(e, id) {
    let temp = products.map((obj) => {
      if (obj.id === id) {
        obj.quantity = e.target.value;
        obj.actualPrice = obj.price * obj.quantity;
      }
      return obj;
    });
    calculateTotalItems(temp);
    calculateTotalPrice(temp);
    setProudcts(temp);
  }
  function calculateTotalItems(arr) {
    let itemsArr = arr.map((obj) => {
      return obj.quantity;
    });
    let val = itemsArr.reduce((prev, curr) => {
      return Number(prev) + Number(curr);
    }, 0);
    setTotalItems(val);
  }
  function calculateTotalPrice(arr) {
    let priceArr = arr.map((obj) => {
      return obj.actualPrice;
    });
    let val = priceArr.reduce((prev, curr) => {
      return Number(prev) + Number(curr);
    }, 0);
    setTotalPrice(val);
  }

  return (
    <div className="App">
      <div className="cart-container">
        <div className="cart-header">
          <div className="left">
            <h3>Public Sapient Mini Cart</h3>
          </div>
          <div className="right">
            <div className="total-price">
              {" "}
              <b> Total: </b>${totalPrice}
            </div>
            <div className="total-items">{totalItems} Items</div>
          </div>
        </div>
        <div className="product-container">
          {products.map((obj, i) => {
            return (
              <div key={i} className="product">
                <div className="details">
                  <div className="title">{obj.title}</div>
                  <div className="description">{obj.desc}</div>
                </div>
                <div className="controls">
                  <div className="negative">
                    <button
                      onClick={(e) => {
                        negativeHandler(e, obj.id);
                      }}
                    >
                      -
                    </button>
                  </div>
                  <div className="quantity">
                    <input
                      type="number"
                      name=""
                      id=""
                      value={obj.quantity}
                      onChange={(e) => {
                        quantityChange(e, obj.id);
                      }}
                    />
                  </div>
                  <div className="positive">
                    <button
                      onClick={(e) => {
                        positiveHandler(e, obj.id);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="price">${obj.actualPrice}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
