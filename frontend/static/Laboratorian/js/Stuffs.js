new Vue ({
    el: '#etaps',
    data: {
        ExeStage:JSON.parse(document.getElementById('ExeStage').textContent),
        Stage:JSON.parse(document.getElementById('Stage').textContent),
        etap_name: "Приемка нефти", //Взять с прошлой страницы
        MainCheck: false,
        equipments: ["Сушильный шкаф (диапазон температур от + 30 °С до +350 °С)", "Электронные аналитические весы I или II класса точности"],
        dishes: ["Флакон из темного стекла объемом 100 мл (ФВ 100-20-ОС) – 2 шт", "Делительная воронка объемом 250/500 мл (ГОСТ 25336-82) – 1 шт", "Флакон пенициллиновый объемом 10 мл(ФО-10-НС-3)", "Лопаточка глазная стеклянная– 1 шт", "Стакан стеклянный объемом 250 мл", "Кольцо лабораторное для штатива (диаметр 100 мм) – 1 шт", "Штатив лабораторный – 1 шт"],
        reagents: ["Хлористый кальция обезвоженный (чистый, ТУ 6-09-4711-81) – 20 г.", "Сульфат натрия «ХЧ» (ГОСТ 4166-76) – 2 г.", "Хлороформ, чистота: химически чистый (ХЧ) (ГОСТ 20015-88)"],
        documents: ["Форма 2.1 – Групповой анализ", "Форма 2.2 – Групповой состав – доведение до постоянной массы"],
        sizs: ["Перчатки нитриловые неопудренные", "Лабораторный халат", "Защитные очки"],

        equipments_check: [],
        dishes_check: [],
        reagents_check: [],
        documents_check: [],
        sizs_check: [],
    },
    methods: {
        is_null: function(array) {
            if (array.length == 0) {
                return true;
            }
        },
        finish: function() {
            axios.post('/lab/stuffs/', {
                    Finish: "Stuff",
                    ExeStage:JSON.parse(document.getElementById('ExeStage').textContent),
                })
            },
        Preparatory: async function(index) {
            this.finish();
            PreparatoryStages = await axios.get("/api/exeparagraph/?ExeStage="+this.ExeStage)
            console.log(PreparatoryStages)
            if (PreparatoryStages.data.length > 0){
                window.location.href = '/lab/preparatory/?ExeStage=' + this.ExeStage;
            }
            else{
                window.location.href = ('/lab/check/?ExeStage=' + this.ExeStage);
            }

        },
    },
    computed: {
        control_check: function() {
            var false_indexes = [];

            if(this.equipments_check.indexOf(false) == -1) {
                false_indexes.push(true)
            }
            if(this.dishes_check.indexOf(false) == -1) {
                false_indexes.push(true)
            }
            if(this.reagents_check.indexOf(false) == -1) {
                false_indexes.push(true)
            }
            if(this.documents_check.indexOf(false) == -1) {
                false_indexes.push(true)
            }
            if(this.sizs_check.indexOf(false) == -1) {
                false_indexes.push(true)
            }
            if(false_indexes.length == 5 && false_indexes.indexOf(false) == -1) {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted: async function() {
        let vm = this;
        var i = 0;

        stages = await axios.get(`/api/exestage/?id=${vm.ExeStage}`)
        let check =  false
        if (stages.data[0].CheckStuff == true)
            check =  true

        let equipments = await axios.get(`/api/exeequipment/?ExeStage=${vm.ExeStage}`)
        vm.equipments = equipments.data
        vm.equipments_check = new Array(equipments.data.length).fill(check);

        let dishes = await axios.get(`/api/exedishes/?ExeStage=${vm.ExeStage}`)
        vm.dishes = dishes.data
        vm.dishes_check = new Array(dishes.data.length).fill(check);

        let reagents = await axios.get(`/api/exereagents/?ExeStage=${vm.ExeStage}`)
        vm.reagents = reagents.data
        vm.reagents_check = new Array(reagents.data.length).fill(check);

        let docs = await axios.get(`/api/exedocs/?ExeStage=${vm.ExeStage}`)
        vm.documents = docs.data
        vm.documents_check = new Array(docs.data.length).fill(check);

        let protectiveEquipment = await axios.get(`/api/exeprotectiveequipments/?ExeStage=${vm.ExeStage}`)
        vm.sizs = protectiveEquipment.data
        vm.sizs_check = new Array(protectiveEquipment.data.length).fill(check);
    }
})
