const cards = document.querySelector('#cards');
const addBtn = document.querySelector('#add-btn');
const players = [];

const addCard = async x => {
    players.push(x);
    const card = document.createElement('div');
        const innerCard = document.createElement('div');
        const name = document.createElement('h2');
        const title = document.createElement('h3');
        const description = document.createElement('h3');
        const deleteBtn = document.createElement('span');

        description.classList.add('description', 'editable');
        description.textContent = x.description;
        title.classList.add('title', 'editable');
        title.textContent = x.title;
        name.classList.add('name', 'editable');
        name.textContent = x.name;
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';
        innerCard.classList.add('inner-card');
        card.classList.add('card');
        card.id = `card-${x.id}`;

        innerCard.appendChild(deleteBtn);
        innerCard.appendChild(name);
        innerCard.appendChild(title);
        innerCard.appendChild(description);

        card.appendChild(innerCard);
        cards.appendChild(card);
        const editable = [...card.querySelectorAll('.editable')];
        editable.forEach(x => x.addEventListener('click', editPlayer));
        const deletes = card.querySelector('.delete-btn');
        deletes.onclick = deletePlayer;
}

const fetchData = async () => {
    const rawResponse = await fetch('http://localhost:3000/players');
    const response = await rawResponse.json();
    response.forEach(x => addCard(x));
    const editable = [...document.querySelectorAll('.editable')];
    editable.forEach(x => x.addEventListener('click', editPlayer));
    const deletes = [...document.querySelectorAll('.delete-btn')];
    deletes.forEach(x => x.onclick = deletePlayer);
}

fetchData();

const addPlayer = async e => {
    e.preventDefault();
    const name = document.querySelector('#input-name').value;
    const title = document.querySelector('#input-title').value;
    const description = document.querySelector('#input-description').value;
    if(!name || !title || !description || !name.trim() || !title.trim() || !description.trim())
        return;
    const rawResponse = await fetch('http://localhost:3000/players', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            name, title, description
        })
    });
    const response = await rawResponse.json();
    addCard(response);
    document.querySelector('#input-name').value = '';
    document.querySelector('#input-title').value = '';
    document.querySelector('#input-description').value = '';
}


const editPlayer = async e => {
    const newData = prompt('Enter the new information:');
    if(!newData || !newData.trim())
        return;
    const parentCard = e.target.parentElement.parentElement;
    const k = parentCard.id.split('-')[1];
    const playerData = {
        name: parentCard.querySelector('.name').textContent,
        title: parentCard.querySelector('.title').textContent,
        description: parentCard.querySelector('.description').textContent
    }
    const field = e.target.classList[0];
    playerData[field] = newData;
    parentCard.querySelector(`.${field}`).textContent = newData;
    const rawResponse = await fetch(`http://localhost:3000/players/${k}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(playerData)
    });
    const response = await rawResponse.json();
}

const deletePlayer = async e => {
    const parentCard = e.target.parentElement.parentElement;
    const k = parentCard.id.split('-')[1];
    const rawResponse = await fetch(`http://localhost:3000/players/${k}`, {
        method: 'DELETE'
    });
    const response = await rawResponse.json();
    parentCard.remove();
}

addBtn.addEventListener('click', addPlayer);
document.querySelector('#input-description').addEventListener('keypress', e => {
    if(e.key === 'Enter')
        addPlayer(e);
});