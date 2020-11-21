//POVTOR

Vue.component ('params_list', {
    props: ["array"],
    template:  `<select>
                    <option selected="true" disabled="true">Список переменных</option>
                    <option v-for="(params, index) in parametrs" name="params" :value="params" disabled="true" class="black">{{params.variable}} - {{params.value}}</option>
                </select>`,
    computed: {
        parametrs: function(){
            var list = [];
            for(var i = 0; i < this.array.length; i++) {
                for(var j = 0; j < this.array[i].length; j++) {
                    list.push(this.array[i][j]);
                }
            }

            return list;
        },
    }
})

//----------------------------------------------

new Vue ({
    el: '#etaps',

    data: {
        ExeStage:JSON.parse(document.getElementById('ExeStage').textContent),
        SubStages:[],
        Replays: null,
        exeparameters:[],
        execalcparameters:[],
        SubStagesCondition:[],
        podetapsall: [],
        firstChilds: [],
        file: '',
        imageOwnerId: null,
        etap_name: "Обезвоживание проб нефти",

        selectparallel: null,
        SubChecks: [],

        //POVTOR

        povtor: false,
        podetap_povtor: false,
        povtor_message: "",
        povtors: [],
        povtor_index: -1,

        povtor_etaps: [],
        povtor_count: 0,

        all_computed_parametrs: [

        ],

        //----------------------------------------------

        vetvleniya_condition: ["1", "2", "3"],// false по количесвту ветвлений
        selected_vetvleniya: -1,
        main_btn_disabled: true,
        choose: false,
        //Вначалае пусто. После нажатия на кнопку приступить либо груиться с БД единственный вариант либо окно выбора ветвления
        podetaps: [ ], //Взято с БД
        are_there_picture_add: [ ], //Взято с БД
        are_there_parametrs: [ ], //Вычисляется
        are_there_computed_parametrs: [ ], //Вычисляется
        are_there_period_parametrs:[ ],
        plan_parametrs: [ ],//Взято с БД
        computed_parametrs: [ ],//Взято с БД
        period_parametrs: [ ],//Взято с БД
        information: [ ], //Взято с БД
        podetaps_time: [ ], //Взято с БД в секундах
        variants_podetps:[ ], //Взято с БД
        vetvleniya_of_podetap_condition: [ ], //Взято с БД
        variants_vetvleniya_of_podetap: [ ], //Если есть ветвление, то первый элемент всегда true
        selected_vetvleniya_of_podetap: [ ],//Если есть ветвление, то всегда 0 индекс
        vetvleniya_condition_visible: [ ],
        pod_podetaps_disabled: [ ],//В начале true по количеству под-подетапов в первом ветвлении. После выбора сначала false, затем все true, по количество под-подэтапов в выбранном ветвелнии.
        pod_podetap_parametrs_visibles: [ ],
        pod_podetap_timers: [ ],
        pod_podetap_plays: [ ],
        pod_podetap_first_play_push: [ ],
        pod_podetap_first_picture_push: [ ], //Если для подэтапа не надо картинку то вместо true-false, иначе true (возможно можно просто прировнять значение из variants.add_picture)
        pod_podetaps_check: [ ],
        pod_podetaps_current_times: [ ],
        pod_podetaps_fact_parametrs: [ ],
        pod_podetaps_input_computed_parametrs: [ ],
        pod_podetaps_input_period_parametrs: [ ],
        active_pod_podetap: -1,
        btn_disabled: true,

        opening_p: false,
        opening_p_p: false,

        open_p: -1,

        open_p_p: {
            index: -1,
            v_p_number: -1,
            p_p_number: -1,
        },

        process: false,
        active_podetap: -1,
        parametrs_visible: [],
        timers: [],

        podetaps_check: [],
        disabled: [],
        plays: [],

        first_play_push: [],
        first_picture_push: [],

        fact_parametrs: [],
        input_computed_parametrs: [],
        input_period_parametrs: [],
        current_times: [],
        flags: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    },

    computed: {
        control_check: function() {
            if(this.podetaps_check.indexOf(false) == -1) {
                return true;
            } else {
                return false;
            }
        },

        parametrs_check: function() {
            if(this.fact_parametrs[this.active_podetap].indexOf("") == -1) {
                return false;
            } else {
                return true;
            }
        },

        computed_parametrs_check: function() {
            if(this.input_computed_parametrs[this.active_podetap].indexOf("") == -1) {
                return false;
            } else {
                return true;
            }
        },

        period_parametrs_check: function() {
            for(var i = 0; i < this.input_period_parametrs[this.active_podetap].length; i++) {
                for(var j = 0; j < this.input_period_parametrs[this.active_podetap][i].length; j++) {
                    if(this.input_period_parametrs[this.active_podetap][i][j].value == "") {
                        return true;
                    }
                }
            }

            return false;
        },

        pod_podetap_parametrs_check: function() {
            if(this.pod_podetaps_fact_parametrs[this.active_podetap][this.selected_vetvleniya_of_podetap[this.active_podetap]][this.active_pod_podetap].indexOf("") == -1) {
                return false;
            } else {
                return true;
            }
        },

        pod_podetap_computed_parametrs_check: function() {
            if(this.pod_podetaps_input_computed_parametrs[this.active_podetap][this.selected_vetvleniya_of_podetap[this.active_podetap]][this.active_pod_podetap].indexOf("") == -1) {
                return false;
            } else {
                return true;
            }
        },

        pod_podetap_period_parametrs_check: function() {
            var len = this.pod_podetaps_input_period_parametrs[this.active_podetap][this.selected_vetvleniya_of_podetap[this.active_podetap]][this.active_pod_podetap].length;


            for(var i = 0; i < len; i++) {
                for(var j = 0; j < this.pod_podetaps_input_period_parametrs[this.active_podetap][this.selected_vetvleniya_of_podetap[this.active_podetap]][this.active_pod_podetap][i].length; j++) {
                    if(this.pod_podetaps_input_period_parametrs[this.active_podetap][this.selected_vetvleniya_of_podetap[this.active_podetap]][this.active_pod_podetap][i][j].value == "") {
                        return true;
                    }
                }
            }

            return false;
        },
    },

    methods: {

        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        submitFile(thisOwnerId){
            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('id', thisOwnerId);
            axios.post( '/lab/check/', formData,
            {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                type: 'addfile',

            }
            ).then(function(){
                console.log('SUCCESS!!');
            })
            .catch(function(){
                console.log('FAILURE!!');
            });
        },

        check_load: function(index) {
            Vue.set(this.first_picture_push, index, false);
        },

        handleFileUpload(index, number, subnumber){
            if(number < 0){
                this.imageOwnerId = this.firstChilds[this.selected_vetvleniya][index].id
            }
            else {
                this.imageOwnerId = this.variants_podetps[index][number][subnumber].id
            }
            this.file = this.$refs.file[0].files[0];
        },

        change_visible: async function(index) {
            var true_index = this.parametrs_visible.indexOf(true);

            if(true_index == index) {
                Vue.set(this.parametrs_visible, index, !this.parametrs_visible[index]);

                this.opening_p = false;
                this.open_p = -1;
            } else {
                if(this.opening_p || this.opening_p_p) {
                    if(this.opening_p) {
                        Vue.set(this.parametrs_visible, this.open_p, false);
                        this.open_p = -1;
                    }

                    if(this.opening_p_p) {
                        Vue.set(this.pod_podetap_parametrs_visibles[this.open_p_p.index][this.open_p_p.v_p_number], this.open_p_p.p_p_number, false);

                        this.opening_p_p = false;

                        this.open_p_p.index = -1;
                        this.open_p_p.v_p_number = -1;
                        this.open_p_p.p_p_number = -1;
                    }

                    await this.sleep(1000);

                    Vue.set(this.parametrs_visible, index, true);
                    this.open_p = index;
                    this.opening_p = true;
                }

                Vue.set(this.parametrs_visible, index, true);
                this.open_p = index;
                this.opening_p = true;
            }
        },

        pod_podetap_change_visible: async function(index, number, subnumber) {
            if(this.open_p_p.index == index && this.open_p_p.v_p_number == number && this.open_p_p.p_p_number == subnumber) {
                Vue.set(this.pod_podetap_parametrs_visibles[index][number], subnumber, false);

                this.opening_p_p = false;

                this.open_p_p.index = -1;
                this.open_p_p.v_p_number = -1;
                this.open_p_p.p_p_number = -1;
            } else {
                if(this.opening_p || this.opening_p_p) {
                    if(this.opening_p) {
                        Vue.set(this.parametrs_visible, this.open_p, false);
                        this.open_p = -1;
                    }

                    if(this.opening_p_p) {
                        Vue.set(this.pod_podetap_parametrs_visibles[this.open_p_p.index][this.open_p_p.v_p_number], this.open_p_p.p_p_number, false);

                        this.opening_p_p = false;

                        this.open_p_p.index = -1;
                        this.open_p_p.v_p_number = -1;
                        this.open_p_p.p_p_number = -1;
                    }

                    await this.sleep(1000);

                    Vue.set(this.pod_podetap_parametrs_visibles[index][number], subnumber, true);

                    this.opening_p_p = true;

                    this.open_p_p.index = index;
                    this.open_p_p.v_p_number = number;
                    this.open_p_p.p_p_number = subnumber;
                }

                Vue.set(this.pod_podetap_parametrs_visibles[index][number], subnumber, true);

                this.opening_p_p = true;

                this.open_p_p.index = index;
                this.open_p_p.v_p_number = number;
                this.open_p_p.p_p_number = subnumber;
            }
        },

        fix_time: function(number, index, un_index) {
            this.input_period_parametrs[number][index][un_index].time = this.current_times[number];
        },

        podetap_fix_time: function(index, number, subnumber, sub_subnumber, un_index) {
            this.pod_podetaps_input_period_parametrs[index][number][subnumber][sub_subnumber][un_index].time = this.pod_podetaps_current_times[index][number][subnumber];
        },

        add_period: function(number, index) {
            var element = {
                value: null,
                time: null,
            }
            this.input_period_parametrs[number][index].push(element);
        },

        podetap_add_period: function(index, number, subnumber,sub_subnumber,) {
            var element = {
                value: null,
                time: null,
            }
            this.pod_podetaps_input_period_parametrs[index][number][subnumber][sub_subnumber].push(element);
        },

        start_done: async function() {
            if(this.vetvleniya_condition.length > 0) {
                this.choose = !this.choose;
            }
        },

        choose_main_vetvlenie:  function( ) {

            const vm = this;
            vm.SubChecks = [this.firstChilds[this.selected_vetvleniya].length]
            vm.selectparallel = [this.firstChilds[this.selected_vetvleniya].length]
            this.podetaps = this.podetapsall[this.selected_vetvleniya]

            mainSubStages = GetChild(vm.SubStages.data, null)
            axios.post('/lab/check/crud/',{
                type:'CheckSub',
                id: mainSubStages[this.selected_vetvleniya].id,
            })


            this.firstChilds[this.selected_vetvleniya].forEach(function (firstChild, i) {
                vm.povtors.push(GetReplay(firstChild, vm.Replays, vm.firstChilds[vm.selected_vetvleniya]))
                vm.are_there_picture_add.push(firstChild.Picture)
                vm.podetaps_time.push(firstChild.Duration*60)
                vm.podetaps_check.push(firstChild.Check)
                vm.information.push({
                    risks: firstChild.Risks,
                    dangerous: firstChild.Attention,
                })

                let newParams = []
                let newGetParam = GetParam(vm.exeparameters.data, firstChild.id)
                paramExist = false
                if (newGetParam != null) {
                    newGetParam.forEach(function (param) {
                        paramExist = true
                        newParams.push({
                            name: param.ParameterName,
                            value: param.ExactValue,
                            measure: param.Unit,
                            id: param.id,
                        })
                    })
                }
                vm.are_there_parametrs.push(paramExist)
                vm.plan_parametrs.push(newParams)


                paramCalcExist = false
                let newCalcParam = []
                let newGetCalcParam = GetCalcOrPeriodParam(vm.execalcparameters.data, firstChild.id, false)
                if (newGetCalcParam != null) {
                    newGetCalcParam.forEach(function (param) {
                            paramCalcExist = true
                            newCalcParam.push({
                                name: param.ParameterName,
                                variable: param.VarName,
                                measure: param.Unit,
                                period: param.Period,
                                id: param.id,
                            })
                    })
                }
                vm.are_there_computed_parametrs.push(paramCalcExist)
                vm.computed_parametrs.push(newCalcParam)


                paramCalcExist = false
                let newPeriodParam = []
                let newGetPeriodParam = GetCalcOrPeriodParam(vm.execalcparameters.data, firstChild.id, true)
                console.log(newGetPeriodParam)

                if (newGetPeriodParam != null) {
                    newGetPeriodParam.forEach(function (param, i ) {
                            paramCalcExist = true
                            newPeriodParam.push({
                                name: param.ParameterName,
                                measure: param.Unit,
                                id: param.id,
                            })
                    })
                }

                vm.are_there_period_parametrs.push(paramCalcExist)
                vm.period_parametrs.push(newPeriodParam)

                let secondChilds =(GetChild(vm.SubStages.data, firstChild.id))
                vm.SubStagesCondition.push(secondChilds)
                let ParallelSubStagesObj = []
                let podetap_condition = []
                if (secondChilds.length>1){
                    vm.SubChecks[i] = Array(secondChilds.length).fill([])
                    secondChilds.forEach(function (secondChild, i1) {
                        if (secondChild.Check){
                            vm.selectparallel[i] = i1
                        }

                        podetap_condition.push(secondChild.Condition)
                        let thirdChilds = GetChild(vm.SubStages.data, secondChild.id)
                        let SubStagesObj = []
                        vm.SubChecks[i][i1] = Array(thirdChilds.length).fill([])
                        thirdChilds.forEach(function (thirdChild, i2) {
                            vm.SubChecks[i][i1][i2] = thirdChild.Check
                            let SubStage =  {
                                name: thirdChild.Name,
                                id: thirdChild.id,
                                params: GetReadyParam(vm.exeparameters.data, thirdChild.id),
                                computed_params: GetReadyCalcOrPeriodParam(vm.execalcparameters.data,
                                    thirdChild.id, false),
                                period_params: GetReadyCalcOrPeriodParam(vm.execalcparameters.data,
                                    thirdChild.id, true),
                                add_picture: thirdChild.Picture,
                                experiment_times: thirdChild.Duration*60,
                                povtor: GetReplay(thirdChild, vm.Replays, thirdChilds),
                                descriptions: {attention: thirdChild.Attention, risks: thirdChild.Risks},
                            }
                            SubStagesObj.push(SubStage)
                        })
                        ParallelSubStagesObj.push(SubStagesObj)
                    })
                }
                vm.variants_podetps.push(ParallelSubStagesObj)
                vm.vetvleniya_of_podetap_condition.push(podetap_condition)

            })

            console.log(vm.period_parametrs)
            console.log(vm.computed_parametrs)
            console.log(vm.period_parametrs)

            var len = this.podetaps.length;

            for(i = 0; i < len; i++) {
                this.all_computed_parametrs.push([]);
                this.disabled.push(true);
                this.plays.push(false);
                this.first_play_push.push(true);

                if(this.are_there_picture_add[i]) {
                    this.first_picture_push.push(true);
                } else {
                    this.first_picture_push.push(false);
                }

                this.parametrs_visible.push(false);

                if(this.are_there_parametrs[i]) {
                    var array = [];

                    for (j = 0; j < this.plan_parametrs[i].length; j++) {
                        array.push("");
                    }

                    this.fact_parametrs.push(array);
                } else {
                    this.fact_parametrs.push([]);
                }

                if(this.are_there_computed_parametrs[i]) {
                    var array = [];

                    for (j = 0; j < this.computed_parametrs[i].length; j++) {
                        array.push("");
                    }

                    this.input_computed_parametrs.push(array);
                } else {
                    this.input_computed_parametrs.push([]);
                }

                if(this.are_there_period_parametrs[i]) {
                    var array = [];

                    for (j = 0; j < this.period_parametrs[i].length; j++) {
                        var elements = [
                            {
                                value: null,
                                time: null,
                            },
                        ];
                        array.push(elements);
                    }

                    this.input_period_parametrs.push(array);
                } else {
                    this.input_period_parametrs.push([]);
                }

                this.timers.push(null);
                this.current_times.push(0);

                this.variants_vetvleniya_of_podetap.push([]);
                this.selected_vetvleniya_of_podetap.push([]);
                this.pod_podetaps_disabled.push([]);
                this.pod_podetap_parametrs_visibles.push([]);
                this.pod_podetap_timers.push([]);
                this.pod_podetap_plays.push([]);
                this.pod_podetap_first_play_push.push([]);
                this.pod_podetap_first_picture_push.push([]);
                this.pod_podetaps_check.push([]);
                this.pod_podetaps_current_times.push([]);
                this.pod_podetaps_fact_parametrs.push([]);
                this.pod_podetaps_input_computed_parametrs.push([]);
                this.pod_podetaps_input_period_parametrs.push([]);

                this.vetvleniya_condition_visible.push(false);

                var variant_len = this.variants_podetps[i].length;

                if(variant_len > 0) {
                    this.variants_vetvleniya_of_podetap[i].push(true);
                    for(j = 1; j < variant_len; j++) {
                        this.variants_vetvleniya_of_podetap[i].push(false);
                    }

                    this.selected_vetvleniya_of_podetap[i].push[0];

                    for(j = 0; j < this.variants_podetps[i][0].length; j++) {
                        this.pod_podetaps_disabled[i].push(true);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(false);
                        }

                        this.pod_podetap_parametrs_visibles[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(null);
                        }

                        this.pod_podetap_timers[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(false);
                        }

                        this.pod_podetap_plays[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(true);
                        }

                        this.pod_podetap_first_play_push[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(false);
                        }

                        this.pod_podetap_first_picture_push[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(false);
                        }

                        this.pod_podetaps_check[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            array.push(0);
                        }

                        this.pod_podetaps_current_times[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            var sub_array = [];

                            for(l = 0; l < this.variants_podetps[i][j][k].params.length; l++) {
                                sub_array.push("");
                            }

                            array.push(sub_array);
                        }

                        this.pod_podetaps_fact_parametrs[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            var sub_array = [];

                            for(l = 0; l < this.variants_podetps[i][j][k].computed_params.length; l++) {
                                sub_array.push("");
                            }

                            array.push(sub_array);
                        }

                        this.pod_podetaps_input_computed_parametrs[i].push(array);
                    }

                    for(j = 0; j < variant_len; j++) {
                        var array = [];

                        for(k = 0; k < this.variants_podetps[i][j].length; k++) {
                            var sub_array = [];

                            for(l = 0; l < this.variants_podetps[i][j][k].period_params.length; l++) {
                                var elements = [
                                    {
                                        value: null,
                                        time: null,
                                    },
                                ];
                                sub_array.push(elements);
                            }

                            array.push(sub_array);
                        }

                        this.pod_podetaps_input_period_parametrs[i].push(array);
                    }
                }
            }

            this.choose = !this.choose;

            this.process = !this.process;
            this.active_podetap = 0;

            Vue.set(this.disabled, 0, !this.disabled[0]);
            Vue.set(this.parametrs_visible, 0, !this.parametrs_visible[0]);

            this.opening_p = true;
            this.open_p = 0;



        },

        startTimer: function(index) {
            this.timers[index] = setInterval(() => {
                Vue.set(this.current_times, index, this.current_times[index]+1);
            }, 1000)
        },

        stopTimer: function(index) {
            clearTimeout(this.timers[index])
        },

        start: function(index) {
            Vue.set(this.plays, index, !this.plays[index]);
            Vue.set(this.first_play_push, index, false);

            this.startTimer(index);
        },

        stop: function(index) {
            Vue.set(this.plays, index, !this.plays[index]);

            this.stopTimer(index);
        },

        //POVTOR

        povtor_ok: function() {
            this.povtor_etaps.push(this.povtor_index);

            for(var i = 0; i < this.povtor_etaps.length; i++) {
                var ind = this.povtor_etaps[i];

                if(i > 0) {
                    Vue.set(this.disabled, ind, true);
                }

                Vue.set(this.flags, ind, false);
                Vue.set(this.podetaps_check, ind, false);
                Vue.set(this.plays, ind, false);
                Vue.set(this.first_play_push, ind, true);

                if(this.are_there_picture_add[ind]) {
                    Vue.set(this.first_picture_push, ind, true);
                } else {
                    Vue.set(this.first_picture_push, ind, false);
                }

                if(this.are_there_parametrs[ind]) {
                    var array = [];

                    for (j = 0; j < this.plan_parametrs[ind].length; j++) {
                        array.push("");
                    }

                    Vue.set(this.fact_parametrs, ind, array);
                } else {
                    Vue.set(this.fact_parametrs, ind, []);
                }

                if(this.are_there_computed_parametrs[ind]) {
                    var array = [];

                    for (j = 0; j < this.computed_parametrs[ind].length; j++) {
                        array.push("");
                    }

                    for(var k = 0; k < this.input_computed_parametrs[ind].length; k++) {
                        this.all_computed_parametrs[ind].push(
                            {
                                name: this.computed_parametrs[ind][k].name,
                                variable: this.computed_parametrs[ind][k].variable + "." + this.povtor_count,
                                value: this.input_computed_parametrs[ind][k],
                            }
                        );
                    }
                    Vue.set(this.input_computed_parametrs, ind, array);
                } else {
                    Vue.set(this.input_computed_parametrs, ind, []);
                }

                if(this.are_there_period_parametrs[ind]) {
                    var array = [];

                    for (j = 0; j < this.period_parametrs[ind].length; j++) {
                        var elements = [
                            {
                                value: null,
                                time: null,
                            },
                        ];
                        array.push(elements);
                    }

                    Vue.set(this.input_period_parametrs, ind, array);
                } else {
                    Vue.set(this.input_period_parametrs, ind, []);
                }

                Vue.set(this.timers, ind, null);
                Vue.set(this.current_times, ind, 0);
            }

            Vue.set(this.parametrs_visible, this.povtor_etaps[0], true);
            this.active_podetap = this.povtor_etaps[0];
            this.open_p = this.povtor_etaps[0];

            this.povtor = false;
            this.povtor_message = "";
            this.povtor_index = -1;
            this.povtor_etaps = [];
            this.povtor_count = this.povtor_count + 1;
        },

        povtor_no: function() {
            this.povtor = false;
            this.povtor_message = "";
            this.povtor_etaps = [];
            this.povtor_count = 0;

            if(this.variants_podetps[this.povtor_index].length == 0) {
                if(this.povtor_index < this.podetaps.length) {
                    Vue.set(this.disabled, this.povtor_index + 1, false);
                    Vue.set(this.parametrs_visible, this.povtor_index + 1, true);
                    this.active_podetap = this.active_podetap + 1;

                    this.open_p = this.povtor_index + 1;
                } else {
                    this.opening_p = false;
                    this.open_p = -1
                }
            } else {
                Vue.set(this.vetvleniya_condition_visible, this.povtor_index, true);
                this.active_pod_podetap = 0;
            }

            this.povtor_index = -1;
        },

        //Добавить OLD

        povtor_count_message: function() {
            if(this.povtor_count == 0) {
                return "";
            }
            else {
                return " (Повторов - " + this.povtor_count + ")";
            }
        },

        //--------------------------------------

        //POD_POD_POVTOR

        podetap_povtor_ok: function() {
            this.povtor_etaps.push(this.povtor_index);

            for(var i = 0; i < this.povtor_etaps.length; i++) {
                var ind = this.povtor_etaps[i];

                if(i > 0) {
                    Vue.set(this.pod_podetaps_disabled[this.open_p_p.index], ind, true);
                }

                Vue.set(this.pod_podetaps_check[this.open_p_p.index][this.open_p_p.v_p_number], ind, false);
                Vue.set(this.pod_podetap_plays[this.open_p_p.index][this.open_p_p.v_p_number], ind, false);
                Vue.set(this.pod_podetap_first_play_push[this.open_p_p.index][this.open_p_p.v_p_number], ind, true);

                if(this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].add_picture) {
                    Vue.set(this.pod_podetap_first_picture_push[this.open_p_p.index][this.open_p_p.v_p_number], ind, true);
                } else {
                    Vue.set(this.pod_podetap_first_picture_push[this.open_p_p.index][this.open_p_p.v_p_number], ind, false);
                }

                var params_len = this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].params.length;

                if(params_len > 0) {
                    var array = [];

                    for (j = 0; j < params_len; j++) {
                        array.push("");
                    }

                    Vue.set(this.pod_podetaps_fact_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, array);
                } else {
                    Vue.set(this.pod_podetaps_fact_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, []);
                }

                var comp_params_len = this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].computed_params.length;

                if(comp_params_len > 0) {
                    var array = [];

                    for (j = 0; j < comp_params_len; j++) {
                        array.push("");
                    }

                    for(var k = 0; k < this.pod_podetaps_input_computed_parametrs[this.open_p_p.index][this.open_p_p.v_p_number][ind].length; k++) {
                        this.all_computed_parametrs[ind].push(
                            {
                                name: this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].computed_params[k].name,
                                variable: this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].computed_params[k].variable + "." + this.povtor_count,
                                value: this.pod_podetaps_input_computed_parametrs[this.open_p_p.index][this.open_p_p.v_p_number][ind][k],
                            }
                        );
                    }
                    Vue.set(this.pod_podetaps_input_computed_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, array);
                } else {
                    Vue.set(this.pod_podetaps_input_computed_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, []);
                }

                var period_params_len = this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number][ind].period_params.length;

                if(period_params_len > 0) {
                    var array = [];

                    for (j = 0; j < period_params_len; j++) {
                        var elements = [
                            {
                                value: null,
                                time: null,
                            },
                        ];
                        array.push(elements);
                    }

                    Vue.set(this.pod_podetaps_input_period_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, array);
                } else {
                    Vue.set(this.pod_podetaps_input_period_parametrs[this.open_p_p.index][this.open_p_p.v_p_number], ind, []);
                }

                Vue.set(this.pod_podetap_timers[this.open_p_p.index][this.open_p_p.v_p_number], ind, null);
                Vue.set(this.pod_podetaps_current_times[this.open_p_p.index][this.open_p_p.v_p_number], ind, 0);
            }

            Vue.set(this.pod_podetap_parametrs_visibles[this.open_p_p.index][this.open_p_p.v_p_number], this.povtor_etaps[0], true);
            this.active_pod_podetap = this.povtor_etaps[0];
            this.open_p_p.p_p_number = this.povtor_etaps[0];

            this.podetap_povtor = false;
            this.povtor_message = "";
            this.povtor_index = -1;
            this.povtor_etaps = [];
            this.povtor_count = this.povtor_count + 1;
        },

        podetap_povtor_no: function() {
            this.podetap_povtor = false;
            this.povtor_message = "";
            this.povtor_etaps = [];
            this.povtor_count = 0;

            if(this.povtor_index == (this.variants_podetps[this.open_p_p.index][this.open_p_p.v_p_number].length - 1)) {
                Vue.set(this.disabled, this.open_p_p.index + 1, false);
                Vue.set(this.parametrs_visible, this.open_p_p.index + 1, true);
                this.active_podetap = this.active_podetap + 1;
                this.active_pod_podetap = -1;

                this.opening_p = true;
                this.open_p = this.open_p_p.index + 1;

                this.opening_p_p = false;

                this.open_p_p.index = -1;
                this.open_p_p.v_p_number = -1;
                this.open_p_p.p_p_number = -1;
            } else {
                Vue.set(this.pod_podetaps_disabled[this.open_p_p.index], this.povtor_index + 1, false);
                Vue.set(this.pod_podetap_parametrs_visibles[this.open_p_p.index][this.open_p_p.v_p_number], this.povtor_index + 1, true);
                this.active_pod_podetap = this.active_pod_podetap + 1;
                this.open_p_p.p_p_number = this.open_p_p.p_p_number +1;
            }

            this.povtor_index = -1;
        },

        //--------------------------------------

        postParametr: async  function(index, number, subnumber){
            const vm = this;

            let thisOwnerId;
            if(number < 0) thisOwnerId = this.firstChilds[this.selected_vetvleniya][index].id
            else thisOwnerId = this.variants_podetps[index][number][subnumber].id

            if (this.imageOwnerId == thisOwnerId) this.submitFile(thisOwnerId)


                let parametrs = [],
                    calcparametrs = [],
                    periodparametrs = [],
                    substage = this.firstChilds[this.selected_vetvleniya][index],
                    planParametrs =  vm.plan_parametrs[index],
                    planCalcParametrs = vm.computed_parametrs[index],
                    planPeriodParametrs = vm.period_parametrs[index],
                    factParametrs = vm.fact_parametrs[index],
                    factCalcParametrs = vm.input_computed_parametrs[index],
                    factPeriodParametrs = vm.input_period_parametrs[index];

                if (number >= 0){
                    substage = vm.variants_podetps[index][number][subnumber]
                    planParametrs = vm.variants_podetps[index][number][subnumber].params,
                    planCalcParametrs = vm.variants_podetps[index][number][subnumber].computed_params,
                    planPeriodParametrs = vm.variants_podetps[index][number][subnumber].period_params,
                    factParametrs = vm.pod_podetaps_fact_parametrs[index][number][subnumber],
                    factCalcParametrs = vm.pod_podetaps_input_computed_parametrs[index][number][subnumber],
                    factPeriodParametrs = vm.pod_podetaps_input_period_parametrs[index][number][subnumber];
                }

                factParametrs.forEach(function (paramSubsub, i) {
                    if (planParametrs[i] != null & paramSubsub != ''){
                        parametrs.push({
                            parametr: paramSubsub,
                            id:planParametrs[i].id,
                        })
                    }
                })

                factCalcParametrs.forEach(function (paramSubsub, i) {
                    if (planCalcParametrs[i] != null & paramSubsub != ''){
                        calcparametrs.push({
                            parametr: paramSubsub,
                            id:planCalcParametrs[i].id,
                        })
                    }
                })

                factPeriodParametrs.forEach(function (subparam,i) {
                    if (planPeriodParametrs[i] != null){
                        if (subparam[0].value != null){
                            periodparametrs.push({
                                parametr: subparam,
                                id:planPeriodParametrs[i].id,
                            })
                        }
                    }
                })

                await axios.post('/lab/check/crud/',{
                    type: 'CheckSub',
                    id: substage.id,
                    addParam: true,
                    Parameter: parametrs,
                    CalcParameter: calcparametrs,
                    Period: periodparametrs,
                }).then(response =>{
                    console.log(response.data)
                })
        },


        check_pressed: async function(index, old) {
            const vm = this;

            if (!old) {
                await vm.postParametr(index, -1, -1)
            }
            this.stopTimer(index);
            Vue.set(this.plays, index, false);
            Vue.set(this.podetaps_check, index, true);
            Vue.set(this.parametrs_visible, index, false);

            if (!old) {
                await this.sleep(1000);
            }
            //POVTOR проверка есть ли после этого этапа повторение
            if(this.povtors[index].check) {
                if (!old) {
                    this.povtor = true;
                    this.povtor_message = this.povtors[index].message;
                    this.povtor_index = index;

                    for (var i = 0; i < this.povtors[index].povtor_podetaps.length; i++) {
                        this.povtor_etaps.push(this.povtors[index].povtor_podetaps[i].number)
                    }
                }
            }
            else
            {
                if(this.variants_podetps[index].length == 0) {
                    if(index < this.podetaps.length) {
                        Vue.set(this.disabled, index + 1, false);
                        if (!old){
                            Vue.set(this.parametrs_visible, index + 1, true);
                        }
                        this.active_podetap = this.active_podetap + 1;
                        this.open_p = index + 1;
                    } else {
                        this.opening_p = false;
                        this.open_p = -1
                    }
                }
                else {
                    this.selected_vetvleniya_of_podetap[index] = this.selectparallel[index]
                    this.active_pod_podetap = 0;
                    if (!old) {
                        await this.sleep(1000);
                    }
                    Vue.set(this.vetvleniya_condition_visible, index, true);
                    this.active_pod_podetap = 0;
                    if (old){
                        this.close(index, old)
                    }
                    else{
                        Vue.set(this.vetvleniya_condition_visible, index, true);
                    }
                    close()

                    let x = this.selectparallel[index]
                    vm.SubChecks[index][this.selectparallel[index]].forEach(await function (item, i) {
                        if (item){
                           vm.pod_podetaps_check_pressed(index, x, i, old)
                        }
                    })
                }
            }

        },


        pod_podetaps_check_pressed: async function(index, number, subnumber, old) {
            const vm =this;

            if (!old) {
                await vm.postParametr(index, number, subnumber)
            }

            this.pod_podetap_stopTimer(index, number, subnumber);

            var array = this.pod_podetap_plays[index][number];
            Vue.set(array, subnumber, false);

            array = this.pod_podetaps_check[index][number];
            Vue.set(array, subnumber, true);

            array = this.pod_podetap_parametrs_visibles[index][number];
            Vue.set(array, subnumber, false);

             if (!old) {
                        await this.sleep(1000);
                    }
            if(this.variants_podetps[index][number][subnumber].povtor.check) {
                this.podetap_povtor = true;
                this.povtor_message = this.variants_podetps[index][number][subnumber].povtor.message;
                this.povtor_index = subnumber;

                for(var i = 0; i < this.variants_podetps[index][number][subnumber].povtor.povtor_podetaps.length; i++) {
                    this.povtor_etaps.push(this.variants_podetps[index][number][subnumber].povtor.povtor_podetaps[i].number)
                }
            } else {
                if (subnumber == (this.variants_podetps[index][number].length - 1)) {
                    Vue.set(this.disabled, index + 1, false);
                    if (!old) {
                        Vue.set(this.parametrs_visible, index + 1, true);
                    }
                    this.active_podetap = this.active_podetap + 1;
                    this.active_pod_podetap = -1

                    this.opening_p_p = false;

                    this.open_p_p.index = -1;
                    this.open_p_p.v_p_number = -1;
                    this.open_p_p.p_p_number = -1;

                    this.opening_p = true;
                    this.open_p = index + 1;
                } else {
                    Vue.set(this.pod_podetaps_disabled[index], subnumber + 1, false);
                    Vue.set(this.pod_podetap_parametrs_visibles[index][number], subnumber + 1, true);
                    this.active_pod_podetap = this.active_pod_podetap + 1;
                    this.open_p_p.p_p_number = this.open_p_p.p_p_number + 1;
                }
            }
        },


        pod_podetaps_are_there_parametrs: function(index, number, subnumber) {
            if(this.variants_podetps[index][number][subnumber].params.length > 0) {
                return true;
            } else {
                return false;
            }
        },


        pod_podetaps_are_there_computed_parametrs: function(index, number, subnumber) {
            if(this.variants_podetps[index][number][subnumber].computed_params.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        pod_podetaps_are_there_period_parametrs: function(index, number, subnumber) {
            if(this.variants_podetps[index][number][subnumber].period_params.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        pod_podetap_startTimer: function(index, number, subnumber) {
            this.pod_podetap_timers[index][number][subnumber] = setInterval(() => {
                var array = this.pod_podetaps_current_times[index][number];
                Vue.set(array, subnumber, array[subnumber]+1);
            }, 1000)
        },

        pod_podetap_stopTimer: function(index, number, subnumber) {
            clearTimeout(this.pod_podetap_timers[index][number][subnumber])
        },

        pod_podetap_start: function(index, number, subnumber) {
            var array = this.pod_podetap_plays[index][number];
            Vue.set(array, subnumber, !array[subnumber]);

            array = this.pod_podetap_first_play_push[index][number];
            Vue.set(array, subnumber, false);

            this.pod_podetap_startTimer(index, number, subnumber);
        },

        pod_podetap_stop: function(index, number, subnumber) {
            var array = this.pod_podetap_plays[index][number];
            Vue.set(array, subnumber, !array[subnumber]);

            this.pod_podetap_stopTimer(index, number, subnumber);
        },

        pod_podetap_check_load: function(index, number, subnumber) {
            var array = this.pod_podetap_first_picture_push[index][number];
            Vue.set(array, subnumber, false);
        },



        close: function(index, old) {

            let SubStageCheck_id = this.firstChilds[this.selected_vetvleniya][index].id;
            let secondChilds =(GetChild(this.SubStages.data, SubStageCheck_id))

            if (!old){
                axios.post('/lab/check/crud/',{
                    type:'CheckSub',
                    id: secondChilds[this.selected_vetvleniya_of_podetap[index]].id,
                })
            }


            //Делаем выбор ветвления
            var array = this.variants_vetvleniya_of_podetap[index];
            Vue.set(array, array.indexOf(true), false);
            Vue.set(array, this.selected_vetvleniya_of_podetap[index], true);

            //Разблокируем первый подэтап в ветвлении
            this.pod_podetaps_disabled[index].splice(0, this.pod_podetaps_disabled[index].length)

            for(var i = 0; i < this.variants_podetps[index][this.selected_vetvleniya_of_podetap[index]].length; i++) {
                this.pod_podetaps_disabled[index].push(true);
            }

            Vue.set(this.pod_podetaps_disabled[index], 0, false);

            Vue.set(this.vetvleniya_condition_visible, index, false);

            var selected_vetvlenie = this.selected_vetvleniya_of_podetap[index];

            Vue.set(this.pod_podetap_parametrs_visibles[index][selected_vetvlenie], 0, true);

            this.opening_p = false;
            this.open_p = -1;

            this.opening_p_p = true;

            this.open_p_p.index = index;
            this.open_p_p.v_p_number = selected_vetvlenie;
            this.open_p_p.p_p_number = 0;

            this.btn_disabled = true;
        },

        inf: function(value) {
            if(value == "") {
                return "Отсутствует";
            } else {
                return value;
            }
        },

        Stages:async function() {
            ExeStageData = await axios.get("/api/exestage/?id="+this.ExeStage)
            ExeExperimentData = await axios.get("/api/exeexperiment/?id="+(ExeStageData.data[0].ExeExperiment))
            window.location.href = '/lab/stages/?Sample=' + ExeExperimentData.data[0].Samples

        },

        Preparatory:async function() {
            PreparatoryStages = await axios.get("/api/exeparagraph/?ExeStage="+this.ExeStage)
            if (PreparatoryStages.data.length > 1){
                window.location.href = '/lab/preparatory/?ExeStage=' + this.ExeStage;
            }
            else{
                window.location.href = ('/lab/stuffs/?ExeStage=' + this.ExeStage);
            }
        },
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
                    return minutes+":"+secondes;
                }
            },
            filters: {
                prettify : function(value) {
                    var data = value.split(':');
                    var minutes = data[0];
                    var secondes = data[1];
                    if (minutes < 10) {
                        minutes = "0"+minutes;
                    }
                    if (secondes < 10) {
                        secondes = "0"+secondes;
                    }
                    return minutes+":"+secondes;
                }
            }
        }
    },

    created: async function() {
        const vm = this;

        vm.vetvleniya_condition = []

        vm.SubStages = await axios.get(`/api/exesubstage/?ExeStage=${vm.ExeStage}`)
        vm.exeparameters = await axios.get(`/api/exeparameters/?ExeMainStage=${vm.ExeStage}`)
        vm.execalcparameters = await axios.get(`/api/execalcparameters/?ExeMainStage=${vm.ExeStage}`)
        vm.Replays = (await axios.get(`/api/exereplay/?MainStage=${vm.ExeStage}`)).data


        mainSubStages = GetChild(vm.SubStages.data, null);

        var SelectMain = -1;
        mainSubStages.forEach(function (mainSubStage, i) {
            vm.firstChilds.push(GetChild(vm.SubStages.data, mainSubStage.id))
            vm.vetvleniya_condition.push(mainSubStage.Condition)
            vm.podetapsall.push([])
            vm.firstChilds[i].forEach(function (firstChild, i1) {
                vm.podetapsall[i].push(firstChild.Name)
            })
            if (mainSubStage.Check && SelectMain){
                SelectMain = i;
            }
            if (mainSubStage.length = 1){
                SelectMain =0
            }
        })


        this.choose = !this.choose
        if (SelectMain != -1){
            this.selected_vetvleniya = SelectMain;
            this.choose_main_vetvlenie();
        }

        console.log(vm.SubChecks)

        this.firstChilds[this.selected_vetvleniya].forEach(function (firstChild, i) {

                if (firstChild.Check ) {
                    vm.check_pressed(i, 1)
                }
                let secondChilds =(GetChild(vm.SubStages.data, firstChild.id))
                secondChilds.forEach(function (secondChild, i1) {

                    let thirdChilds = GetChild(vm.SubStages.data, secondChild.id)
                    thirdChilds.forEach(function (thirdChild, i2) {

                        if (firstChild.Check ) {
                //            pod_podetaps_check_pressed(i, i1, i2, 1)
                        }

                    })
                })
        })


    }
})


function sIncrease(i, ii) {
    if (i.Number > ii.Number)
        return 1;
    else if (i.Number < ii.Number)
        return -1;
    else
        return 0;
}


function GetChild(SubStages, Parent) {
    NewStages = []
    SubStages.forEach(function (SubStage) {
        if (SubStage.Parent == Parent)
            NewStages.push(SubStage);
    })
    return NewStages.sort(sIncrease);
}


function GetParam(params, id) {
    newParams =[];
    params.forEach(function (param) {
        if (param.ExeSubStage == id){
            newParams.push(param)
        }
    })
    return newParams;
}


function GetCalcOrPeriodParam(params, id, CalcOrPeriod) {
    newParams =[];
    params.forEach(function (param) {
        if (param.ExeSubStage == id){
            let period = true
            if (param.Period != true)
                period = false
            if(period == CalcOrPeriod){
                newParams.push(param)
            }
        }
    })
    return newParams;
}


function GetReadyParam(params, id) {
    newParams =[];
    params.forEach(function (param) {
        if (param.ExeSubStage == id){
            let newparam = {
                name: param.ParameterName,
                value: param.ExactValue,
                measure: param.Unit,
                id: param.id,
            }
            newParams.push(newparam)
        }
    })
    return newParams;
}


function GetReadyCalcOrPeriodParam(params, id, CalcOrPeriod) {
    newParams =[];
    let newparam = null;
    params.forEach(function (param) {
        if (param.ExeSubStage == id) {
            let period = true
            if (param.Period != true)
                period = false
            if(period == CalcOrPeriod) {
                if(CalcOrPeriod == true) {
                    newparam = {
                        name: param.ParameterName,
                        measure: param.Unit,
                        id: param.id,
                    }
                }
                else {
                    newparam = {
                        name: param.ParameterName,
                        variable: param.VarName,
                        measure: param.Unit,
                        period: param.Period,
                        id: param.id,
                    }
                }
                newParams.push(newparam)
            }
        }
    })
    return newParams;
}


function GetReplay(SubStage, Replays, SubStages) {
    let povtor_podetaps = [],
        replayscheck = false,
        SubStageid = SubStage.id;

    Replays.forEach(function (Replay) {
        if (Replay.ExeSubStage == SubStageid){
            SubStages.forEach(function (substage, i) {
                if(Replay.ReplaySubStage == substage.id){
                    povtor_podetaps.push({
                        number: i,
                    })
                }
            })
        }

    })

    if (povtor_podetaps.length >0){
        replayscheck = true
    }

    return {
        check: replayscheck,
        message: SubStage.ReplayMessage,
        povtor_podetaps: povtor_podetaps,
    }

}