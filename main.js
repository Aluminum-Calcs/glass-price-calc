// localStorage.clear();

let width = document.querySelector('#input__width');
let height = document.querySelector('#input__height');
let qty = document.querySelector('#input__qty');
let answer = document.querySelector('.answer');
let glassPrice = document.querySelector('#input__price')

let w_f = document.querySelector('.width')
let h_f = document.querySelector('.height')
let q_f = document.querySelector('.qty')
let p_f = document.querySelector('.price')

let w_err = document.querySelector('.error__width');
let h_err = document.querySelector('.error__height');
let q_err = document.querySelector('.error__qty');

let add = document.querySelector('.add');
let reset = document.querySelector('.reset');
let compute = document.querySelector('.compute');
let tabulate = document.querySelector('.tabulate');

const priceFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN'
});

compute.addEventListener('click', (e) => {
  e.preventDefault();
  calculate();
})
setInterval(()=>{
  error();
},100);

let W = 3300;
let H = 2140;
let g__no = JSON.parse(localStorage.getItem('g__no')) || 0;
let g__size;
let g__qty;
let g__per;
let g__price;

let sizes = JSON.parse(localStorage.getItem('sizes')) || [];

async function calculate() {
  let w_sc = W / width.value;
  let h_sc = H / height.value;
  
  let scale = (w_sc * h_sc);
  scale = scale - (scale % 1);

  g__no += 1;
  g__size = `${width.value} ✕ ${height.value}`;
  g__qty = qty.value;
  g__per = Math.ceil((glassPrice.value / scale) * 1);
  g__price = Math.ceil((glassPrice.value / scale) * qty.value);

  const obj = {
    id : g__no,
    size: g__size,
    qty : g__qty,
    per : g__per,
    price : g__price
  }
  let inserted = false;
  let inserted__index = 0;

  sizes.forEach((el,i) => {
    if (el.size == g__size) {
      inserted = true;
      inserted__index = i;
    }
  })
  if (inserted) {
    //The function pauses here
    let modal__response = await prompt__modal();
    if (modal__response == 'modify') {
      sizes[inserted__index] = obj;
      g__no--;
    } else if (modal__response == 'create') {
      sizes.push(obj);
    }
  } else {
    sizes.push(obj);
  }

  localStorage.setItem('sizes', JSON.stringify(sizes))
  localStorage.setItem('g__no', JSON.stringify(g__no))

  answer.innerHTML = `Glass Price: <b>${priceFormatter.format(g__price)}</b>`;
}

function error() {
  width.addEventListener('keyup', ()=>{
    if (!width.value) {
      w_f.classList.add('wrong');
      w_err.textContent = 'Empty?'
    } else {
      if (width.value.length < 3) {
        w_f.classList.add('wrong');
        w_err.textContent = 'Is\'nt this too small?';
      } else if(width.value > W) {
        w_f.classList.add('wrong');
        w_err.textContent = 'That\'s way large than what we have (3300)';
      } else {
        w_f.classList.remove('wrong');
        w_err.textContent = '';
      }
    }
  })
  height.addEventListener('keyup', ()=>{
    if (!height.value) {
      h_f.classList.add('wrong');
      h_err.textContent = 'Empty?'
    } else {
      if (height.value.length < 3) {
        h_f.classList.add('wrong');
        h_err.textContent = 'Is\'nt this too small?';
      } else if(height.value > W) {
        h_f.classList.add('wrong');
        h_err.textContent = 'That\'s way large than what we have (2140)';
      } else {
        h_f.classList.remove('wrong');
        h_err.textContent = '';
      }
    }
  })
  qty.addEventListener('keyup', ()=>{
    if (!qty.value) {
      q_f.classList.add('wrong');
      q_err.textContent = 'Empty?'
    } else {
      if (qty.value.length < 1) {
        q_f.classList.add('wrong');
        q_err.textContent = 'Is\'nt this too small?';
      } else {
        q_f.classList.remove('wrong');
        q_err.textContent = '';
      }
    }
  })
}


reset.addEventListener('click', ()=>{
  width.value = 0;
  height.value = 0;
  qty.value = 1;
  glassPrice.value = 90000;
})

tabulate.onclick = () => {
  render__rows();
}

function render__rows() {
  let table__body = document.querySelector('.table__body');
  let table__text = ``;

  sizes.forEach((el, index) => {

    let row = `
      <p class="row" data-id="${el.id}">
        <span class="sn col-1">${index + 1}</span>
        <span class="size col-2">${el.size}</span>
        <span class="quantity col-3">${el.qty}</span>
        <span class="per col-4">@${priceFormatter.format(el.per)}</span>
        <span class="total col-5">${priceFormatter.format(el.price)}</span>
        <span class="remove col-6">✕</span>
      </p>
      `;
      
    table__text += row;
  });
  table__body.innerHTML = table__text;
}

function prompt__modal() {
  
  //Wait for users to fire any of the three events below before terminating the function.
  return new Promise((resolve) => {
    let modal = document.querySelector('.modal');
    modal.classList.add('active')
    let modifybtn = modal.querySelector('#modify')
    let createbtn = modal.querySelector('#create')
    let closeModal = modal.querySelectorAll('#close-modal');

    modifybtn.onclick = () => {
      modal.classList.remove('active');
      resolve('modify');
    }
    createbtn.onclick = () => {
      modal.classList.remove('active');
      resolve('create');
    }

    closeModal.forEach(el => el.onclick = () => {
      modal.classList.remove('active');
      resolve('modify');
    });
  });
}

