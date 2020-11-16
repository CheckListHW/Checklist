axios.get('/api/exestage/?ExeExperiment='+JSON.parse(document.getElementById('ExeExperiment').textContent)).then( function (exestage) {
axios.get('/api/exeparagraph/?ExeStage=' + JSON.parse(document.getElementById('ExeStage').textContent)).then(function (exeparagraph) {
axios.get('/api/exeparameters/?ExeStage=' + JSON.parse(document.getElementById('ExeStage').textContent)).then(function (exeparameters) {
axios.get('/api/execalcparameters/?ExeStage=' + JSON.parse(document.getElementById('ExeStage').textContent)).then(function (execalcparameters) {
    var asyncToF = 0;
    Stages = jsonGetParam(exestage.data, exeparagraph.data);
    let otherthings = new Array(Stages.length),
        criterions = new Array(Stages.length);
    Stages.forEach(function (stage, i) {
        axios.get('/api/exesubstage/?ExeStage=' + Stages[i].id).then(function (exesubstages) {
        axios.get('/api/exeequipment/?ExeStage=' + Stages[i].id).then(function (exeequipments) {
        axios.get('/api/exedishes/?ExeStage=' + Stages[i].id).then(function (exedishes) {
        axios.get('/api/exereagents/?ExeStage=' + Stages[i].id).then(function (exereagents) {
        axios.get('/api/exeprotectiveequipments/?ExeStage=' + Stages[i].id).then(function (exeprotectiveequipments) {
        axios.get('/api/exedocs/?ExeStage=' + Stages[i].id).then(function (exedocs) {
        axios.get('/api/execriterion/?ExeStage=' + Stages[i].id).then(function (execriterion) {

            execriterion.data.forEach(function (criterion) {
                criterions.push(criterion)
            })

            let otherthing = {
                name: Stages[i].Name,
                stage: Stages[i].id,
                CheckStuff: Stages[i].CheckStuff,
                exesubstages: exesubstages.data,
                exeequipments: exeequipments.data,
                exedishes: exedishes.data,
                exereagents: exereagents.data,

                exeprotectiveequipments: exeprotectiveequipments.data,
                exedocs: exedocs.data,
            };
            otherthings[i] = otherthing;
            asyncToF++;
            if (asyncToF == Stages.length)

    new Vue({
            el: '#etaps',
            data: {
                MainStageid: JSON.parse(document.getElementById('ExeStage').textContent),
                etap_name: "Обезвоживание проб нефти", //Взять с прошлой страницы
                next1: [],
                ready: {
                    main: false,
                    test: true,
                },
                puncts: ["Хлористый кальций должен быть подготовлен по методике III.", "Вся стеклянная посуда, используемая в этапе, должна быть подготовлена по п. II.", "Сульфат натрия должен быть подготовлен по методике IV.", "Убедиться в наличии перегнанного хлороформа объемом 0,2 л (для ополаскивания)"], //Взято с БД
                methods: ["Методика II.", "III. Прокаливание хлористого кальция", "Методика IV.", "?"],//Взято с БД

                //Все массивы ниже взяты с БД. Кол-во внутренних массивов равно количеству пунктов в puncts
                equipments: [
                    ["Сушильный шкаф (диапазон температур от + 30 °С до +350 °С)", "Муфельная печь (диапазон температур от + 50 до 1100 °С)"],
                    ["Сушильный шкаф (диапазон температур от + 30 °С до +350 °С)", "Муфельная печь (диапазон температур от + 50 до 1100 °С)"],
                    [],
                    [],
                ],
                dishes: [
                    ["Чаша выпарительная – 450 мл., 2 шт. ГОСТ 9147-80", "Ложка фарфоровая. 120 мм., 1 шт.ГОСТ 9147-80", "Тигельные щипцы. 210 мм.", "Лабораторное сито (размер ячеек 0,5 мм) ГОСТ Р 51568-99", "Плоскодонная колба с притёртой крышкой объемом 500 мл (шлиф 29/32) ГОСТ 25336-82", "Стеклянная воронка (В-100-150 ГОСТ 25336-82)"],
                    [],
                    [],
                    [],
                ],
                reagents: [
                    ["Хлористый кальций (чистый, ТУ 6-09-4711-81), 422 г."],
                    [],
                    [],
                    [],
                ],
                documents: [
                    [],
                    [],
                    [],
                    [],
                ],
                sizs: [
                    ["Перчатки латексные неопудренные", "Халат лабораторный", "Перчатки Х/Б из плотной ткани", "Чистая Х/Б ткань (Ткань вафельная отбел. 45 см)", "Респиратор"],
                    [],
                    [],
                    [],
                ],

                //Все массивы ниже генерируются при загрузке #etaps
                equipments_check: [],
                dishes_check: [],
                reagents_check: [],
                documents_check: [],
                sizs_check: [],

                extra_etaps_check: [],
                extra_etaps_visible: [],
                extra_etaps_mini_check_visible: [],
                active_mini_check_extra_etap: -1,

                extra_etaps_message_visible: [],

                mini_checks: [
                    ["Дата перегонки растворителя не больше 14 дней", "Нет видимых загрязнений"],
                    [],
                    [],
                    [],
                ],//Взято с БД
                mini_check_choosen: [],

                active_form: [],

                podetaps: [
                    ["Включить муфельную печь и установить температуру 150 °С.",
                        "Хлористый кальций просеять через сито. Мелкую фракцию отбросить (фракция меньше 0,5 мм).",
                        "Просеянный хлорид кальция высыпать в 2 чаши по 211 г в каждую ровным слоем. Максимальная толщина слоя - не более 4 см.",
                        "III.5Выпарительные чаши, заполненные хлоридом кальция, поместить в муфельную печь при температуре 150 °С.",
                        "Кальций хлористый перемешивать фарфоровой ложкой каждые 10 минут в течение 30 минут.",
                        "Спустя 30 минут после начала прокаливания на блоке управления муфельной печью задать температуру 300 °С. Прокаливание длится 5 часов.",
                        "Выключить муфельную печьчерез 5 часов. Оставить реактив в печи на 15 минут для остывания.",
                        "Плоскодонную колбу, притёртую крышку и воронку поместить в сушильный шкаф при температуре 105 °С. Посуду выдерживать при данной температуре в шкафу до момента пересыпания хлорида кальция.",
                        "Пересыпать прокаленный хлорид кальция в плоскодонную колбу",
                        "Надеть Х/Б перчатки поверх латексных",
                        "Открыть муфельную печь;",
                        "Зажать чашу щипцами;",
                        "Быстро пересыпать реактив в горячую плоскодонную колбу через воронку;",
                        "Закрыть притертой крышкой.",
                        "Заполнить этикетку",
                        "Поместить реактив на хранение в сухое место.",
                        "Убрать рабочее место по завершении работы",
                        "Снять СИЗ"],
                    [],
                    [],
                    [],
                ],  //Взято с БД

                podetaps_check: [],
                disabled: [],
                plays: [],

                first_play_push: [],
                first_picture_push: [],

                parametrs_visible: [],

                fact_parametrs: [],

                are_there_parametrs: [
                    [true, false, false, true, false, true, false, true, false, false, false, false, false, false, false, false, false, false],
                    [],
                    [],
                    [],
                ],//Если true значит для подэтапа есть набор парметров

                plan_parametrs: [
                    [
                        [
                            {
                                name: "Температура",
                                value: "150",
                            },
                        ],
                        [],
                        [],
                        [
                            {
                                name: "Температура",
                                value: "150",
                            },
                        ],
                        [],
                        [
                            {
                                name: "Температура",
                                value: "300",
                            },
                        ],
                        [],
                        [
                            {
                                name: "Температура",
                                value: "105",
                            },
                        ],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                        [],
                    ],
                    [],
                    [],
                    [],
                ],//Взято с БД

                information:
                    [
                        [
                            {
                                risks: "При попытке прокалить слишком обводнённый реактив при высокой температуре происходит быстрое необратимое спекание гранул в одну твёрдую массу, при этом реактив теряет присущие ему физические свойства и не подлежит использованию.",
                                dangerous: "",
                            },
                            {
                                risks: "Пылевая фракция хлорида кальция,попадая в осушаемую жидкость, остаётся во взвешенном состоянии, а также прилипает к стенкам ёмкостей вместе с адсорбированными каплями воды. Соответственно, не получается качественно отделить воду от осушаемых жидкостей (для осушаемых газов проблема не актуальна).",
                                dangerous: "",
                            },
                            {
                                risks: "Большее количество реактива в чашке (толщина слоя больше 4 см) затруднит его перемешивание и снизит качество прокаливания.",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "Без перемешивания чаще всего происходит частичное спекание гранул. Реактив может стать не пригоден для дальнейшего использования.",
                                dangerous: "Необходимо использовать Х/Б перчатки, надетые поверх латексных, при открывании, закрывании муфельной печи, а также при непосредственном перемешивании хлорида кальция во избежание ожогов.",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "операция по пересыпанию необходимо выполнить как можно более энергично, снизив к минимуму соприкосновение прокаленного реактива с воздухом, может произойти обводнение реактива при его остывании и длительном нахождении на воздухе.",
                                dangerous: "Необходимо использовать Х/Б перчатки, надетые поверх латексных.Не пытаться пересыпать реактив, удерживая чашу одной рукой. Использование СИЗ (резиновые перчатки, рукавицы, х/б ткань) крайне необходимо, возможно получить ожог. Необходимо использовать респиратор, т.к. пыль безводного хлорида кальция при систематическом воздействии оказывает раздражающее воздействие на слизистые оболочки верхних дыхательных путей и глаз (ГОСТ 450-77).",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                            {
                                risks: "",
                                dangerous: "",
                            },
                        ],
                        [],
                        [],
                        [],
                    ],//Взято с БД

                active_podetap: [], //Должен скидываться на -1 при выходе

                timers: [],
                current_times: [],
                podetaps_time: [
                    [3, 8, 7, 5, 30, 300, 15, 4, 3, 3, 3, 3, 3, 5, 5, 5, 5, 2],
                    [],
                    [],
                    [],
                ],//Взято с БД в секундах
            },
            methods: {
                changeStuff: function (stuff, number, index) {
                    stuff[number][index] = !stuff[number][index]
                    var false_indexes = [];
                    if (this.equipments_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.dishes_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.reagents_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.documents_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.sizs_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (false_indexes.length == 5 && false_indexes.indexOf(false) == -1) {
                        Vue.set(this.next1, number, true)
                    } else {
                        Vue.set(this.next1, number, false)
                    }
                },

                change_visible: function (index) {
                    if (localStorage.getItem("active_extra_etap") != index) {
                        localStorage.clear();
                    }

                    Vue.set(this.extra_etaps_visible, index, true);
                    localStorage.setItem("active_extra_etap", index);
                },

                change_mini_visible: function (index) {
                    Vue.set(this.extra_etaps_mini_check_visible, index, true);
                    this.active_mini_check_extra_etap = index;
                },

                close_mini_check: function (index) {
                    Vue.set(this.extra_etaps_mini_check_visible, index, false);
                    this.active_mini_check_extra_etap = -1;
                },

                mini_check_ok: function (index) {
                    if (this.mini_check_choosen[this.active_mini_check_extra_etap].indexOf("0") == -1) {
                        Vue.set(this.extra_etaps_mini_check_visible, index, false);
                        Vue.set(this.extra_etaps_check, index, true);
                        axios.post('/lab/preparatory/crud/', {
                            finish: "Stage",
                            PrepareStage: this.MainStageid,
                            id: otherthings[index].stage,
                        })
                    } else {
                        Vue.set(this.extra_etaps_mini_check_visible, index, false);
                        Vue.set(this.extra_etaps_message_visible, index, true);
                    }
                    this.active_mini_check_extra_etap = -1;
                },

                message_close: function (index) {
                    Vue.set(this.extra_etaps_message_visible, index, false);
                    this.change_visible(index);
                },

                is_null: function (array) {
                    if (array.length == 0) {
                        return true;
                    }
                },

                move: function (value) {
                    localStorage.clear();
                    Vue.set(this.active_form, this.active_extra_etap, this.active_form[this.active_extra_etap] + value);
                    axios.post('/lab/preparatory/crud/', {
                        finish: "CheckStuff",
                        Stage: otherthings[this.active_extra_etap].stage,
                    })
                },

                sleep: function (ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                },

                change_params_visible: async function (number, index) {
                    var true_index = this.parametrs_visible[number].indexOf(true);

                    if (true_index == index || true_index == -1) {
                        Vue.set(this.parametrs_visible[number], index, !this.parametrs_visible[number][index]);
                    } else {
                        Vue.set(this.parametrs_visible[number], true_index, !this.parametrs_visible[number][true_index]);
                        await this.sleep(700);
                        Vue.set(this.parametrs_visible[number], index, !this.parametrs_visible[number][index]);
                    }
                },

                check_load: function (number, index) {
                    Vue.set(this.first_picture_push[number], index, false);
                },

                startTimer: function (number, index) {
                    this.timers[number][index] = setInterval(() => {
                        Vue.set(this.current_times[number], index, this.current_times[number][index] + 1);
                    }, 1000)
                },

                stopTimer: function (number, index) {
                    clearTimeout(this.timers[number][index])
                },

                start: function (number, index) {
                    Vue.set(this.plays[number], index, !this.plays[number][index]);
                    Vue.set(this.first_play_push[number], index, false);

                    this.startTimer(number, index);
                },

                stop: function (number, index) {
                    Vue.set(this.plays[number], index, !this.plays[number][index]);

                    this.stopTimer(number, index);
                },

                check_pressed: async function (number, index, oldornew) {


                    if (oldornew == 1)
                        axios.post('/lab/preparatory/crud/', {
                            finish: "SubStage",
                            id: otherthings[number].exesubstages[index + 1].id,
                            PrepareStage: this.MainStageid,
                            params: this.fact_parametrs,
                            planparams: this.plan_parametrs,
                            time1: this.current_times,
                            time2: this.podetaps_time,
                        })
                    this.stopTimer(number, index);
                    Vue.set(this.plays[number], index, false);
                    Vue.set(this.disabled[number], index + 1, false);

                    Vue.set(this.parametrs_visible[number], index, false);
                    await this.sleep(700);
                    Vue.set(this.parametrs_visible[number], index + 1, true);

                    Vue.set(this.podetaps_check[number], index, true);
                    Vue.set(this.active_podetap, number, this.active_podetap[number] + 1);
                },

                finish_extra_etap: function (number) {
                    Vue.set(this.extra_etaps_visible, number, false);
                    Vue.set(this.extra_etaps_mini_check_visible, number, true);
                    this.active_mini_check_extra_etap = number;
                    axios.post('/lab/preparatory/crud/', {
                        finish: "Stage",
                        PrepareStage: this.MainStageid,
                        id: otherthings[number].stage,
                    })
                },

                cancel: function (number) {
                    Vue.set(this.extra_etaps_visible, number, false);
                    localStorage.clear();
                },

                inf: function (value) {
                    if (value == "") {
                        return "Отсутствует";
                    } else {
                        return value;
                    }
                },

                finish: function () {
                    axios.post('/lab/preparatory/crud/', {
                        finish: "All",
                        PrepareStage: this.MainStageid,
                    })
                    window.location.href = '/lab/check/?ExeStage=' + this.MainStageid;
                },

                Stuffs: function () {
                    window.location.href = '/lab/stuffs/?ExeStage=' + this.MainStageid;
                },


            },
            computed: {
                control_check: function () {
                    if (this.extra_etaps_check.indexOf(false) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                },

                control_mini_check: function () {
                    if (this.mini_check_choosen[this.active_mini_check_extra_etap].indexOf(-1) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                },

                control_check_podetaps: function () {
                    console.log(this.podetaps_check[this.active_extra_etap])
                    if (this.podetaps_check[this.active_extra_etap].indexOf(false) == -1) {
                        console.log(true)
                        return true;
                    } else {
                        console.log(false)
                        return false;
                    }
                },

                parametrs_check: function () {
                    if (this.fact_parametrs[this.active_extra_etap][this.active_podetap[this.active_extra_etap]].indexOf("") == -1) {
                        return false;
                    } else {
                        return true;
                    }
                },

                active_extra_etap: function () {
                    return this.extra_etaps_visible.indexOf(true);
                },

                control_check_inner: function () {
                    var false_indexes = [];

                    if (this.equipments_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.dishes_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.reagents_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.documents_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }
                    if (this.sizs_check[this.active_extra_etap].indexOf(false) == -1) {
                        false_indexes.push(true)
                    }

                    if (false_indexes.length == 5 && false_indexes.indexOf(false) == -1) {
                        return true;
                    } else {
                        return false;
                    }
                },
            },
            watch: {
                equipments_check(new_equipments_check) {
                    var index = localStorage.getItem("active_extra_etap");
                    localStorage.setItem("equipments_check", JSON.stringify(new_equipments_check[index]));
                },
                dishes_check(new_dishes_check) {
                    var index = localStorage.getItem("active_extra_etap");
                    localStorage.setItem("dishes_check", JSON.stringify(new_dishes_check[index]));
                },
                reagents_check(new_reagents_check) {
                    var index = localStorage.getItem("active_extra_etap");
                    localStorage.setItem("reagents_check", JSON.stringify(new_reagents_check[index]));
                },
                documents_check(new_documents_check) {
                    var index = localStorage.getItem("active_extra_etap");
                    localStorage.setItem("documents_check", JSON.stringify(new_documents_check[index]));
                },
                sizs_check(new_sizs_check) {
                    var index = localStorage.getItem("active_extra_etap");
                    localStorage.setItem("sizs_check", JSON.stringify(new_sizs_check[index]));
                },
            },
            created: function () {
                const vm = this;
                vm.puncts = [];
                vm.podetaps = [];
                vm.information = [];
                vm.podetaps_time = [];
                vm.plan_parametrs = [];
                vm.are_there_parametrs = [];
                vm.mini_checks = [];

                vm.equipments = [];
                vm.equipments_check = [];

                vm.dishes = [];
                vm.dishes_check = [];

                vm.reagents = [];
                vm.reagents_check = [];

                vm.sizs = [];
                vm.sizs_check = [];

                vm.documents = [];
                vm.documents_check = [];

                Stages.forEach(function (stage, i) {
                    vm.podetaps_check.push([])
                    vm.next1.push([])
                    vm.podetaps.push([]);
                    vm.information.push([]);
                    vm.podetaps_time.push([]);
                    vm.plan_parametrs.push([]);
                    vm.are_there_parametrs.push([]);
                    vm.mini_checks.push(getCriterion(stage, criterions));

                    vm.equipments.push([]);
                    vm.equipments_check.push([]);

                    vm.dishes.push([]);
                    vm.dishes_check.push([]);

                    vm.reagents.push([]);
                    vm.reagents_check.push([]);

                    vm.sizs.push([]);
                    vm.sizs_check.push([]);

                    vm.documents.push([]);
                    vm.documents_check.push([]);
                    vm.extra_etaps_check.push([]);
                })


                for (var i = 0; i < Stages.length; i++) {
                    vm.extra_etaps_check[i] = Stages[i].Check
                    vm.puncts.push(otherthings[i].name);
                    let oldOtherThings = [otherthings[i].exeequipments,
                        otherthings[i].exedishes,
                        otherthings[i].exereagents,
                        otherthings[i].exeprotectiveequipments,
                        otherthings[i].exedocs,];


                    let stuffs = [[], [], [], [], []]
                    let checksSub = [[], [], [], [], [],];

                    let check = false
                    if (otherthings[i].CheckStuff == true)
                        check = true
                    Vue.set(vm.next1, i, check)
                    oldOtherThings.forEach(function (items, i1) {
                        items.forEach(function (item) {
                            stuffs[i1].push(item.Name)
                            checksSub[i1].push(check);
                        })
                    });

                    vm.equipments[i] = stuffs[0];
                    vm.equipments_check[i] = checksSub[0];

                    vm.dishes[i] = stuffs[1];
                    vm.dishes_check[i] = checksSub[1]

                    vm.reagents[i] = stuffs[2];
                    vm.reagents_check[i] = checksSub[2]

                    vm.sizs[i] = stuffs[3];
                    vm.sizs_check[i] = checksSub[3]

                    vm.documents[i] = stuffs[4];
                    vm.documents_check[i] = checksSub[4]

                    let substages = [];
                    let informations = [];
                    let podetap_time = [];
                    let are_there_parametr = [];
                    let plan_parametrStage = [];
                    otherthings[i].exesubstages.forEach(function (exesubstage) {
                        if (otherthings[i].stage == exesubstage.ExeStage & exesubstage.Number != 0) {
                            vm.podetaps_check[i].push(exesubstage.Check)
                            substages.push(exesubstage.Name)
                            informations.push({
                                risks: "" + exesubstage.Risks,
                                dangerous: "" + exesubstage.Attention,
                                id: "" + exesubstage.id,
                            })
                            newparam = GetParam(exeparameters.data, exesubstage.id);
                            if (newparam.length > 0)
                                are_there_parametr.push(true)
                            else
                                are_there_parametr.push(false)
                            plan_parametrStage.push(newparam)
                            podetap_time.push({
                                time: exesubstage.Duration*60,
                                id: exesubstage.id,
                            })
                        }
                    })
                    vm.are_there_parametrs[i] = are_there_parametr;
                    vm.podetaps_time[i] = podetap_time;
                    vm.information[i] = informations;
                    vm.podetaps[i] = substages;
                    vm.plan_parametrs[i] = plan_parametrStage;


                }
                for (i = 0; i < this.puncts.length; i++) {
                    //this.extra_etaps_check.push(false);
                    this.extra_etaps_visible.push(false);
                    this.extra_etaps_mini_check_visible.push(false);
                    this.extra_etaps_message_visible.push(false);
                    this.active_form.push(1);

                    this.mini_check_choosen.push([]);
                    for (var j = 0; j < this.mini_checks[i].length; j++) {
                        this.mini_check_choosen[i].push(-1);
                    }
                }

                /*for(i = 0; i < this.puncts.length; i++) {
                    var array = [];
                    for(j = 0; j < this.equipments[i].length; j++) {
                        array.push(false);
                    }
                    this.equipments_check.push(array);
                }
                for(i = 0; i < this.puncts.length; i++) {
                    var array = [];
                    for(j = 0; j < this.dishes[i].length; j++) {
                        array.push(false);
                    }
                    this.dishes_check.push(array);
                }
                for(i = 0; i < this.puncts.length; i++) {
                    var array = [];
                    for(j = 0; j < this.reagents[i].length; j++) {
                        array.push(false);
                    }
                    this.reagents_check.push(array);
                }
                for(i = 0; i < this.puncts.length; i++) {
                    var array = [];
                    for(j = 0; j < this.documents[i].length; j++) {
                        array.push(false);
                    }
                    this.documents_check.push(array);
                }
                for(i = 0; i < this.puncts.length; i++) {
                    var array = [];
                    for(j = 0; j < this.sizs[i].length; j++) {
                        array.push(false);
                    }
                    this.sizs_check.push(array);
                }*/

                /*if(localStorage.getItem("active_extra_etap")) {
                    var index = localStorage.getItem("active_extra_etap");
                    if(localStorage.getItem("equipments_check") !== 'undefined' && localStorage.getItem("dishes_check") !== null) {
                        Vue.set(this.equipments_check, index, JSON.parse(localStorage.getItem("equipments_check")));
                    }
                    if(localStorage.getItem("dishes_check") !== 'undefined' && localStorage.getItem("dishes_check") !== null) {
                        Vue.set(this.dishes_check, index, JSON.parse(localStorage.getItem("dishes_check")));
                    }
                    if(localStorage.getItem("reagents_check") !== 'undefined' && localStorage.getItem("reagents_check") !== null) {
                        Vue.set(this.reagents_check, index, JSON.parse(localStorage.getItem("reagents_check")));
                    }
                    if(localStorage.getItem("documents_check") !== 'undefined' && localStorage.getItem("documents_check") !== null) {
                        Vue.set(this.documents_check, index, JSON.parse(localStorage.getItem("documents_check")));
                    }
                    if(localStorage.getItem("sizs_check") !== 'undefined' && localStorage.getItem("sizs_check") !== null) {
                        Vue.set(this.sizs_check, index, JSON.parse(localStorage.getItem("sizs_check")));
                    }
                }*/

                //Для второго слайда
                for (i = 0; i < this.puncts.length; i++) {
                    var len = this.podetaps[i].length;

                    var podetaps_check_array = [];
                    var disabled_array = [];
                    var plays_array = [];
                    var first_play_push_array = [];
                    var first_picture_push_array = [];
                    var parametrs_visible_array = [];
                    var fact_parametrs_array = [];
                    var timers_array = [];
                    var current_times_array = [];


                    for (j = 0; j < len; j++) {
                        podetaps_check_array.push(false);

                        if (j == 0) {
                            disabled_array.push(false);
                        } else {
                            disabled_array.push(true);
                        }

                        plays_array.push(false);
                        first_play_push_array.push(true);
                        first_picture_push_array.push(true);

                        if (j == 0) {
                            parametrs_visible_array.push(true);
                        } else {
                            parametrs_visible_array.push(false);
                        }

                        if (this.are_there_parametrs[i][j]) {
                            var array = [];

                            for (k = 0; k < this.plan_parametrs[i][j].length; k++) {
                                array.push("");
                            }

                            fact_parametrs_array.push(array);
                        } else {
                            fact_parametrs_array.push([]);
                        }

                        timers_array.push(null);
                        current_times_array.push(0);
                    }

                    this.active_podetap.push(0);
                    this.podetaps_check.push(podetaps_check_array);
                    this.disabled.push(disabled_array);
                    this.plays.push(plays_array);
                    this.first_play_push.push(first_play_push_array);
                    this.first_picture_push.push(first_picture_push_array);
                    this.parametrs_visible.push(parametrs_visible_array);
                    this.fact_parametrs.push(fact_parametrs_array);
                    this.timers.push(timers_array);
                    this.current_times.push(current_times_array);
                }
                for (var i = 0; i < Stages.length; i++) {
                    otherthings[i].exesubstages.forEach(function (exesubstage, i1) {
                        if (otherthings[i].stage == exesubstage.ExeStage & exesubstage.Number != 0) {
                            if (exesubstage.Check) {
                                vm.check_pressed(i, i1 - 1, 0)
                            }
                        }
                    })
                }
                console.log('podetaps_check')
                console.log(this.podetaps_check)
            },
            components: {
                pretty_time: {
                    props: ['value'],
                    template: '<p>{{computed_time | prettify}}</p>',
                    computed: {
                        computed_time() {
                            var time = this.value / 60;
                            var minutes = parseInt(time);
                            var secondes = Math.round((time - minutes) * 60);
                            return minutes + ":" + secondes;
                        }
                    },
                    filters: {
                        prettify: function (value) {
                            var data = value.split(':');
                            var minutes = data[0];
                            var secondes = data[1];
                            if (minutes < 10) {
                                minutes = "0" + minutes;
                            }
                            if (secondes < 10) {
                                secondes = "0" + secondes;
                            }
                            return minutes + ":" + secondes;
                        }
                    }
                }
            },
        })



})
})
})
})
})
})
})
})
})
})
})
})

function jsonGetParam(Stages, ids) {
    Param = [];
    ids.forEach(function (id) {
        Stages.forEach(function (stage){
            if (stage.id == id.ExePreparatoryStage){
                stage.Name = id.Name
                Param.push(stage);
            }
        })
    })
    return Param.sort(sIncrease);
}

function GetParam(params, id) {
    newParams =[];
    params.forEach(function (param) {
        if (param.ExeSubStage == id){
            var newparam = {
                name: param.ParameterName,
                value: param.ExactValue,
                FactValue: param.Value,
                id: param.id,
            }
            newParams.push(newparam)
        }
    })
    return newParams;
}

function sIncrease(i, ii) {
    if (i.Number > ii.Number)
        return 1;
    else if (i.Number < ii.Number)
        return -1;
    else
        return 0;
}

function getCriterion(stage, allcriterions) {
    let crits = []

    allcriterions.forEach(function (crit) {
        if (crit.ExeStage == stage.id){
            crits.push(crit.Name)
        }
    })

    return crits
}