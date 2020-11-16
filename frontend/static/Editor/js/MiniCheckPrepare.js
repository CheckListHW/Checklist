new Vue ({
    el: '#etap',
    data: {
        etap_name: "Приемка нефти", // Взято с прошлой страницы
        Experiment: JSON.parse(document.getElementById('Experiment').textContent),
        Stage: JSON.parse(document.getElementById('Stage').textContent),
        mini_checks:[],
        Criterion:[],
        input_value: "",
        is_edit: false,
        edit_index: -1,
    },
    methods: {
        Stages:  function(){
            this.Save();
            window.location.href = '/stages/?Experiment=' + this.Experiment;
        },

        Save:  function(){
                 axios.post('/stages/minicheckprepare/crud/',{
                Stage: this.Stage,
                Criterions: this.mini_checks,
            })
        },

        SubStagesPrepare: function(){
            window.location.href = '/stages/sub/?Stage=' + this.Stage;
        },

        add_new: function(array) {
            if(!this.is_edit) {
                array.push(this.input_value);
                this.input_value = "";
            }
            else {
                array[this.edit_index] = this.input_value;
                this.is_edit = false;
                this.edit_index = -1;
                this.input_value = "";
            }
        },

        delete_item: function(array, index) {
            array.splice(index, 1);
        },

        edit: function(index) {
            if(!this.is_edit) {
                this.is_edit = true;
                this.input_value = this.mini_checks[index];
                this.edit_index = index;
            }
            else {
                this.is_edit = false;
                this.input_value = "";
                this.edit_index = -1;
            }
        }
    },
    created: async function () {
        const vm = this;
        vm.Criterion = await axios.get('/api/criterion/?Stage='+vm.Stage)
        vm.Criterion = vm.Criterion.data
        vm.Criterion.forEach( function (item) {
            vm.mini_checks.push(item.Name)
        })
    },
})
