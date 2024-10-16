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
    pickaxePicked: false,
    glovesPicked: false,
    maskPicked: false,
    cartKicked: false,
    gatesButton: false,
    gatesElectricity: false,
    wallBroken: false,
    fireSpotted: false,
    cartPushed: false,
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
            { text: '[ # СОСТАВИТЬ ОТЧЕТ           ]', event: 'logTerminalReport'},
            { text: '[ # УПРАВЛЕНИЕ ЭЛЕКТРИЧЕСТВОМ ]', event: 'logTerminalElectricity'},
            { text: '[ # ПОЧТА                     ]', event: 'logTerminalMail'},
            { text: '[ # О СИСТЕМЕ                 ]', event: 'logTerminalAbout'},
            { text: '[ покинуть терминал           ]', event: 'pickupGloves'}
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
            'Ворота открываются. Вас встречает шум сирены, который был заглушен толстой дверью.',
            'Вместе с ней слышны суетливые звуки шагов. Вы аккуратно высовываете голову из-за стены и осматриваетесь.',
            'По центру пыльной мигающей комнаты стоит мужчина в непонятном костюме, маске и с автоматом.',
            'Вы не уверены, хотите ли иметь с ним дело, поэтому сразу заприметили план Б: темный тоннель прямо у ворот.'
        ],
        choices: [
            { text: '[ убежать в тоннель ]', event: 'battleCrawling' },
            { text: '[ подойти к стрелку ]', nextLocation: 'crossroadRescuer' }
        ]
    },
    crossroadRescuer: {
        name: 'Стрелок',
        description: [
            'Вы выходите навстречу мужчине и окликаете его.',
            'Стрелок резко направляет на вас оружие. Вы так же быстро поднимаете руки вверх.',
            'Вы осматриваете его бледный резиновый костюм, огромные черные перчатки и пугающий противогаз.',
            'Только вблизи вы распознали спасателя. Он уводит пушку к земле и активно подзывает вас рукой.',
            '(Спасатель): Нам нужно убираться отсюда, быстрее.',
            'Вы следуете за ним и вы добираетесь до лифта. Сквозь противогаз он продолжает бормотать:',
            '(Спасатель): На комбинате авария, утечка ядовитого газа. Не было контакта с пораженными?',
            '(Вы): С пораженными?..',
            '(Спасатель): Отлично. Когда поднимемся, я проведу тебя к врачам, они удостоверятся, что с тобой все в порядке.',
            '(Спасатель): А сейчас, надень это. Газ пагубно влияет на открытые участки кожи, еще неясно, насколько эта дрянь распространилась.'
        ],
        choices: [
            { text: '[ надеть экипировку ]', event: 'pickupMask' }
        ]
    },
    deadendExplosion: {
        name: 'Тупик',
        description: [
            'Дальнейшее короткое молчание прервал отдаленный глухой грохот.',
            '(Спасатель): Мы также выяснили что этот газ огнеопасен. Для шахты, конечно, неприятно.',
            '*взрыв*',
            'Вас выбрасывает из лифта в неизвестную пещеру. Где таинственный спасатель - непонятно.',
            'Будто бы никаких серьезных травм, хотя возможно это сработал адреналин.',
            'Вы оглядели эту пещеру: слева проход заваленный камнями, справа тоже проход, но заколоченный досками.',
            'На земле брошена кирка.'
        ],
        choices: [
            { text: '[ пройти к завалу ]', event: 'logBlockage' },
            { text: '[ подобрать кирку ]', event: 'pickupPickaxe' },
            { text: '[ сломать стену   ]', event: 'breakWall' }
        ]
    },
    smokeTunnel: {
        name: 'Задымленный проход',
        description: [
            'Тесный тоннель в таинственной полупрозрачной дымке.',
            'Похоже, это единственная дорога, что у вас есть.'
        ],
        choices: [
            { text: '[ пойти вперед       ]', event: 'endingSmoke' }, // КОНЦОВКА 2 или 4
            { text: '[ вернуться к тупику ]', nextLocation: 'deadendExplosion' },
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
            { text: '[ свернуть направо    ]', event: 'locationFriendCheckWater' },
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
            { text: '[ осмотреть ящик ]', event: 'pickupTNT' },
            { text: '[ бежать дальше  ]', event: 'locationRailForkFireSpotted' }
        ]
    },
    roomFriendUnconscious: {
        name: 'Комната с рабочим',
        description: [
            'Пройдя чуть дальше вагонетки, вы видите шахтера, лежащего у стены.',
            'Похоже он как и вы, до конца не понятно отчего, потерял сознание.',
        ],
        choices: [
            { text: '[ разбудить рабочего ]', nextLocation: 'friendUnconscious' },
            { text: '[ бежать дальше      ]', nextLocation: 'turning' }
        ]
    },
    friendUnconscious: {
        name: 'Рабочий без сознания',
        description: [
            'Вы трясете рабочего по плечу. Не реагирует.',
            'Вы не можете придумать, как вернуть его сознание'
        ],
        choices: [
            { text: '[ оставить рабочего ]', nextLocation: 'roomFriendUnconscious' }
        ]
    },
    cartBlockage: {
        name: 'Прегражденный краткий путь',
        description: [
            'Вы открываете минералку и брызгаете ею рабочему в лицо.',
            '(Рабочий): ф-в-у-э-э-в-м-м-м... б-боржоми... а-а?',
            'Он рассеянно открывает свои глаза.',
            '(Рабочий): а-э? Борька? Дружище, что происходит?',
            'Это имя немного проясняет вам память. Вы вспомнили как вас зовут.',
            '(Рабочий): Что рот разинул? Мне теперь тебя будить что-ли?',
            '(Вы): Мы знакомы?',
            '(Рабочий): Ну анекдот... Я Гоша, друг твой, давай рассказывай, как я в отключке оказался?',
            'По шахте эхом разнесся грохот. Вы в панике переглянулись.',
            '(Гоша): Во дела... Надо быстрее делать ноги.',
            'Вы помогли другу подняться. Он оглядел тоннель и быстро сообразил:',
            '(Гоша): Здесь буквально в 5 минутах ходьбы должен быть лифт, скорее пошли.',
            'Вы вышли на перекресток. Гоша подошел к проходу, загороженному вагонеткой. Он ругнулся.',
            '(Гоша): Чертовы вагонетки, вот чё им на месте не стоится а!? Прям перед лифтом, блин. Ну, поднажмем?'
        ],
        choices: [
            { text: '[ толкнуть вагонетку ]', event: 'pushCart' }
        ]
    },
    amalgamRoom: {
        name: 'Краткий путь',
        description: [
            'Полумрачный корридор. Дорожка рельс ведет вас к лифту.',
            '(Гоша): Что-ж случилось здесь все таки, не пойму. Помню как обычно с Марком кварциты копали, к нам и Михалыч подходил.',
            '(Гоша): А потом как ба-а-А-А-й-й-й-ёлки-палки...',
            'Вы оглянулись. Нога Гоши застряла в рельсах.',
            '(Гоша): Вляпался, блин. Ничего, сейчас все будет.. о, это же Михалыч. И-или Марк?',
            'Гоша ругнулся. Вы обернулись вновь. Это действительно были и Михалыч и Марк, только одним целым.',
            'Их как пластилиновых склеило в одно булькающее и хрипящее нечто.',
            'Они приближаются, чтобы и вас смешать в этот убогий коктейль. Вы беретесь за свое оружие.'
        ],
        choices: [
            { text: '[ начать битву ]', event: 'battleAmalgam' }
        ]
    },
    turning: {
        name: 'Странная развилка',
        description: [
            'Вы выходите в комнату с развилкой. Проход впереди завален камнями.',
            'Дорога налево свободна, однако оттуда доносятся странные шумы.'
        ],
        choices: [
            { text: '[ повернуть налево ]', nextLocation: 'something' },
            { text: '[ осмотреть завал  ]', nextLocation: 'turningBlockage' }
        ]
    },
    turningBlockage: {
        name: 'Завал на развилке',
        description: [
            'Вы осматриваете каменный завал. Он чересчур массивный, чтобы справиться с ним с помощью вашего инструмента.',
            'Тебе придется вернуться к развилке.'
        ],
        choices: [
            { text: '[ вернуться ]', nextLocation: 'turning' }
        ]
    },
    something: {
        name: 'Что-то',
        description: [
            'Разработчик не продумал локацию. Бездарь.'
        ],
        choices: [
            { text: '[ вернуться ]', nextLocation: 'turning' }
        ]
    }
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
            if ( eventVariables.blockageExploded === false) {
                locations.deadendExplosion.description = [
                    'Вы оглядели эту пещеру: слева проход заваленный камнями, справа тоже проход, но заколоченный досками.'
                ];
            } else {
                locations.deadendExplosion.description = [
                    'Вы оглядели эту пещеру: слева подорванный вами проход, справа тоже проход, но заколоченный досками.'
                ];
            }

            locations.deadendExplosion.choices = [
                { text: '[ пройти к завалу ]', event: 'logBlockage' },
                { text: '[ сломать стену   ]', event: 'breakWall' }
            ]
            eventVariables.pickaxePicked = true;
            break;
        case 'pickupJackhammer':
            if ( eventVariables.jackhammerPicked === false ) {
                console.log('Кто-то оставил в вагонетке отбойный молоток. Пожалуй, вам он будет нужнее.');
                console.log('* Отбойный молоток теперь в слоте [Оружие]');
                player.weapon = weapons.jackhammer;
                eventVariables.jackhammerPicked = true;
                if (eventVariables.fireSpotted === false) {
                    locations.railFork.description = [
                        'Вас встречает развилка. Впереди виднеется мелькающий свет.',
                        'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                        'На повороте остановилась вагонетка с серебристо-бурыми минералами.'
                    ];
                    locations.railFork.choices = [
                        { text: '[ пойти прямо         ]', nextLocation: 'deadendBurning' },
                        { text: '[ свернуть направо    ]', event: 'locationFriendCheckWater' },
                        { text: '[ осмотреть вагонетку ]', event: 'pickupJackhammer' }
                    ];
                } else {
                    locations.railFork.description = [
                        'Вас встречает развилка. К пожару вы явно больше не пойдете.',
                        'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                        'На повороте остановилась вагонетка с серебристо-бурыми минералами.'
                    ];
                    locations.railFork.choices = [
                        { text: '[ свернуть направо    ]', event: 'locationFriendCheckWater' },
                        { text: '[ осмотреть вагонетку ]', event: 'pickupJackhammer' }
                    ];
                }
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
            if (eventVariables.jackhammerPicked === false) {
                locations.railFork.description = [
                    'Вас встречает развилка. К пожару вы явно больше не пойдете.',
                    'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                    'На повороте остановилась вагонетка. Среди бурых минералов в ней виднеется что-то еще.'
                ];
            } else {
                locations.railFork.description = [
                    'Вас встречает развилка. К пожару вы явно больше не пойдете.',
                    'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                    'На повороте остановилась вагонетка с серебристо-бурыми минералами.'
                ];
            }
            locations.railFork.choices = [
                { text: '[ свернуть направо    ]', event: 'locationFriendCheckWater' },
                { text: '[ осмотреть вагонетку ]', event: 'pickupJackhammer' }
            ];
            locations.turningBlockage.description = [
                'Вы осматриваете каменный завал. Он чересчур массивный, чтобы справиться с ним с помощью вашего инструмента.',
                'Вы вспоминаете про связку динамита, который забрали из ящика.'
            ],
            locations.turningBlockage.choices = [
                { text: '[ заложить динамит ]', event: 'blockageExplosion'},
                { text: '[ вернуться        ]', nextLocation: 'turning' }
            ]
            player.location = 'railFork';
            eventVariables.fireSpotted = true;
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
            console.log('Спасатель протягивает балаклаву и респиратор. На теле не осталось ни одного открытого местечка.');
            console.log('* Респиратор был экипирован. Максимальное здоровье повышено');
            player.maxHealth += 30;
            player.health = player.maxHealth;
            eventVariables.maskPicked = true;
            player.location = 'deadendExplosion';
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
        case 'locationRailForkFireSpotted':
            console.log('Вы заглушаете свое любопытство, жизнь дороже. ')
            if (eventVariables.jackhammerPicked === false) {
                locations.railFork.description = [
                    'Вас встречает развилка. К пожару вы явно больше не пойдете.',
                    'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                    'На повороте остановилась вагонетка. Среди бурых минералов в ней виднеется что-то еще.'
                ];
            } else {
                locations.railFork.description = [
                    'Вас встречает развилка. К пожару вы явно больше не пойдете.',
                    'Направо сворачивают рельсы, там горят на удивление рабочие лампы.',
                    'На повороте остановилась вагонетка с серебристо-бурыми минералами.'
                ];
            }
            eventVariables.fireSpotted = true;
            player.location = 'railFork';
            break;
        case 'locationFriendCheckWater':
            if (player.inventory.includes(items.water)) {
                locations.friendUnconscious.description = [
                    'Вы трясете рабочего по плечу. Не реагирует.',
                    'Пульс есть, вроде живой. Надо придумать, чем его разбудить.',
                    'Вы вспоминаете про бутылку минеральной воды.'
                ];
                locations.friendUnconscious.choices = [
                    { text: '[ брызнуть водой    ]', event: 'wakeFriend' },
                    { text: '[ оставить рабочего ]', nextLocation: 'roomFriendUnconscious' }
                ];
            }
            player.location = 'roomFriendUnconscious';
            break;
        case 'wakeFriend':
            player.inventory = player.inventory.filter(obj => obj !== items.water);
            player.location = 'cartBlockage';
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
        case 'pushCart':
            let perfectPushes = 0;
            while (perfectPushes < 3) {
                await askQuestion('Нажмите [ENTER] для того чтобы толкнуть вагонетку');
                let damageDealt = await quickTimeEvent();
                console.log('\nВдвоем вы толкаете вагонетку.');
                if (damageDealt === 60 || damageDealt === 30) {
                    perfectPushes++;
                    console.log('Она значительно двинулась дальше.');
                    console.log('(Гоша): Вот та-а-ак, давай ещё так же!');
                } else {
                    console.log('Она неряшливо качнулась.');
                    console.log('(Гоша): Боря-я-я, давай соберись, еще раз!');
                }
            }
            console.log('Вагонетка перевернулась и освободила тоннель.');
            console.log('Ай молодца, Борька, идем дальше.');
            eventVariables.cartKicked = true;
            player.location = 'amalgamRoom';
            break;
        case 'breakWall':
            if ( player.weapon === weapons.shovel ) {
                console.log('Вы считаете, что лопата не справится с уничтожением преграды.')
                locations.deadendExplosion.description = [
                    'Вы оглядели эту пещеру: слева проход заваленный камнями, справа тоже проход, но заколоченный досками.',
                    'На земле брошена кирка.'
                ]
                break;
            } else {
                let wallHealth = 200;
                while (eventVariables.wallBroken === false) {
                    await askQuestion('Нажмите [ENTER] для нанесения атаки');
                    let damageDealt = await quickTimeEvent();
                    wallHealth -= damageDealt;
                    console.log('\nВы наносите удар по заколоченным доскам.');
                    if (wallHealth > 0) {
                        console.log(`Вы разбили ${~~(damageDealt/2)}% досок, осталось еще ${~~(wallHealth/2)}%.`);
                    } else {
                        console.log('Преграда полностью разбита, можно идти');
                        eventVariables.wallBroken = true;
                        if ( eventVariables.blockageExploded === false) {
                            locations.deadendExplosion.description = [
                                'Вы оглядели эту пещеру: слева проход заваленный камнями, справа тоже проход, доски разбиты вдребезги.'
                            ];
                            locations.deadendExplosion.choices = [
                                { text: '[ пройти к завалу             ]', event: 'logBlockage' },
                                { text: '[ пойти в задымленный тоннель ]', event: 'breakWall' }
                            ];
                        } else {
                            locations.deadendExplosion.description = [
                                'Вы оглядели эту пещеру: слева подорванный вами проход, справа тоже проход, доски разбиты вдребезги.'
                            ];
                            locations.deadendExplosion.choices = [
                                { text: '[ пройти к подорованному проходу ]', event: 'logBlockage' },
                                { text: '[ пойти в задымленный тоннель    ]', event: 'breakWall' }
                            ];
                        }
                    }
                }
                player.location = 'smokeTunnel';
                break;
            }
            case 'blockageExplosion':
                if (eventVariables.blockageExploded === false) {
                    if (player.inventory.includes(items.tnt)) {
                        console.log('Вы закладываете динамит между грудой булыжников и отбегаете.')
                        console.log('*взрыв и шум ударяющихся об пол камней*')
                        console.log('Завал был убран, путь вперед освободился.')
                        locations.turning.description = [
                            'Комната с развилкой. Проход спереди пахнет недавно подорванным порохом.',
                            'Дорога налево свободна, однако оттуда доносятся странные шумы.'
                        ];
                        locations.turning.choices = [
                            { text: '[ повернуть налево ]', nextLocation: 'something' },
                            { text: '[ пройти вперед ]', nextLocation: 'deadendExplosion' }
                        ];
                        locations.deadendExplosion.description = [
                            'Вы оглядели эту пещеру: слева подорванный вами проход, справа тоже проход, но заколоченный досками.',
                            'На земле брошена кирка.'
                        ]
                        player.inventory = player.inventory.filter(obj => obj !== items.tnt);
                        eventVariables.blockageExploded = true;
                        player.location = 'turning';
                    } else {
                        console.log('У вас нет предмета для подрыва завала.');
                    }
                    break;
                } else {
                    player.location = 'deadendExplosion';
                    break;
                }

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
                player.location = 'turning';
            } else {
                console.log('\nПроход завален, движение невозможно.')
                if ( eventVariables.pickaxePicked === false ) {
                    locations.deadendExplosion.description = [
                        'Вы оглядели эту пещеру: слева проход заваленный камнями, справа тоже проход, но заколоченный досками.',
                        'На земле брошена кирка.'
                    ]
                }
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


        case 'endingFriend': // КОНЦОВКА #1
            let descriptionEnding1 = [
                '(Гоша): Марка жалко...',
                'С вашей помощью Гоша освобождает ногу из заключения рельс.',
                'Вы вместе проходите в лифт и поднимаетесь наверх.',
                'За несколько минут вы успеваете обменяться несколькими шутками и историями из жизни.',
                'Диалог сопровождался отдаленными выстрелами и странными глухими визгами.',
                'Вы начинаете ощущать прохладный воздух и потихоньку замечаете свет, исходящий уже не из ослепляющих ламп.',
                'Вы с Гошей вышли из шахты. У предприятия творится суматоха.',
                'Первый заметивший вас милиционнер отводит вас к машинам скорой помощи.',
                'В завтрашней газете явно будет о чем почитать.'
            ];
            for (const line of descriptionEnding1) {
                await askQuestion(line);
            }
            endGame('ending1');
            return;
        case 'endingSmoke':
            if (eventVariables.maskPicked === true) {
                handleEvent('endingRescued');
            } else {
                handleEvent('endingMolten');
            }
        case 'endingRescued': // КОНЦОВКА #2
            let descriptionEnding2 = [
                '\nПолагаясь на средства защиты, вы начинаете бежать через ядовитый туман.',
                'Вы будто ощущаете тяжесть этой витающей субстанции, что довольно волнующе. Все ближе виден выход.',
                'Едкий дым пройден, вы попадаете в довольно просторную комнату, освещенную лампами.',
                'Вы пробежались взглядом по уродливым каменным стенам, трубам, рельсам и..',
                'Вы встречаете другого шахтера, который похоже так же, как вы, растерянно блуждает по пещерам. Вы его окликаете.',
                'На несколько секунд он замер. Вы хотели было позвать его снова, но он уже повернулся к вам лицом.',
                'Хотя точнее сказать тем, что от него осталось. Щеки и подбородок огромными каплями свисали вниз, \nна месте глаз были глубокие ямы. Это нечто плавилось живьем.',
                'Неуклюже обнажив свои зубы, оно стало двигаться в вашу сторону, пока ваши дрожащие руки брались за оружие.',
                '*ТР-Р-Р-Р*',
                'Очередь из хлопков, страшным эхом раздавшихся по шахте, оглушила вас. "Растаявший" шлепнулся на землю.',
                'Из-за угла выбежал пожарный... с пистолетом-пулеметом. Он живо направил его на вас.',
                'Вы так же шустро подняли руки вверх. Дежавю. Осмотрев с ног до головы, пожарный взял вас за шиворот, и начал вести.',
                '(Пожарный): Давай, давай, реще!',
                'Мимо пробежали еще несколько таких же вооруженных спасателей. До выхода добрались в полной тишине.',
                'К предприятию приехали машины всех сортов: пожарные, милиция, скорая. Вас отвели к таким же пострадавшим рабочим.',
                'Врач начал осматривать вас, в то время как вы осматривали туда-сюда носящихся спасателей и рабочих. В глазах потемнело.'
            ];
            for (const line of descriptionEnding2) {
                await askQuestion(line);
            }
            endGame('ending2');
            return;
        case 'endingMolten': // КОНЦОВКА #4
            let descriptionEnding4 = [
                '\nВы идете на свет. В глазах все плывет.',
                'Жара становится невыносимой, вам кажется, будто мозг вот-вот расплавится',
                'Вообще-то, так и есть. Ваша кожа начинает таять на глазах',
                'Вы не успеваете испугаться, как разум тоже угасет.',
                'Вас больше нет, осталась бесформенная масса, которая все равно продолжит идти на свет\nпо своим примитивным инстинктам. Ваш же путь подошел к концу.'
            ];
            for (const line of descriptionEnding4) {
                await askQuestion(line);
            }
            endGame('ending4');
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
                case enemies.amalgam:
                    console.log('Склеенный падает на землю, все так же неистово хрипя. Он медленно затихает');
                    handleEvent('endingFriend')
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
    console.log('\n===========================')
    switch (outcome) {
        case 'ending1':
            console.log('Поздравляем! Вы успешно выбрались на поверхность и спасли коллегу!');
            break;
        case 'ending2':
            console.log('Поздравляем! Вы успешно выбрались на поверхность!.. хоть и не совсем целым.');
            break;
        case 'ending3':
            console.log('Этой концовки нет...');
            break;
        case 'ending4':
            console.log('Вам не удалось покинуть шахту.');
            break;
        case 'defeat':
            console.log('Вы потеряли все здоровье. Путешествие окончено.');
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
 