let transactions = [];
let categories = [];
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadTransactions();

    document.getElementById("allBtn").addEventListener("click", () => setFilter("all"));
});

function addIncome() {
    addTransaction("income");
}

function addExpense() {
    addTransaction("expense");
}

function addTransaction(type) {
    const desc = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!desc || isNaN(amount)) return;

    transactions.push({ desc, amount, type, category });

    saveTransactions();
    render();
}

function render() {
    let income = 0;
    let expenses = 0;

    const list = document.getElementById("list");
    list.innerHTML = "";

    let filtered = transactions;

    if (currentFilter !== "all") {
        filtered = transactions.filter(t => t.category === currentFilter);
    }

    filtered.forEach((t, index) => {
        const li = document.createElement("li");

        li.textContent = `${t.desc}: $${t.amount} [${t.category}]`;
        li.style.color = t.type === "income" ? "green" : "red";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTransaction(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => deleteTransaction(index);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);

        if (t.type === "income") income += t.amount;
        else expenses += t.amount;
    });

    document.getElementById("income").textContent = income;
    document.getElementById("expenses").textContent = expenses;
    document.getElementById("profit").textContent = income - expenses;

    renderBreakdown();
}

function renderBreakdown() {
    const breakdown = {};
    const list = document.getElementById("categoryBreakdown");
    list.innerHTML = "";

    transactions.forEach(t => {
        if (!breakdown[t.category]) breakdown[t.category] = 0;
        breakdown[t.category] += t.type === "income" ? t.amount : -t.amount;
    });

    for (let category in breakdown) {
        const li = document.createElement("li");
        li.textContent = `${category}: $${breakdown[category]}`;
        list.appendChild(li);
    }
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    render();
}

function editTransaction(index) {
    const t = transactions[index];

    const newDesc = prompt("Edit description:", t.desc);
    if (!newDesc) return;

    const newAmount = parseFloat(prompt("Edit amount:", t.amount));
    if (isNaN(newAmount)) return;

    const newCategory = prompt(`Edit category (${categories.join(", ")}):`, t.category);
    if (!newCategory) return;

    transactions[index] = {
        ...t,
        desc: newDesc,
        amount: newAmount,
        category: newCategory
    };

    saveTransactions();
    render();
}

function setFilter(filter) {
    currentFilter = filter;
    render();
    renderFilters(); // updates active button
}

function exportCSV() {
    let csv = "Description,Amount,Type,Category\n";

    transactions.forEach(t => {
        csv += `${t.desc},${t.amount},${t.type},${t.category}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    const data = localStorage.getItem("transactions");
    if (data) transactions = JSON.parse(data);
    render();
}

function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function loadCategories() {
    const data = localStorage.getItem("categories");

    if (data) {
        categories = JSON.parse(data);
    } else {
        categories = ["General", "Etsy", "Supplies", "Bills"];
    }

    renderCategoryDropdown();
    renderDeleteDropdown();
    renderFilters();
}

function renderCategoryDropdown() {
    const select = document.getElementById("category");
    select.innerHTML = "";

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function renderDeleteDropdown() {
    const select = document.getElementById("deleteCategory");
    select.innerHTML = "";

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function addCategory() {
    const newCat = document.getElementById("newCategory").value.trim();

    if (!newCat || categories.includes(newCat)) return;

    categories.push(newCat);
    saveCategories();

    renderCategoryDropdown();
    renderDeleteDropdown();
    renderFilters();

    document.getElementById("newCategory").value = "";
}

function deleteCategory() {
    const selected = document.getElementById("deleteCategory").value;

    categories = categories.filter(c => c !== selected);
    saveCategories();

    renderCategoryDropdown();
    renderDeleteDropdown();
    renderFilters();
}

function renderFilters() {
    const container = document.getElementById("filterContainer");
    container.innerHTML = "";

    // ALL button
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.onclick = () => setFilter("all");
    if (currentFilter === "all") allBtn.classList.add("active");
    container.appendChild(allBtn);

    // Category buttons
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.onclick = () => setFilter(cat);

        if (currentFilter === cat) {
            btn.classList.add("active");
        }

        container.appendChild(btn);
    });
}