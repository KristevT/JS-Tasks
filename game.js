const readline = require('readline');

let player = {
    name: 'Игрок',
    health: 100,
    maxHealth: 100,
    weapon: {name: 'Кулак', damage: 3, type: 'default' },
    inventory: [],
    location: 'start'
};

const weapons = {
    shovel: { name: 'Лопата', damage: 10, type: 'default' },
    pickaxe: { name: 'Кирка', damage: 25, type: 'default' },
    jackhammer: { name: 'Отбойный молоток', damage: 20, type: 'triple' }
}

const items = {
    meal: {name: 'Сухпаек', value: 50, type: 'food' },
    water: {name: 'Вода', value: 35, type: 'food' },
    tnt: {name: 'Динамит', value: 200, type: 'weapon' }
}

const enemies = {
    bat: { name: 'Летучая Мышь', health: 50, damage: 15 },
    crawling: { name: 'Ползучий', health: 80, damage: 20 },
    amalgam: { name: 'Склеенный', health: 250, damage: 30 }
}

let eventVariables = {
    shovelPicked: false,
    jackhammerPicked: false,
    glovesPicked: false,
    cartKicked: false,
    gatesButton: false,
    gatesElectricity: false,
    locker1Checked: false,
    // locker2Checked: false, // КАЛЕНДАРЬ
    locker3Checked: false,
    locker4Checked: false,
    // locker5Checked: false, // ЗАПЕРТ
    locker6Checked: false,
    blockageExploded: false
}

let locations = {
    start: {
        name: 'Дно шахты',
        description: [
            'Темно и душно. Тело еле чувствуется.',
            'Вы пытаетесь понять, что только что случилось, но голова будто в тумане.',
            'Вдали загрохотало. Глаза с трудом начинают открываться, и сквозь расплывчитость вы оцениваете обстановку.',
            'Мощный фонарь на каске освещает потолок из темных пород, который украшают провода и трубы.',
            'Это шахта. Вы оказались в нескольких сотнях метров под землей без единого понятия о своем положении. Снова грохот.',
            '*стук*',
            'Сверху на вас посыпались породы. Это помогло немного прийти в себя.',
            'Вы поднимаетесь на ноги и отряхиваетесь от земли. Лампы сломаны, в такой мгле фонарь на каске как раз кстати.',
            'Вы оглядываетесь по сторонам, освещая участок вокруг себя.',
            'Впереди пыльный мрачный корридор, потенциально ведущий к поверхности.',
            'В нескольких шагах от вас лежит лопата.'
        ],
        choices: [
            { text: '[ подобрать лопату    ]', event: 'pickupShovel' },
            { text: '[ пройти по корридору ]', nextLocation: 'tunnelBlocked' }
        ]
    },
    tunnelBlocked: {
        name: 'Тоннель',
        description: [
            'Вы начинаете идти вглубь пещеры, путь помечает дорожка из рельс.',
            'Настораживает то, что потолок постепенно уходит вниз.',
            'С продвижением вглубь прохода. Вдали что-то виднеется: свет в конце тоннеля.',
            'Это отражение вашего фонаря об поверхность железной вагонетки, которую завалило булыжниками, путь прегражден.',
            'Вам понадобится что-то, чем можно подтолкнуть вагонетку, придется вернуться за лопатой.'
        ],
        choices: [
            { text: '[ вернуться в начало ]', event: 'locationStart' },
        ]
    },
    tunnelOpen: {
        name: 'Тоннель',
        description: [
            'Вагонетка дернулась и даже немного проехала по рельсам.',
            'Камни зашатались и несколько больших булыжников покатились на землю, чуть не задавив вас.',
            'Открылся небольшой проход, через который можно пролезть',
        ],
        choices: [
            { text: '[ пролезть дальше ]', event: 'battleBat' },
        ]
    },
    gates: {
        name: 'Ворота',
        description: [
            'Впереди вас встречают огромные ворота и панель с кнопками. Слева и справа ещё по комнате, там наверняка что-то есть.'
        ],
        choices: [
            { text: '[ подойти к панели ]', nextLocation: 'gatesPanel' },
            { text: '[ пойти налево     ]', nextLocation: 'terminalRoom' },
            { text: '[ пойти направо    ]', nextLocation: 'lockers' }
        ]
    },
    gatesPanel: {
        name: 'Панель управления',
        description: [
            'Вы подходите к панели и осматриваете её в поисках нужной кнопки.',
            'На месте, подписанном как "Открыть", её как раз нет на месте, где-то надо найти замену.',
            'Вы так же замечаете, что остальные кнопки не горят: панель ещё и обесточена.'
        ],
        choices: [
            { text: '[ пойти налево   ]', nextLocation: 'terminalRoom' },
            { text: '[ пойти направо  ]', nextLocation: 'lockers' }
        ]
    },
    terminalRoom: {
        name: 'Терминал',
        description: [
            'Вы идете налево.',
            'И тут панель, только теперь с экранчиком и с ещё большим количеством кнопок с цифрами и буквами на них.',
            'Это первый раз, когда вы имеете дело с такой продвинутой электроникой.'
        ],
        choices: [
            { text: '[ нажать случайную кнопку ]', nextLocation: 'terminalCaptchaIntro' },
            { text: '[ вернуться к воротам     ]', nextLocation: 'gates' }
        ]
    },
    terminalCaptchaIntro: {
        name: 'Терминал',
        description: [
            'Вы нажимаете на продолговатую кнопку без надписей. На чёрном экране белыми буквами высвечивается:',
            '# ДЛЯ ПРОДОЛЖЕНИЯ РАБОТЫ ПРОЙДИТЕ КОРОТКУЮ ПРОВЕРКУ',
            '# ИСПОЛЬЗУЙТЕ КЛАВИШИ С ЦИФРАМИ 0-9 В ВЕРХНЕЙ ЧАСТИ ПАНЕЛИ ДЛЯ ВВОДА ОТВЕТА',
            '# ЗАТЕМ КЛАВИШУ [ВВОД] В ПРАВОЙ ЧАСТИ ПАНЕЛИ ДЛЯ ПОДТВЕРЖДЕНИЯ',
            '# НАБЕРИТЕ ЦИФРУ 1 И НАЖМИТЕ [ВВОД], КОГДА БУДЕТЕ ГОТОВЫ ПРИСТУПИТЬ К ТЕСТУ'
        ],
        choices: [
            { text: '[ начать проверку ]', event: 'terminalCaptcha' }
        ]
    },
    terminalCaptchaCompleted: {
        name: 'Терминал',
        description: [
            '# СИСТЕМА РАЗБЛОКИРОВАНА',
            '# ВЫБЕРИТЕ ОДИН ИЗ СЛЕДУЮЩИХ ПУНКТОВ'
        ],
        choices: [
            { text: '[ # СОСТАВИТЬ ОТЧЕТ ]', event: 'logTerminalReport'},
            { text: '[ # УПРАВЛЕНИЕ ЭЛЕКТРИЧЕСТВОМ ]', event: 'logTerminalElectricity'},
            { text: '[ # ПОЧТА ]', event: 'logTerminalMail'},
            { text: '[ # О СИСТЕМЕ ]', event: 'logTerminalAbout'},
            { text: '[ покинуть терминал ]', event: 'pickupGloves'}
        ]
    },
    lockers: {
        name: 'Комната перекура',
        description: [
            'Похоже на комнату для перекура, вдоль стенки деревянные полки и шкафчики - там рабочие наверняка оставили свои вещи.'
        ],
        choices: [
            { text: '[ открыть шкафчик #1  ]', event: 'locker1' },
            { text: '[ открыть шкафчик #2  ]', event: 'locker2' },
            { text: '[ открыть шкафчик #3  ]', event: 'locker3' },
            { text: '[ открыть шкафчик #4  ]', event: 'locker4' },
            { text: '[ открыть шкафчик #5  ]', event: 'locker5' },
            { text: '[ открыть шкафчик #6  ]', event: 'locker6' },
            { text: '[ вернуться к воротам ]', nextLocation: 'gates' }
        ]
    },
    crossroad: {
        name: 'Перекресток',
        description: [
            ''
        ],
        choices: [
            { text: '[ убежать налево    ]', event: 'battleCrawling' },
            { text: '[ подойти к стрелку ]', nextLocation: 'crossroadRescuer' }
        ]
    },
    crossroadRescuer: {
        name: 'Стрелок',
        description: [
            ''
        ],
        choices: [
            { text: '[ пройти в лифт ]', event: 'pickupMask' }
        ]
    },
    elevatorExplosion: {
        name: 'Лифт',
        description: [
            ''
        ],
        choices: [
            { text: '[ осмотреться ]', nextLocation: 'deadendLocked' }
        ]
    },
    deadendLocked: {
        name: 'Тупик',
        description: [
            ''
        ],
        choices: [
            { text: '[ пройти к завалу ]', event: 'logBlockage' },
            { text: '[ подобрать кирку ]', event: 'pickupPickaxe' },
            { text: '[ сломать стену   ]', event: 'breakWall' },
        ]
    },
    deadendOpen: {
        name: 'Тупик',
        description: [
            ''
        ],
        choices: [
            { text: '[ пройти к завалу             ]', event: 'logBlockage' },
            { text: '[ пойти в задымленный туннель ]', event: 'smokeTunnel' },
        ]
    },
    smokeTunnel: {
        name: 'Задымленный проход',
        description: [
            ''
        ],
        choices: [
            { text: '[ пойти вперед       ]', nextLocation: 'endingRescued' }, // КОНЦОВКА 2
            { text: '[ вернуться к тупику ]', nextLocation: 'deadendOpen' },
        ]
    },
    darkTunnel: {
        name: 'Темный тоннель',
        description: [
            ''
        ],
        choices: [
            { text: '[ начать битву ]', event: 'battleCrawling' }
        ]
    },
    railFork: {
        name: 'Развилка',
        description: [
            'После нескольких минут блуждания вас встречает развилка.',
            'Впереди виднеется мелькающий свет, направо же сворачивают рельсы, и там тоже горит свет: лампы, на удивление, рабочие.',
            'На повороте остановилась вагонетка. Среди бурых минералов в ней виднеется что-то еще.'
        ],
        choices: [
            { text: '[ пойти прямо         ]', nextLocation: 'deadendBurning' },
            { text: '[ свернуть направо    ]', nextLocation: 'roomFriendUnconscious' },
            { text: '[ осмотреть вагонетку ]', event: 'pickupJackhammer' }
        ]
    },
    deadendBurning: {
        name: 'Пожар вдалеке',
        description: [
            'Вы продолжаете идти прямо. Продвигаясь дальше, вдруг приходит осознание: источник света - это языки пламени.',
            'Ту часть шахты охватил пожар. Вы разворачиваетесь и бежите обратно к развилке. На пути ящик привлекает ваше внимание.',
        ],
        choices: [
            { text: '[ осмотреть ящик ]', event: 'pickupTNT' }
        ]
    },
    roomFriendUnconscious: {
        name: 'Комната с рабочим',
        description: [
            ''
        ],
        choices: [
            { text: '[ разбудить рабочего ]', nextLocation: 'friendUnconscious' },
            { text: '[ бежать дальше      ]', nextLocation: 'turningBlockage' }
        ]
    },
    friendUnconscious: {
        name: 'Рабочий без сознания',
        description: [
            ''
        ],
        choices: [
            // ОТКРЫТЬ ИНВЕНТАРЬ
            { text: '[ оставить рабочего ]', nextLocation: 'roomFriendUncoscious' }
        ]
    },
    cartBlockage: {
        name: 'Прегражденный краткий путь',
        description: [
            ''
        ],
        choices: [
            { text: '[ толкнуть вагонетку ]', event: 'pushCart' }
        ]
    },
    shortcutAmalgam: {
        name: 'Краткий путь',
        description: [
            ''
        ],
        choices: [
            { text: '[ начать битву ]', event: 'battleAmalgam' }
        ]
    },
    shortcutElevator: {
        name: 'Лифт',
        description: [
            ''
        ],
        choices: [
            { text: '[ начать битву ]', nextLocation: 'endingFriend' } // КОНЦОВКА 1
        ]
    },
    turningBlockage: {
        name: 'Заваленная развилка',
        description: [
            ''
        ],
        choices: [
            { text: '[ повернуть налево ]', nextLocation: '???' } // КОНЦОВКА 3 ЧЕТОТАМ
            // ОТКРЫТЬ ИНВЕНТАРЬ, ВЫБРАТЬ ДИНАМИТ, ВЫЙТИ НА КОНЦОВКУ 4
        ]
    },
    turningExploded: {
        name: 'Освобожденная развилка',
        description: [
            ''
        ],
        choices: [
            { text: '[ повернуть налево              ]', nextLocation: '???' },
            { text: '[ пройти по взорванному тоннелю ]', nextLocation: 'deadendLocked' }
        ]
    },
};


  
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
  
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}
  
async function displayDescription(description) {
    for (const line of description) {
        await askQuestion(line);
    }
}

async function changeLocation(locationName) {
    // console.log(`Перемещение в: ${locations[locationName].name}`);
    // await delay(1000);
    player.location = locationName;
    await showLocation();
}

async function handleEvent(event) {
    // console.log(`Происходит событие: ${event}`);
    // await delay(1000);

    switch (event) {
        case 'pickupShovel': // ПОЛУЧЕНИЕ ОРУЖИЯ
            console.log('Вы подбираете лопату. Похоже, она изначально принадлежала именно вам.');
            console.log('* Лопата теперь в слоте [Оружие]');
            player.weapon = weapons.shovel;
            locations.start.description = [
                'Из возможных путей вы видите только темный корридор, скорее всего ведущий наверх.'
            ];
            locations.start.choices = [
                { text: '[ пройти по корридору ]', nextLocation: 'tunnelBlocked' }
            ];
            locations.tunnelBlocked.description = [
                'Вы начинаете идти вглубь пещеры, путь помечает дорожка из рельс.',
                'Настораживает то, что потолок постепенно уходит вниз.',
                'С продвижением вглубь прохода. Вдали что-то виднеется: свет в конце тоннеля.',
                'Это отражение вашего фонаря об поверхность железной вагонетки, которую завалило булыжниками, путь прегражден.',
                'Вы можете использовать лопату, чтобы подтолкнуть вагонетку.'
            ];
            locations.tunnelBlocked.choices = [
                { text: '[ ударить лопатой ]', event: 'kickCart' },
            ];
            break;
        
        case 'pickupPickaxe':
            console.log('Вы подбираете кирку.');
            console.log('* Кирка теперь в слоте [Оружие]');
            player.weapon = weapons.pickaxe;
            // player.location = '';
            break;
        case 'pickupJackhammer':
            if ( eventVariables.jackhammerPicked === false ) {
                console.log('Кто-то оставил в вагонетке отбойный молоток. Пожалуй, вам он будет нужнее.');
                console.log('* Отбойный молоток теперь в слоте [Оружие]');
                player.weapon = weapons.jackhammer;
                eventVariables.jackhammerPicked = true;
                break;
            } else {
                console.log('Вагонетка заполнена серо-бурыми минералами.');
                console.log('Ваши профессиональные знания подсказывают, что это железистый кварцит.');
                break;
            }

        case 'pickupTNT': // ДОБАВЛЕНИЕ В ИНВЕНТАРЬ
            console.log('Там лежит связка динамита. Вы быстро хватаете ее и возвращаетесь к повороту.');
            console.log('* Динамит теперь в инвентаре. Вы можете использовать его в бою, как одноразовый предмет');
            player.inventory.push(items.tnt);
            // player.location = 'railForkFireSpotted';
            break;
        
        case 'pickupGloves': // ЭКИПИРОВКА ОДЕЖДЫ (+К МАКСИМАЛЬНОМУ ЗДОРОВЬЮ)
            if ( eventVariables.glovesPicked === false ) {
                console.log('Перед тем как покинуть терминал, ваш взгляд упал на пару рабочих перчаток.');
                console.log('Вы их надеваете. Честно говоря, ваши измазанные углем руки уже поздно спасать.');
                console.log('* Перчатки были экипированы. Максимальное здоровье повышено');
                player.maxHealth += 20;
                player.health = player.maxHealth;
                player.location = 'gates';
                eventVariables.glovesPicked = true;
                break;
            } else {
                console.log('Вы покидаете терминал.');
                player.location = 'gates';
                break;
            }

        case 'pickupMask':
            console.log('Вы надеваете респиратор. На теле не осталось ни одного открытого местечка.');
            console.log('* Респиратор был экипирован. Максимальное здоровье повышено');
            player.maxHealth += 30;
            player.health = player.maxHealth;
            // player.location = 'gates';
            break;

        case 'locker1': // ШКАФЧИКИ
            if ( eventVariables.locker1Checked === false ) {
                console.log('На полке лежит замотанный в газету паек из хлеба, колбасы и печенья - тормозок. Пустой желудок сразу дал о себе знать.');
                console.log('* Сухпаек теперь в инвентаре. Вы можете использовать его в бою, как одноразовый предмет');
                player.inventory.push(items.meal);
                eventVariables.locker1Checked = true;
                break;
            } else {
                console.log('Шкафчик пуст.');
                break;
            }
        case 'locker2':
            console.log('На стенке шкафчика висит выцветший календарь. Бледными красно-черными буквами написано:');
            console.log('Понедельник, 5 октября, 1992. Веселое начало недели.');
            break;
        case 'locker3':
            if ( eventVariables.locker3Checked === false ) {
                console.log('Из шкафчика доносится странный шум. Вы открываете дверцу и видите на полке рацию. Среди помех что-то слышно:');
                console.log('## ПРИ КОНТАКЕ ##### УСТРАНИТЬ #####');
                console.log('Рация затихает, сели батарейки. Жуть.');
                eventVariables.locker3Checked = true;
                break;
            } else {
                console.log('На полке лежит разряженная рация. Шум больше не доносится.');
                break;
            }
        case 'locker4':
            if ( eventVariables.locker4Checked === false ) {
                console.log('На дне шкафчика стоит чемоданчик со всякой всячиной по типу проводов, рычажков и.. Кнопки! Как раз то, что нужно');
                console.log('Вы отбираете сразу несколько на вид подходящих кнопок и несете с собой.');
                console.log('* Кнопки теперь в инвентаре.');
                eventVariables.gatesButton = true;
                eventVariables.locker4Checked = true;
                if ( eventVariables.gatesElectricity === false ) {
                    locations.gatesPanel.description = [
                        'Вы подходите к панели с горстью кнопок.',
                        'Вы приглядываете самую подходящую и крепите её к панели сердитым ударом кулака.',
                        'Кнопка нажимается, но без эффекта, надо восстановить подачу тока'
                    ];
                } else if ( eventVariables.gatesElectricity === true ) {
                    locations.gatesPanel.description = [
                        'Вы подходите к панели, теперь видно, что она рабочая.',
                        'Теперь можно открыть ворота.'
                    ];
                    locations.gatesPanel.choices = [
                        { text: '[ открыть ворота   ]', nextLocation: 'crossroad' },
                        { text: '[ пойти налево     ]', nextLocation: 'terminalRoom' },
                        { text: '[ пойти направо    ]', nextLocation: 'lockers' }
                    ];
                }
                break;
            } else {
                console.log('На дне шкафчика стоит чемоданчик со всякой всячиной. Вы уже взяли то, что нужно.');
                break;
            }
        case 'locker5':
            console.log('Шкафчик наглухо заперт.');
            break;
        case 'locker6':
            if ( eventVariables.locker6Checked === false ) {
                console.log('На полке стоит бутылка минеральной воды. Вы сразу узнали бело-красную этикетку "Боржоми".');
                console.log('* Вода теперь в инвентаре. Вы можете использовать ее в бою, как одноразовый предмет');
                player.inventory.push(items.water);
                eventVariables.locker6Checked = true;
                break;
            } else {
                console.log('Шкафчик пуст.');
                break;
            }

        
        case 'locationStart': // ПОЛУИВЕНТ/СМЕНА ЛОКАЦИИ
            locations.start.description = [
                'Вы оглядываетесь по сторонам, освещая участок вокруг себя.',
                'Впереди пыльный мрачный корридор, потенциально ведущий к поверхности.',
                'В нескольких шагах от вас лежит лопата.'
            ]
            player.location = 'start';
            break;
        case 'kickCart':
            while (eventVariables.cartKicked === false) {
                await askQuestion('Нажмите [ENTER] для нанесения атаки');
                let damageDealt = await quickTimeEvent();
                console.log('\nВы бьёте лопатой по углу вагонетки.');
                if (damageDealt != 30) {
                    console.log('Она немного качнулась, пара булыжников упали вниз. Надо попробовать сильнее.');
                } else {
                    console.log('Вы достаточно сильно ударили по ней.');
                    eventVariables.cartKicked = true;
                }
            }
            player.location = 'tunnelOpen';
            break;
        
        case 'terminalCaptcha':
            function generateMathExample() {
                const num1 = Math.floor(Math.random() * 50) + 1;
                const num2 = Math.floor(Math.random() * 50) + 1;
                const operators = ['+', '-'];
                const operator = operators[Math.floor(Math.random() * operators.length)];
                const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
                const example = `${num1} ${operator} ${num2}`;
            
                return { example, correctAnswer };
            }

            function askExample() {
                return new Promise((resolve) => {
                    const { example, correctAnswer } = generateMathExample();
                    rl.question(`# ВВЕДИТЕ ОТВЕТ ДЛЯ: ${example}\n`, (userInput) => {
                        const userAnswer = parseInt(userInput, 10);
                        resolve(userAnswer === correctAnswer);
                    });
                });
            }

            const targetCount = 3;
            let correctCount = 0;
        
            while (correctCount < targetCount) {
                const isCorrect = await askExample();
        
                if (isCorrect) {
                    correctCount++;
                    console.log(`# ВЕРНО! ОСТАЛОСЬ ПРИМЕРОВ: ${targetCount - correctCount}`)
                } else {
                    console.log(`# НЕВЕРНО! ПОПРОБУЙТЕ ЕЩЕ РАЗ`)
                }
            }

            console.log('# ВСЕ ПРИМЕРЫ РЕШЕНЫ, БЛАГОДАРИМ ЗА ПРОХОЖДЕНИЕ ПРОВЕРКИ');
            eventVariables.captchaCompleted = true;
            player.location = 'terminalCaptchaCompleted';
            locations.terminalRoom.description = [
                'Вы идете налево и заходите в комнату с терминалом. Система уже разблокирована.'
            ];
            locations.terminalRoom.choices = [
                { text: '[ войти в терминал    ]', nextLocation: 'terminalCaptchaCompleted' },
                { text: '[ вернуться к воротам ]', nextLocation: 'gates' }
            ];
            break;

        case 'logBlockage': // НЕБОЛЬШОЙ ТЕКСТ
            if ( eventVariables.blockageExploded === true ) {
                player.location = 'turningExploded';
            } else {
                console.log('\nПроход завален, движение невозможно')
            }
            break;
        case 'logTerminalReport':
            console.log('\n# === 3 ОКТЯБРЯ, СУББОТА, ОТЧЕТ ===');
            console.log('# КАМЕННОГО УГЛЯ ДОБЫТО: 4 Т.');
            console.log('# ЖЕЛЕЗИСТОГО КВАРЦИТА ДОБЫТО: 1 Т.');
            console.log('# ВАГОНЕТОК ПОГРУЖЕНО: 6');
            console.log('\n# === 5 ОКТЯБРЯ, ПОНЕДЕЛЬНИК, ОТЧЕТ ===');
            console.log('# КАМЕННОГО УГЛЯ ДОБЫТО: 0.6 Т.');
            console.log('# ЖЕЛЕЗИСТОГО КВАРЦИТА ДОБЫТО: 0.1 Т.');
            console.log('# ЖЕРТВ: 146');
            break;
        case 'logTerminalMail':
            console.log('\n# У ВАС 1 НЕПРОЧИТАННОЕ СООБЩЕНИЕ:');
            console.log('# KUZMIN.AS: "САНЯ ПРИНЕСИ ЧАЯ"');
            break;
        case 'logTerminalAbout':
            console.log('\n#     ОС | MS-DOS');
            console.log('# ВЕРСИЯ | 2.1.01425');
            console.log('#    ИМЯ | MGNTSHT');
            break;
        case 'logTerminalElectricity':
            if (eventVariables.gatesElectricity === false) {
                console.log('\n# ОБНАРУЖЕНЫ НЕПОЛАДКИ С ЭЛЕКТРИЧЕСТВОМ');
                console.log('# ПОДАЧА АВАРИЙНОГО ПИТАНИЯ');
                console.log('# ...');
                console.log('# ПРОБЛЕМА С ЭЛЕКТРИЧЕСТВОМ УСТРАНЕНА');
                eventVariables.gatesElectricity = true;
                if ( eventVariables.gatesButton === false ) {
                    locations.gatesPanel.description = [
                        'Вы подходите к панели и осматриваете её.',
                        'Кнопки теперь тускло подсвечиваются, но нужной вам все ещё нет на месте, где-то надо найти замену.'
                    ];
                } else if ( eventVariables.gatesButton === true ) {
                    locations.gatesPanel.description = [
                        'Вы подходите к панели, теперь видно, что она рабочая.',
                        'Теперь можно открыть ворота.'
                    ];
                    locations.gatesPanel.choices = [
                        { text: '[ открыть ворота   ]', nextLocation: 'crossroad' },
                        { text: '[ пойти налево     ]', nextLocation: 'terminalRoom' },
                        { text: '[ пойти направо    ]', nextLocation: 'lockers' }
                    ];
                }
            } else {
                console.log('\n# СИСТЕМА НЕ НАШЛА НЕПОЛАДОК');
            }
            break;
    
        case 'battleBat': // БИТВА
            console.log('\nВ вашу сторону что-то летит, явно злобно настроенное...');
            await startBattle(enemies.bat);
            break;
        case 'battleCrawling':
            console.log('\nВы убегаете в темный проход слева, дабы вас не заметили.');
            console.log('Что-то аморфное на земле задевает вас и вы спотыкаетесь.');
            console.log('Вы растерянно поворачиваете голову в сторону препятствия и видите ползущего шахтера.');
            console.log('На нем не узнать лица. Это нежить, жаждущая плоти. Вы хватаетесь за лопату.');
            await startBattle(enemies.crawling);
            break;
        case 'battleAmalgam':
            await startBattle(enemies.amalgam);
            break;

        case 'endingRuins': // КОНЦОВКА
            console.log('Вы нашли древний артефакт. Путешествие принимает неожиданный поворот!');
            player.inventory.push('Древний артефакт');
            endGame('unexpected');
            return;
    }

    await showLocation();
}


async function showLocation() {
    const location = locations[player.location];
    // console.log(`\n=== ${location.name} ===`);
    console.log('');
    await displayDescription(location.description);
    // console.log('Выберите действие:');
  
    location.choices.forEach((choice, index) => {
        console.log(`${index + 1} - ${choice.text}`);
    });
  
    const choiceIndex = parseInt(await askQuestion('Введите номер действия: ')) - 1;
    const choice = location.choices[choiceIndex];
  
    if (choice) {
        if (choice.nextLocation) {
            await changeLocation(choice.nextLocation);
        } else if (choice.event) {
            await handleEvent(choice.event);
        }
    } else {
        console.log('Неверный выбор. Попробуйте снова.');
        await showLocation();
    }
}

async function startBattle(enemy) {
    console.log(`Начинается битва с: ${enemy.name}`);
  
    while (player.health > 0 && enemy.health > 0) {
        console.log(`\nВаше здоровье: ${player.health}`);
        console.log(`Здоровье врага: ${enemy.health}`);
  
        await askQuestion('Нажмите [ENTER] для нанесения атаки');
        let damageDealt;
        if (player.weapon.type === 'triple') {
            damageDealt = await quickTimeEventTriple();
        } else {
            damageDealt = await quickTimeEvent();
        }
        
        if (damageDealt === 0) {
            console.log('Вы промахиваетесь...')
        } else {
            console.log(`Вы наносите ${damageDealt} урона!`);
        }
        enemy.health -= damageDealt;
  
        if (enemy.health <= 0) {
            console.log(`Вы победили ${enemy.name}!`);
            player.health = player.maxHealth;
            
            switch (enemy) {
                case enemies.bat:
                    console.log('Расправившись с бешеной мышью, вы наконец выходите на свет.');
                    player.location = 'gates';
                    break;
                case enemies.crawling:
                    console.log('Вы отсекаете ползучему голову. Она шмякается на пол, как холодец. Вы спешите дальше.');
                    player.location = 'railFork';
                    break;
            }

            return;
        }
  
        let enemyDamage = Math.round(enemy.damage * (0.8 + Math.random() * 0.4));
        console.log(`${enemy.name} наносит вам ${enemyDamage} урона.`);
        player.health -= enemyDamage;
  
        if (player.health <= 0) {
            console.log('Вы потерпели поражение...');
            endGame('defeat');
            return;
        }
  
        await delay(1000);
    }
}
  
 
async function runSingleQTE(duration, maxMultiplier) {
    console.log('Запуск атаки...');
    const startTime = Date.now();
    
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            console.clear();
            console.log('[░░░░░░▒▒▒▓▓▒▒▒░░░░░░]');
            console.log(`[${'='.repeat(Math.floor(progress * 20))}${' '.repeat(20 - Math.floor(progress * 20))}]`);
  
            if (progress >= 1) {
                clearInterval(interval);
                resolve(1);
            }
        }, 50);
  
        rl.once('line', () => {
            clearInterval(interval);
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            let multiplier = 0;
            if (0.5 < progress && progress < 0.6) {
                multiplier = maxMultiplier;
            } else if ((0.3 < progress && progress <= 0.5) || (0.6 <= progress && progress < 0.8)) {
                multiplier = maxMultiplier / 2;
            } else if ((0 < progress && progress <= 0.3) || (0.8 <= progress && progress < 1)) {
                multiplier = 1;
            }
            // console.log(progress)
            // console.log(multiplier)
            resolve(player.weapon.damage * multiplier);
        });
    });
}
  
async function quickTimeEvent() {
    console.log('Вы наносите удар! Нажмите Enter, чтобы остановить шкалу атаки!');
    return runSingleQTE(2000, 3); // Стандартное оружие с длительностью 2 секунды и множителем от 1 до 3
}

async function quickTimeEventTriple() {
    console.log('Вы атакуете отбойным молотком! Нажмите Enter, чтобы остановить каждую из трех шкал!');
    
    let totalDamage = 0;
    for (let i = 0; i < 3; i++) {
        totalDamage += await runSingleQTE(800, 2); // 1 секунда и множитель от 1 до 2
    }
    
    return totalDamage;
}

function endGame(outcome) {
    switch (outcome) {
        case 'victory':
            console.log('Поздравляем! Вы успешно завершили путешествие!');
            break;
        case 'defeat':
            console.log('Вы потеряли все здоровье. Путешествие окончено.');
            break;
        case 'unexpected':
            console.log('Путешествие завершилось неожиданным образом!');
            break;
    }
    rl.close();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('Добро пожаловать в игру "Авария в шахте"!');
console.log('Нажимайте [ENTER] для прочтения диалогов.');
showLocation();
 