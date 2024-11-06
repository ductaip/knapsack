let products = [];
let selectedProducts = [];
let maxWeight = 0;
const userResult = document.getElementById('userResult');
const optimalResult = document.getElementById('optimalResult');

function generateProducts() {
    const n = document.getElementById('productCount').value;
    maxWeight = document.getElementById('maxWeight').value;
    products = [];
    selectedProducts = [];
    document.getElementById('products').innerHTML = '';
    
    for (let i = 0; i < n; i++) {
        const weight = Math.floor(Math.random() * maxWeight) + 1;
        const value = (Math.floor(Math.random() * maxWeight) + 1) * 5;
        products.push({ weight, value, index: i + 1 });
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerText = `Product ${i + 1}\nWeight: ${weight}\nValue: ${value}`;
        productDiv.onclick = () => toggleSelect(i, productDiv);
        document.getElementById('products').appendChild(productDiv);
    }
} 


function toggleSelect(index, element) {
    const currentWeight = selectedProducts.reduce((sum, idx) => sum + products[idx].weight, 0);

    const newWeight = currentWeight + products[index].weight;
    const info = document.querySelector(".info");

    if (selectedProducts.includes(index)) {
        // Deselect the item
        selectedProducts = selectedProducts.filter(i => i !== index);
        element.classList.remove('selected');
        userResult.innerText = '';
    } else {
        if (newWeight <= maxWeight) {
            selectedProducts.push(index);
            element.classList.add('selected');
            userResult.innerText = '';  
        } else {
            userResult.innerText = `Warning: Adding this item exceeds the max weight (${newWeight} > ${maxWeight}).`;
            userResult.style.color = 'red'
        }
    }
    optimalResult.innerText = '';

    const currentValue = selectedProducts.reduce((sum, idx) => sum + products[idx].value, 0);
    const currentWeight2 = selectedProducts.reduce((sum, idx) => sum + products[idx].weight, 0);

    info.innerText = `Current Weight: ${currentWeight2}\nCurrent Value: ${currentValue}`
     
}

function submitSelection() {
    const userWeight = selectedProducts.reduce((sum, idx) => sum + products[idx].weight, 0);
    const userValue = selectedProducts.reduce((sum, idx) => sum + products[idx].value, 0);
    optimalResult.innerText = '';
    
    if (userWeight > maxWeight) {
        userResult.innerText = `Invalid: Selected items exceed max weight (${userWeight} > ${maxWeight}).`;
        return;
    }

    const dp = Array.from({ length: products.length + 1 }, () => Array(parseInt(maxWeight) + 1).fill(0));
    for (let i = 1; i <= products.length; i++) {
        for (let w = 1; w <= maxWeight; w++) {
            if (products[i - 1].weight <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - products[i - 1].weight] + products[i - 1].value);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    const optimalValue = dp[products.length][maxWeight];
    userResult.innerText = `Your selection: Weight = ${userWeight}, Value = ${userValue}`;
    userResult.style.color = '#000';

    if(optimalValue === userValue) {
        userResult.innerHTML = `${userResult.innerText}<br/> <p class="green">Congratulation, you've made a right result</p>`
    } else {
        userResult.innerHTML = `${userResult.innerText}<br/> <p class="red">Sorry, you've made a wrong result</p>`
    }
    optimalResult.innerHTML = `${optimalResult.innerText}<br/><em class="text-color">Optimal knapsack value = ${optimalValue}.</em>`;
    
    let w = maxWeight;
    const ans = [];
    for(let i = products.length; i > 0; i--) {
        if(dp[i][w] !== dp[i-1][w] && w > 0) {
            ans.push(products[i-1]);
            w -= products[i-1].weight;
        }
    }
    ans.reverse();
    const text = ans.map((value, index) => `Product ${value.index} : value = ${value.value} weight = ${value.weight}`).join('\n');

    const div = document.createElement('div');
    div.innerText = text;
    optimalResult.appendChild(div);
}

 
