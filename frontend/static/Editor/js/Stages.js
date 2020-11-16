new Vue ({
    el: '#etaps',
    data: {

        exps: '/api/stage/?Experiment='+JSON.parse(document.getElementById('Experiment').textContent),
        expid: JSON.parse(document.getElementById('Experiment').textContent),
        stages: null,
        prepareStages: [],
        mainStages: [],
        experiment_name: "Анализ нефтей", // Взято с прошлой страницы

        etaps_visibles: {
            visible: false,
            id: 1,
        },
        extra_etaps_visibles: {
            visible: false,
            id: 2,
        },

        edit_etaps_visibles: {
            visible: false,
            id: 1,
        },
        edit_extra_etaps_visibles: {
            visible: false,
            id: 2,
        },

        etaps_names: [ ],
        extra_etaps_names: [ ],

        input_name: "",

        active_etap: {
            id: -1,
            index: -1,
        }
    },
    computed: {
        is_null: function() {
            if(this.input_name == "") {
                return true;
            }
            else {
                return false;
            }
        }
    },
    methods: {
        MainStuffs: function(index) {
            window.location.href = '/stages/stuffs/?Stage=' + this.mainStages[index].id;
        },

        PrepareStuffs: function(index) {
            window.location.href = '/stages/stuffs/?Stage=' + this.prepareStages[index].id;
        },

        delete_etap: function(index) {
            this.etaps_names.splice(index, 1);
            axios.post('/stages/crud/', {PreparatoryStage:0,Number: index, Experiment: this.expid ,Type: 'del',  }).then(res => {})
        },

        delete_extra_etap: function(index) {
            this.extra_etaps_names.splice(index, 1);
            axios.post('/stages/crud/', {PreparatoryStage:1,Number: index, Experiment: this.expid ,Type: 'del',  }).then(res => {})
        },

        edit: function(id, index) {
            this.active_etap.id = id;
            this.active_etap.index = index;

            if(this.edit_etaps_visibles.id == id) {
                this.input_name = this.etaps_names[index]
                this.edit_etaps_visibles.visible = !this.edit_etaps_visibles.visible;
            } else {
                this.input_name = this.extra_etaps_names[index]
                this.edit_extra_etaps_visibles.visible = !this.edit_extra_etaps_visibles.visible;
            }
        },

        change: function() {
            if(this.active_etap.id == 1) {
                Vue.set(this.etaps_names, this.active_etap.index, this.input_name);
                axios.post('/stages/crud/', {Name:this.input_name, PreparatoryStage:0,Number: this.active_etap.index, Experiment: this.expid ,Type: 'updt',  }).then(res => {})
                this.input_name = "";
                this.edit_hide(1);
            } else {
                Vue.set(this.extra_etaps_names, this.active_etap.index, this.input_name);
                axios.post('/stages/crud/', {Name:this.input_name, PreparatoryStage:1,Number: this.active_etap.index, Experiment: this.expid ,Type: 'updt',  }).then(res => {})
                this.input_name = "";
                this.edit_hide(2);
            }
        },

        add_etap_name: function() {
            this.etaps_names.push(this.input_name);
            this.etaps_visibles.visible = false;
            axios.post('/stages/crud/', {PreparatoryStage:0, Name: this.input_name, Experiment:this.expid ,Type: 'add',  }).then(res => {
                })
            this.input_name = "";
        },

        add_extra_etap_name: function() {
            this.extra_etaps_names.push(this.input_name);
            this.extra_etaps_visibles.visible = false;
            axios.post('/stages/crud/', {PreparatoryStage:1, Name: this.input_name, Experiment:this.expid ,Type: 'add',  }).then(res => {
                })
            this.input_name = "";
        },

        cancel: function(id) {
            this.hide(id);
            this.input_name = "";
        },

        edit_cancel: function(id) {
            this.input_name = "";

            this.edit_hide(id);
        },

        edit_hide: function(id) {
            this.active_etap.id = -1;
            this.active_etap.index = -1;

            if(this.edit_etaps_visibles.id == id) {
                this.edit_etaps_visibles.visible = !this.edit_etaps_visibles.visible;
            } else {
                this.edit_extra_etaps_visibles.visible = !this.edit_extra_etaps_visibles.visible;
            }
        },

        hide: function(id) {
            if(this.etaps_visibles.id == id) {
                this.etaps_visibles.visible = !this.etaps_visibles.visible;
            } else {
                this.extra_etaps_visibles.visible = !this.extra_etaps_visibles.visible;
            }
        }

    },
     created: async function () {
        const vm = this;
        vm.stages = await axios.get(vm.exps)
        vm.stages.data.forEach(function (item) {
            if (item.PreparatoryStage == false){
                if (item.Number > 0){
                    vm.mainStages.push(item)
                    vm.etaps_names.push(item.Name)
                }
            }
            else{
                vm.prepareStages.push(item)
                vm.extra_etaps_names.push(item.Name)
            }
        })
    }
})
