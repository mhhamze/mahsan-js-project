"use strict";
window.onload = function () {
  let budget;
  let balance;
  let totalCost;
  let expenses = [];
  const url = "https://api.jsonbin.io/v3/b/646a4749b89b1e2299a1f769/";
  const budgetBoxValue = document.getElementById("intialBudget");
  const balanceValue = document.getElementById("balance");
  const budgetValue = document.getElementById("budget");
  const totalCostValue = document.getElementById("totalCost");
  const calcButton = document.getElementById("calc");
  const addButton = document.getElementById("add");
  const costBoxTitle = document.getElementById("title");
  const costBoxValue = document.getElementById("cost");
  const tableBody = document.querySelector("tbody");
  const saveButton = document.getElementById("save");
  const clearButton = document.getElementById("clear");
  const box2 = document.getElementById("left");

  const setBudget = () => (budgetValue.textContent = `$${budget}`);
  const setBalance = () => (balanceValue.textContent = `$${balance}`);
  const setTotalCost = () => (totalCostValue.textContent = `$${totalCost}`);
  const createTable = () => {
    expenses.forEach((element) => {
      let table = tableBody;
      const row = `<tr>
      <td class="brown cost-title">${element.title}</td>
      <td class="brown value">${element.value}</td>
      <td><img src="image/bin.png" alt="حذف" class="bin" /></td>
    </tr>`;
      table.insertAdjacentHTML("beforeend", row);
    });
  };

  const resetPage = () => {
    budgetBoxValue.value = "";
    costBoxTitle.value = "";
    costBoxValue.value = "";
    box2.textContent = "";
    const tb = `      <table>
    <tr>
      <th>بودجه</th>
      <th>هزینه ها</th>
      <th>موجودی</th>
    </tr>
    <tr>
      <td><img src="image/budget.png" alt="بودجه" /></td>
      <td><img src="image/cost.png" alt="هزینه ها" /></td>
      <td><img src="image/cash.png" alt="موجودی" /></td>
    </tr>
    <tr>
      <td id="budget" class="green">$0</td>
      <td id="totalCost" class="brown">$0</td>
      <td id="balance" class="green">$0</td>
    </tr>
    <tr>
      <td>نوع هزینه</td>
      <td>مقدار هزینه</td>
    </tr>
    <br />
  </table>`;
    box2.insertAdjacentHTML("afterbegin", tb);
  };

  const clearData = async () => {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key":
            "$2b$10$RtXwo4w1/ty/tQWQq91ww.Ngaat3/AMhdvKdpNLiOBFP07L29aqPy",
        },
        body: JSON.stringify({
          budget: 0,
          totalCost: 0,
          balance: 0,
          expenses: [],
        }),
      });
      const data = await res.json();
    } catch (err) {
      console.log(err);
    }
  };
  const getData = async () => {
    try {
      const res = await fetch(url + "latest?meta=false", {
        method: "GET",
        headers: {
          "X-Master-Key":
            "$2b$10$RtXwo4w1/ty/tQWQq91ww.Ngaat3/AMhdvKdpNLiOBFP07L29aqPy",
        },
      });
      const data = await res.json();
      budget = data.budget;
      totalCost = data.totalCost;
      balance = data.balance;
      expenses = data.expenses;
      setBudget();
      setBalance();
      setTotalCost();
      createTable();
      const bins = document.querySelectorAll(".bin");
      for (let i = 0; i < bins.length; i++) {
        bins[i].onclick = function () {
          let rowTitle =
            this.parentElement.parentElement.querySelector(
              ".cost-title"
            ).textContent;
          let rowCost = Number(
            this.parentElement.parentElement.querySelector(".value").textContent
          );
          totalCost = Number(totalCostValue.textContent.replace("$", ""));
          totalCost -= rowCost;
          totalCostValue.textContent = `$${totalCost}`;
          balance = Number(balanceValue.textContent.replace("$", ""));
          balance += rowCost;
          balanceValue.textContent = `$${balance}`;
          this.parentElement.parentElement.remove();
          expenses.pop({
            title: rowTitle,
            value: rowCost,
          });
          saveData();
        };
      }
    } catch (err) {
      console.log(err);
    }
  };

  const saveData = async () => {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key":
            "$2b$10$RtXwo4w1/ty/tQWQq91ww.Ngaat3/AMhdvKdpNLiOBFP07L29aqPy",
        },
        body: JSON.stringify({
          budget: Number(budgetValue.textContent.replace("$", "")),
          totalCost: totalCost,
          balance: balance,
          expenses: expenses,
        }),
      });
      const data = await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  getData();

  // add initial budget
  calcButton.addEventListener("click", function () {
    const intialBudget = Number(budgetBoxValue.value);
    budgetBoxValue.value = "";
    balance = Number(balanceValue.textContent.replace("$", ""));
    if (intialBudget <= 0) {
      alert("مقدار بودجه اولیه وارد شده معتبر نیست!");
    } else {
      budget = Number(budgetValue.textContent.replace("$", ""));
      budget += intialBudget;
      budgetValue.textContent = `$${budget}`;
      balance += intialBudget;
      balanceValue.textContent = `$${balance}`;
      saveData();
    }
  });
  // add title and cost
  addButton.addEventListener("click", function () {
    budget = Number(balanceValue.textContent.replace("$", ""));
    const title = costBoxTitle.value;
    const cost = Number(costBoxValue.value);
    costBoxTitle.value = "";
    costBoxValue.value = "";
    if (budget === 0) {
      alert("لطفا ابتدا بودجه اولیه را وارد کنید!");
    } else if (!title) {
      alert("عنوان هزینه نمیتواند خالی باشد!");
    } else if (cost <= 0) {
      alert("مقدار هزینه وارد شده معتبر نیست!");
    } else {
      totalCost = Number(totalCostValue.textContent.replace("$", ""));
      if (totalCost + cost <= budget) {
        totalCost += cost;
        totalCostValue.textContent = `$${totalCost}`;
        balance = Number(balanceValue.textContent.replace("$", ""));
        balance -= cost;
        balanceValue.textContent = `$${balance}`;
        const row = `<tr>
      <td class="brown cost-title">${title}</td>
      <td class="brown value">${cost}</td>
      <td><img src="image/bin.png" alt="حذف" class="bin" /></td>
    </tr>`;
        expenses.push({
          title: title,
          value: cost,
        });
        let table = tableBody;
        table.insertAdjacentHTML("beforeend", row);
        const bins = document.querySelectorAll(".bin");
        bins[bins.length - 1].onclick = function () {
          let rowTitle =
            this.parentElement.parentElement.querySelector(
              ".cost-title"
            ).textContent;
          let rowCost = Number(
            this.parentElement.parentElement.querySelector(".value").textContent
          );
          totalCost = Number(totalCostValue.textContent.replace("$", ""));
          totalCost -= rowCost;
          totalCostValue.textContent = `$${totalCost}`;
          balance = Number(balanceValue.textContent.replace("$", ""));
          balance += rowCost;
          balanceValue.textContent = `$${balance}`;
          this.parentElement.parentElement.remove();
          expenses.pop({
            title: rowTitle,
            value: rowCost,
          });
          saveData();
        };
        saveData();
      } else {
        alert("موجودی کافی نیست!");
      }
    }
  });
  saveButton.addEventListener("click", function () {
    saveData();
    alert("ذخیره داده ها با موفقیت انجام شد");
  });
  clearButton.addEventListener("click", function () {
    clearData();
    resetPage();
    alert("پاک کردن داده ها با موفقیت انجام شد");
  });
};
