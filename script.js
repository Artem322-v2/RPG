const player = {
    name: 'Рыцарь',
    level: 1,
    health: 110,
    strength: 10,
    armor: 4,
    inventory: [
        {
            Id: 'health-potion',
            name: 'Зелье лечения',
            type: 'potion',
            value: 20,
            description: 'Вы восстоновили 20 здоровья',

        }
    ],
};


const locations = {
    'tavern': {
        name: 'Таверна',
        className: 'tavern',
        description: 'Вы готовы к бою...',
        canGoTo: ['village', 'cave']

    },

    'village': {
        name: 'Деревня',
        className: 'village',
        description: 'Вы пришли в дервню и на вас напал Гоблин. Сражайтесь...',
        descriptionNotEnemy: 'Вы пришли в Деревню',
        enemy: {
            name: 'Гоблин',
            level: 1,
            health: 30,
            get strength() {
                return Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            },
            armor: 2,
            expiriance: 10,
            reward: {
                Id: 'fireBall',
                name: 'Заклинание: Огенный шар',
                type: 'spell',
                value: 30,
                description: 'Огенный шар попадает по врагу и наносит 30 урона',
            }
        },

    },

    'cave': {
        name: 'Пещера',
        className: 'cave',
        description: 'Вы пришли в пещеру и на вас напал Орк. Сражайтесь...',
        descriptionNotEnemy: 'Вы пришли в Пещеру',
        enemy: {
            name: 'Орк-воин',
            level: 2,
            health: 80,
            get strength() {
                return Math.floor(Math.random() * (12 - 8 + 1)) + 8;
            },
            armor: 3,
            expiriance: 30,
        },


    }
};

let currentLocation = 'tavern';

let locationsHistory = ['tavern'];

let locationData


function updateLocation() {

    const loc = locations[currentLocation];

    const locationSpan = document.getElementById('last-location');

    locationSpan.textContent = loc.name;

    locationSpan.className = loc.className


}

function moveTo(location) {

    currentLocation = location;

    locationData = locations[currentLocation];

    if (locationsHistory.includes(currentLocation)) {


    } else {

        if (locationData.enemy) {


            eventLog.innerHTML += `<p>${locationData.description}</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;

        } else {

            eventLog.innerHTML += `<p>${locationData.descriptionNotEnemy}</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;

        }

    }

    locationsHistory.push(currentLocation);
    updateLocation();
};

function goBack() {


    if ((locationsHistory.length > 1) || (locationsHistory.includes(currentLocation))) {

        const removed = locationsHistory.pop();

        currentLocation = locationsHistory[locationsHistory.length - 1];

        locationData = locations[currentLocation];

        eventLog.innerHTML += `<p>Вы вернулись в ${locationData.name}</p>`;
        eventLog.scrollTop = eventLog.scrollHeight;

        updateLocation();


    }
}

const goVillage = document.getElementById('go-village');

const goCave = document.getElementById('go-cave');

const goBackLocation = document.getElementById('go-back');

goVillage.addEventListener('click', function (e) {

    goVillage.classList.toggle('hide');
    moveTo('village');

})

goCave.addEventListener('click', function (e) {

    goCave.classList.toggle('hide');
    moveTo('cave');

})

goBackLocation.addEventListener('click', function (e) {

    if (currentLocation === 'village') {

        goVillage.classList.toggle('hide');
        goBack();


    } else if (currentLocation === 'cave') {

        goCave.classList.toggle('hide');
        goBack();

    }
})

const eventLog = document.getElementById('event-log');


function attackEnemy(enemy) {

    let damage = player.strength - enemy.armor;
    enemy.health = enemy.health - damage;

    if (enemy.health > 0) {

        eventLog.innerHTML += `<p>Вы аттаковали ${enemy.name}а и нанесли ${damage} урона. У ${enemy.name}а осталось ${enemy.health} здоровья</p>`;
        eventLog.scrollTop = eventLog.scrollHeight;

        let heroDamage = enemy.strength - player.armor;
        player.health = player.health - heroDamage;
        checkIfDead();

        eventLog.innerHTML += `<p>${enemy.name} атакует в ответ и наносит ${heroDamage} урона. У вас осталось ${player.health} здоровья</p>`;
        eventLog.scrollTop = eventLog.scrollHeight;

    } else {

        if (enemy.reward) {

            player.inventory.push(enemy.reward);
            delete locations[currentLocation].enemy;
            displayInventory();
            eventLog.innerHTML += `<p>Вы победили и заработали ${enemy.expiriance}</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;

        } else {
           
            delete locations[currentLocation].enemy;
            eventLog.innerHTML += `<p>Вы победили и заработали ${enemy.expiriance}</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;

        }
    }

}

const attack = document.getElementById('attack');

attack.addEventListener('click', function (e) {

    attackEnemy(locationData.enemy);
})

function blockAttack(enemy) {

    if (enemy) {

        let originalArmor = player.armor;

        player.armor = player.armor * 2;
        eventLog.innerHTML += `<p>Вы приняли защитную стойку, Ваша броня увеличена и равна ${player.armor}</p>`;
        eventLog.scrollTop = eventLog.scrollHeight;

        let heroDamage = enemy.strength - player.armor;

        if (heroDamage > 0) {
         
            player.health = player.health - Math.ceil(heroDamage * 1.5);
            checkIfDead();

            eventLog.innerHTML += `<p>${enemy.name} пробил защиту и нанес ${Math.ceil(heroDamage * 1.5)} критического урона. У вас осталось ${player.health} здоровья</p>`;
            eventLog.scrollTop = eventLog.scrollHeight;

        } else {

            let damage = player.strength - enemy.armor;
            enemy.health = enemy.health - damage * 2;

            if (enemy.health > 0) {

                eventLog.innerHTML += `<p>Защита успешна, Вы нанесли x2 урона. У врага осталось ${enemy.health} здоровья</p>`;
                eventLog.scrollTop = eventLog.scrollHeight;

            } else {

                eventLog.innerHTML += `<p>Вы победили и заработали ${enemy.expiriance}</p>`;
                eventLog.scrollTop = eventLog.scrollHeight;

            }

        }


        player.armor = originalArmor;
    };
};

const block = document.getElementById('block');

block.addEventListener('click', function (e) {
    blockAttack(locationData.enemy);
})

let inventoryActive = false;

const inventory = document.getElementById('inventory');

inventory.addEventListener('click', function (e) {

    if (inventoryActive) {

        inventoryActive = false;
        displayInventory();

    } else {
        alert('Выберите что хотите использовать в инвентаре');

        inventoryActive = true;
        displayInventory();
    }
})

const backpack = document.getElementById('backpack');

function displayInventory() {
    backpack.innerHTML = '';

    if (player.inventory.length === 0) {
        backpack.innerHTML = 'Пусто';
        return;
    }

    player.inventory.forEach((item, index) => {

        const itemElement = document.createElement('span');
        itemElement.setAttribute('index', index);
        itemElement.textContent = item.name;

        if (inventoryActive) {

            itemElement.addEventListener('mouseover', function (e) {
                this.style.color = 'orange';
                this.style.cursor = 'pointer';
            })

            itemElement.addEventListener('mouseout', function (e) {
                this.style.color = '';
            })

            itemElement.addEventListener('click', function (e) {
                useInventoryItem(index);
                inventoryActive = false;
                displayInventory();
            })
        }

        backpack.appendChild(itemElement);

        if (index < player.inventory.length - 1) {

            const separator = document.createTextNode(', ');
            backpack.appendChild(separator);

        }


    })



}

function checkIfDead() {
    if (player.health <= 0) {
        alert('Вы проиграли, нажмите закрыть чтоб начать заново');
        location.reload();
    } return false;
}

function useInventoryItem(itemIndex) {

    const item = player.inventory[itemIndex];

    switch (item.type) {
        case 'potion':
            usePotion(item);
            break;
        case 'spell':
            useFireBall(item);
            break;
    }

    player.inventory.splice(itemIndex, 1);
    displayInventory();
}

function usePotion(potion) {

    const oldHealth = player.health;
    player.health = Math.min(player.health + potion.value, 110);

    const heal = player.health - oldHealth;

    eventLog.innerHTML += `<p>Вы использовали ${potion.name} и восстановили ${heal} здоровья. Теперь у Вас ${player.health} здоровья</p>`;
    eventLog.scrollTop = eventLog.scrollHeight;

}

function useFireBall(spell) {
    // if (enemy) {
    locationData.enemy.health = Math.max(locationData.enemy.health - 30, 0);
    eventLog.innerHTML += `<p>Вы использовали ${spell.name} и нанесли врагу 30 урона. Теперь у врага ${locationData.enemy.name, locationData.enemy.health} здоровья</p>`;
    eventLog.scrollTop = eventLog.scrollHeight;

    // }
}

displayInventory();