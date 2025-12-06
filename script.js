let idcount = document.getElementsByClassName("line_card").length;
let linecount = 10000;
let lineContainer = new Map();
let cardContainer = new Map();

document.addEventListener('DOMContentLoaded', function() {
    Array.from(document.getElementsByClassName("line")).forEach(line => {
      lineContainer.set(line.id.slice(5), line);
      cardContainer.set(line.id.slice(5), Array.from(line.children))
    });
    // Для отслеживания состояния DOM. Скопировать в нужное место
    cardContainer.forEach((child, line) => {
        console.log(line);
        child.forEach(element => {
            console.log(`      >`, element);
        });
    });
});


function lineCreate(lineId, newLineId, position){
    let newLineHTML = `<div class="line" id="${'line-' + newLineId}"></div>`;
    console.log(cardContainer.get(lineId));
    lineContainer.get(lineId).insertAdjacentHTML(position, newLineHTML);
    lineContainer.set(newLineId, newLineHTML);
    cardContainer.set(newLineId, null);
}
        
function spaceCreate(card, position) {
  let newSpaceHTML = `<div class="line_space_free"></div>`
  card.insertAdjacentHTML(position, newSpaceHTML);
}

function cardCreate(card, dataSpouseId, dataChildrenIds, dataParentsIds, position) {
    let newCardHTML = `
        <div class="line_card" id="${idcount}" data-spouse-id="${dataSpouseId}" data-children-ids="${dataChildrenIds}" data-parents-ids="${dataParentsIds}">
            <div class="line_card_top_cross">
                <div class="line_card_cross_free line_card_cross_margin_right"></div>
                <div class="line_card_cross_free"></div>
            </div>
            <div class="line_card_main">
                <button class="button_spouse">добавить супруга</button>
                <button class="button_child">добавить ребенка</button>
                <button class="button_parent">добавить родителя</button>
            </div>
            <div class="line_card_bottom_cross">
                <div class="line_card_cross_free line_card_cross_margin_right"></div>
                <div class="line_card_cross_free"></div>
            </div>
        </div>
        `
    card.insertAdjacentHTML(position, newCardHTML);
}        

document.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    const lineCard = event.target.closest('.line_card');
    const line = event.target.closest('.line');
    const id = lineCard.id;
    const lineId = line ? line.id.split('-')[1] : null;
    if (event.target.classList.contains('button_spouse')) {
      addSpouse(lineId, id);
    } else if (event.target.classList.contains('button_child')) {
      addChild(lineId, id);
    } else if (event.target.classList.contains('button_parent')) {
      addParent(lineId, id);
    }
    // По желанию можно также определить, в каком div с классом line_card была нажата кнопка
    const parentDiv = event.target.closest('.line_card');
    if (parentDiv) {
      console.log('В div с id:', parentDiv.id);
    }
  }
});

function findCard(id) {
  return document.getElementById(id);
}

function findLine(lineId) {
   return document.getElementById('line-' + lineId);
}

function addSpouse(lineId, id) {
  let card = findCard(id);
  if(card.getAttribute('data-spouse-id') == null || card.getAttribute('data-spouse-id') == '') { // Проверяем, что у карточки нет супруга
    idcount++;
    card.dataset.spouseId = idcount;
    let iAHTML = 'afterend';
    cardCreate(card, id, card.dataset.childrenIds, '', iAHTML);
    spaceCreate(card, iAHTML);
    let childs = document.querySelectorAll('.line_card[data-parents-ids="1"]');
    childs.forEach(child => {
      child.dataset.parentsIds = id + ', ' + idcount;
    });
  }
}

function addChild(lineId, id) {
  console.log('Нажата кнопка добавить ребенка');
  idcount++;
  let card = findCard(id);
  let currentChildIds = card.dataset.childrenIds; // считываем id детей
  let currentSuposeIds = card.dataset.spouseId; // считываем id супруга
  console.log(currentSuposeIds);
  let newValue = currentChildIds ? currentChildIds + ', ' + idcount : idcount; // добавляем новое значение к добытым данным, это будет новое id ребенка в списке
  let newLineId = Number(lineId) + 1; // вычисляем id новой линии
  if (findLine(newLineId) === null) {  // проверяем, есть ли уже эта линия
    lineCreate(lineId, newLineId, 'afterend'); // если нет - создаем новую
    cardCreate(findLine(newLineId), '', '', currentSuposeIds === '' ? id : currentSuposeIds + ', ' + id, 'afterbegin'); // и добавляем в нее новую карточку
    findCard(currentSuposeIds).dataset.childrenIds = currentSuposeIds === '' ? id : currentSuposeIds + ', ' + id;
    card.dataset.childrenIds = newValue; // добавляем в атрибут родителя новое значение id-шек детей
  } else { // если есть
    cardCreate(findCard(currentChildIds.split(',').pop().trim()), '', '', currentSuposeIds === '' ? id : currentSuposeIds + ', ' + id, 'afterend'); // находим последнего брата/сестру в списке
    spaceCreate(findCard(currentChildIds.split(',').pop().trim()), 'afterend'); // и добавляем новую карточку после него
    findCard(currentSuposeIds).dataset.childrenIds = currentSuposeIds === '' ? id : currentSuposeIds + ', ' + id;
    card.dataset.childrenIds = newValue; // добавляем в атрибут родителя новое значение id-шек детей
  }
}

function addParent(lineId, id) {
  console.log('Нажата кнопка добавить родителя');
  idcount++;
  let newLineId = 'line-' + (Number(lineId) - 1); // вычисляем id новой линии


  if (document.getElementById(newLineId) === null) {  // проверяем, есть ли уже эта линия
    lineCreate(newLineId, 'line-' + lineId, 'beforebegin'); // если нет - создаем новую
    cardCreate(newLineId, '', '', id, 'afterbegin'); // и добавляем в нее новую карточку
  } else { // если есть

  }
}