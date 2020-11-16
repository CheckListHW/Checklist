new Vue ({
    el: '#etap',
    data: {
        Experiment: JSON.parse(document.getElementById('Experiment').textContent),
        nextpage: null,
        etap_name: "Приемка нефти", // Взято с прошлой страницы
        equipments: [],
        dishes: [],
        reagents: [],
        documents: [],
        sizs: [],
        inputs_value: ["", "", "",  "", ""],
        input_visibles: [false,  false, false, false, false],
    },
    methods: {
        add_new: function(array, index, type) {
            stuff ={
                Name:this.inputs_value[index]
            }
            array.push(stuff);
            this.equipment = "";
            Vue.set(this.input_visibles, index, !this.input_visibles[index]);
            Vue.set(this.inputs_value, index, "");
        },

        delete_item: function(array, index, type, id) {
            array.splice(index, 1);
        },

        change_visibles: function(index) {
            Vue.set(this.input_visibles, index, !this.input_visibles[index]);
        },
        finish: async function () {
            const vm = this;
            stage = JSON.parse(document.getElementById('Stage').textContent)
            await axios.post('/stages/stuffs/crud/', {
                ProtectiveEquipment: vm.sizs,
                Doc: vm.documents,
                Reagents: vm.reagents,
                Dishes: vm.dishes,
                Equipment: vm.equipments,
                Add: 1,
                Stage:stage,
            }).then(res => {})
            axios.get('/api/stage/?id='+stage).then(response => {
                if (response.data[0].PreparatoryStage){
                    window.location.href = '/stages/sub/?Stage=' + stage;
                }
                else{
                    window.location.href = '/stages/preparatory/?Stage=' + stage;
                }
            })
        },
        Stages: function () {
            console.log(this.Experiment)
            console.log(JSON.parse(document.getElementById('Experiment').textContent))
            window.location.href = '/stages/?Experiment=' + this.Experiment;
        },
    },
     created: function () {
        const vm = this;
        PreStage = JSON.parse(document.getElementById('PreparatoryStage').textContent);
        console.log(PreStage)
        if (PreStage=='0')
            vm.nextpage='/stages/preparatory/';
        else
            vm.nextpage='/stages/sub/';
        console.log(vm.nextpage);
         axios.get('/api/stuffs/equipment/?Stage='+JSON.parse(document.getElementById('Stage').textContent))
            .then(function (response) {
                vm.equipments = response.data
            });
         axios.get('/api/stuffs/dishes/?Stage='+JSON.parse(document.getElementById('Stage').textContent))
            .then(function (response) {
                vm.dishes = response.data
            });
         axios.get('/api/stuffs/reagents/?Stage='+JSON.parse(document.getElementById('Stage').textContent))
            .then(function (response) {
                vm.reagents = response.data
            });
         axios.get('/api/stuffs/docs/?Stage='+JSON.parse(document.getElementById('Stage').textContent))
            .then(function (response) {
                vm.documents = response.data;
                console.log(response.data)
            });
         axios.get('/api/stuffs/protectiveEquipment/?Stage='+JSON.parse(document.getElementById('Stage').textContent))
            .then(function (response) {
                vm.sizs = response.data
            });
    }
})
