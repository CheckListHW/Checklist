Vue.component ('settings_bar_podetaps', {
    props: ["etapnumber", "vetvleniya", "podetap", "podetaps", "index", "number_of_variant", "equipments", "dishes", "reagents"],
    template:  `<transition name="fade">
                    <div class="popup_window" v-if="podetap.visibles">
                        <div class="window_form">
                            <div class="title_inner">
                                <h2>{{podetap_number_inner(etapnumber, number_of_variant + 1, podetap.number + 1)}} {{podetapName(podetap.name)}}</h2>
                            </div>

                            <div class="inner__container">
                                <div class="short_collumn">
                                    <div class="etap_info">
                                        <ex_name v-model="podetap.name"></ex_name>
                                        <ex_time v-model="podetap.experiment_time"></ex_time>
                                    </div>

                                    <div class="extra_etap_info">
                                        <description    :descriptions="podetap.descriptions"
                                                >
                                        </description>
                                    </div>

                                    <div class="buttons_control">
                                        <h3>Кнопки управления</h3>

                                        <div class="buttons">
                                            <div class="add_picture">
                                                <button class="btn btn-info btn_add_picture" @click="change_add_picture">Возможность добавить изображение лаборанту</button>
                                                <input type="checkbox" class="picture_checkbox" v-model="podetap.add_picture" />
                                            </div>
                                            <div class="delete_btn_block">
                                                <button class="btn btn-danger delete_btn" @click="onDeleteButton(index, number_of_variant)">Удалить подэтап</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="long_collumn">
                                    <parametrs  :equipments="equipments"
                                                :dishes="dishes"
                                                :reagents="reagents"
                                                :params="podetap.params"">
                                    </parametrs>

                                    <parametrs_for_computing  :params_formulas="podetap.params_formulas">
                                    </parametrs_for_computing>

                                    <period_parametrs :period_parametrs="podetap.period_params">
                                    </period_parametrs>
                                    
                                    <povtor :povtor="podetap.povtor" :podetaps="podetaps" :index="index"></povtor>
                                </div>
                            </div>

                            <div class="end">
                                <button class="btn btn-info btn_green" @click="close" :disabled="control_check">Ок</button>
                            </div>
                        </div>
                    </div>
                </transition>`,
    computed: {
        control_check: function() {
            if(this.podetap.name !== "" && this.podetap.experiment_time !== "" && this.podetap.experiment_time !== null) {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        onDeleteButton: function(index, number) {
            this.$emit('delete_podetap', index, number);
        },

        podetap_number_inner: function(etapnumber, var_number, index) {
            if(this.vetvleniya.length == 2) {
                var string = etapnumber + "." + index;
                return string;
            } else {
                var string = etapnumber + ".В" + var_number + "." + index;
                return string;
            }
        },

        podetapName: function(name) {
            if(name == "") {
                return "Подэтап";
            } else {
                return name;
            }
        },

        change_add_picture: function() {
            this.podetap.add_picture = !this.podetap.add_picture;
        },

        close: function() {
            let stages = [],
                mass = [];
            this.podetaps.forEach(function (podetap){mass.push(podetap)})
            this.podetap.povtor.povtor_podetaps.forEach(function (povtor){stages.push(mass[povtor].id)})
            axios.post('/stages/sub/crud/', {
                type: 'updt',
                Stage: JSON.parse(document.getElementById('Stage').textContent),
                id: this.podetap.id,
                Name: this.podetap.name,
                risks: someornull(this.podetap.descriptions.risks),
                attention: someornull(this.podetap.descriptions.attention),
                description: someornull(this.podetap.name),
                duration: someornull(this.podetap.experiment_time),
                picture: someornull(this.podetap.add_picture),
                param: this.podetap.params,
                paramcalc: this.podetap.params_formulas,
                paramperiod: this.podetap.period_params,
                replay: {
                    check:this.podetap.povtor.check,
                    message:this.podetap.povtor.message,
                    povtor_podetaps:stages,
                },
            }).then(function(){
                Toast.add({
                    text: 'Подэтап успешно обновлен!',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подэтап не обновлен, произошла ошибка!',
                    color: '#ff0000',

                });
            });
            this.podetap.visibles = !this.podetap.visibles;
        },
    },
})

Vue.component ('settings_bar_podetaps_podetaps', {
    props: ["etapnumber", "vetvleniya", "podetap", "podpodetaps", "podetap_of_podetap", "index", "number_of_variant", "number_of_podetap", "number_of_podetap_variant", "equipments", "dishes", "reagents"],
    template:  `<transition name="fade">
                    <div class="popup_window" v-if="podetap_of_podetap.visibles">
                        <div class="window_form">
                            <div class="title_inner">
                                <h2>{{pod_podetap_number_inner(etapnumber, number_of_variant + 1, number_of_podetap + 1, number_of_podetap_variant + 1, index + 1)}} {{pod_podetapName(podetap_of_podetap.name)}}</h2>
                            </div>

                            <div class="inner__container">
                                <div class="short_collumn">
                                    <div class="etap_info">
                                        <ex_name v-model="podetap_of_podetap.name"></ex_name>
                                        <ex_time v-model="podetap_of_podetap.experiment_time"></ex_time>
                                    </div>

                                    <div class="extra_etap_info">
                                        <description    :descriptions="podetap_of_podetap.descriptions"
                                                >
                                        </description>
                                    </div>

                                    <div class="buttons_control">
                                        <h3>Кнопки управления</h3>

                                        <div class="buttons">
                                            <div class="add_picture">
                                                <button class="btn btn-info btn_add_picture" @click="change_add_picture">Возможность добавить изображение лаборанту</button>
                                                <input type="checkbox" class="picture_checkbox" v-model="podetap_of_podetap.add_picture" />
                                            </div>
                                            <div class="delete_btn_block">
                                                <button class="btn btn-danger delete_btn" @click="onDeleteButton(index, number_of_podetap_variant, number_of_podetap, number_of_variant)">Удалить подэтап</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="long_collumn">
                                    <parametrs  :equipments="equipments"
                                                :dishes="dishes"
                                                :reagents="reagents"
                                                :params="podetap_of_podetap.params">
                                    </parametrs>

                                    <parametrs_for_computing  :params_formulas="podetap_of_podetap.params_formulas">
                                    </parametrs_for_computing>

                                    <period_parametrs :period_parametrs="podetap_of_podetap.period_params">
                                    </period_parametrs>
                                    
                                    <povtor :povtor="podetap_of_podetap.povtor" :podetaps="podpodetaps" :index="index"></povtor>
                                </div>
                            </div>

                            <div class="end">
                                <button class="btn btn-info btn_green" @click="close" :disabled="control_check">Ок</button>
                            </div>
                        </div>
                    </div>
                </transition>`,
    computed: {
        control_check: function() {
            if(this.podetap_of_podetap.name !== "" && this.podetap_of_podetap.experiment_time !== "") {
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        onDeleteButton: function(index, v_p_number, p_number, v_number) {
            this.$emit('delete_pod_podetap', index, v_p_number, p_number, v_number);
        },

        podetap_number_inner: function(etapnumber, var_number, index) {
            if(this.vetvleniya.length == 2) {
                var string = etapnumber + "." + index;
                return string;
            } else {
                var string = etapnumber + ".В" + var_number + "." + index;
                return string;
            }
        },

        pod_podetap_number_inner: function(etapnumber, var_number, podetap_number, podetaps_variant_number, index) {
            var vetka = this.podetap.vetvlenie_of_podetap;

            if(vetka.length == 2) {
                var string = this.podetap_number_inner(etapnumber, var_number, podetap_number) + "." + index;
                return string;
            } else {
                var string = this.podetap_number_inner(etapnumber, var_number, podetap_number) + ".В" + podetaps_variant_number + "." + index;
                return string;
            }
        },

        pod_podetapName: function(name) {
            if(name == "") {
                return "Подэтап";
            } else {
                return name;
            }
        },

        change_add_picture: function() {
            this.podetap_of_podetap.add_picture = !this.podetap_of_podetap.add_picture;
        },

        close: function() {
            let stages = [];
            this.podetap_of_podetap.povtor.povtor_podetaps.forEach(function (povtor) {
                stages.push(povtor.id)
            })
            axios.post('/stages/sub/crud/', {
                type: 'updt',
                Stage: JSON.parse(document.getElementById('Stage').textContent),
                Name: this.podetap_of_podetap.name,
                id: this.podetap_of_podetap.id,
                risks: this.podetap_of_podetap.descriptions.risks,
                attention: this.podetap_of_podetap.descriptions.attention,
                description: this.podetap_of_podetap.name,
                duration: this.podetap_of_podetap.experiment_time,
                picture: this.podetap_of_podetap.add_picture,
                param: this.podetap_of_podetap.params,
                paramcalc: this.podetap_of_podetap.params_formulas,
                paramperiod: this.podetap_of_podetap.period_params,
                replay: {
                    check:this.podetap_of_podetap.povtor.check,
                    message:this.podetap_of_podetap.povtor.message,
                    povtor_podetaps:stages,
                },
            }).then(function(){
                Toast.add({
                    text: 'Подподэтап успешно обновлен',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подподэтап не обновлен, произошла ошибка!',
                    color: '#ff0000', delay: 100000,
                });
            });
            this.podetap_of_podetap.visibles = !this.podetap_of_podetap.visibles;
        },
    },
})

Vue.component ('parametrs', {
    props: ["equipments", "dishes", "reagents", "params"],
    data: function() {
        return {
            show: false,
            edit_show: false,

            name_inner: "",
            eq_inner: "",
            value_inner: "",
            meassure_inner: "",

            disabled: false,

            active_params: -1,
        }
    },
    template:  `<div class="parametrs">
                    <div class="title">
                        <h3>Параметры</h3>
                    </div>

                    <div class="collumn_titles" v-if="not_null(params)">
                        <div class="null">

                        </div>

                        <div class="equipm_title">
                            <p>Привязка</p>
                        </div>

                        <div class="value_title">
                            <p>Значение</p>
                        </div>

                        <div class="meassure_title">
                            <p>Ед. изм.</p>
                        </div>

                        <div class="edit_btns_title">
                        </div>
                    </div>

                    <div class="params_content">
                        <div class="params_list">
                            <div class="params" v-for="(param, index) in params">
                                <div class="params_row">
                                    <div class="name">
                                        <p>{{index + 1}}. {{param.name}}</p>
                                    </div>

                                    <div class="equipm">
                                        <p>{{equipment_text(param.eq)}}</p>
                                    </div>

                                    <div class="value">
                                        <p>{{value_text(param.value)}}</p>
                                    </div>

                                    <div class="meassure">
                                        <p>{{meassure_text(param.meassure)}}</p>
                                    </div>

                                    <div class="edit_btns">
                                        <button class="btn btn-warning edit_btn" v-on:click="edit(index)" :disabled="disabled"><i class="fa fa-pencil"></i></button>
                                        <button class="btn btn-danger edit_btn" @click="delete_param(index)" :disabled="disabled"><i class="fa fa-times"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="edit_show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <equipments :equipments="equipments"
                                            :dishes="dishes"
                                            :reagents="reagents"
                                            v-model="eq_inner"
                                            >
                                </equipments>
                                <input type="number" class="form-control input_value" v-model="value_inner" placeholder="0"/>
                                <input type="text" class="form-control input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="change(active_params)">Сохранить</button>
                                <button class="btn btn-outline-danger save" @click="edit_cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <equipments :equipments="equipments"
                                            :dishes="dishes"
                                            :reagents="reagents"
                                            v-model="eq_inner"
                                            >
                                </equipments>
                                <input type="number" class="form-control input_value" v-model="value_inner" placeholder="0"/>
                                <input type="text" class="form-control input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="addParam">Добавить</button>
                                <button class="btn btn-outline-danger save" @click="cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="button_add">
                            <button type="button" class="btn btn-info btn_green" @click="changeShow" :disabled="disabled">Добавить параметр</button>
                        </div>
                    </div>
                </div>`,
    methods: {
        changeShow: function(index) {
            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        cancel: function() {
            this.name_inner = "";
            this.eq_inner = "";
            this.value_inner = "";
            this.meassure_inner = "";

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        not_null: function(array) {
            if(array.length > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        addParam: function(index) {
            var new_par = {
                name: this.name_inner,
                eq: this.eq_inner,
                value: this.value_inner,
                meassure: this.meassure_inner,
            }

            this.params.push(new_par);

            this.name_inner = "";
            this.eq_inner = "";
            this.value_inner = "";
            this.meassure_inner = "";

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        delete_param: function(index) {
            this.params.splice(index, 1);
        },

        edit: function(index) {
            this.name_inner = this.params[index].name;
            this.eq_inner = this.params[index].eq;
            this.value_inner = this.params[index].value;
            this.meassure_inner = this.params[index].meassure;

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = index;
        },

        change: function(index) {
            var new_par = {
                name: this.name_inner,
                eq: this.eq_inner,
                value: this.value_inner,
                meassure: this.meassure_inner,
            }

            Vue.set(this.params, index, new_par);

            this.name_inner = "";
            this.eq_inner = "";
            this.value_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        edit_cancel: function() {
            this.name_inner = "";
            this.eq_inner = "";
            this.value_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        equipment_text: function(value) {
            if(value == "") {
                return "Не выбрано";
            } else {
                return value;
            }
        },

        value_text: function(value) {
            if(value == "") {
                return "-";
            } else {
                return value;
            }
        },

        meassure_text: function(value) {
            if(value == "") {
                return "-";
            } else {
                return value;
            }
        }
    },
    computed: {
        params_link: {
            get() {
                return this.value;
            },
            set(element) {
                this.$emit('input', element);
            }
        },
    }
})

Vue.component ('parametrs_for_computing', {
    props: ["params_formulas"],
    data: function() {
        return {
            show: false,
            edit_show: false,

            name_inner: "",
            variable_inner: "",
            meassure_inner: "",

            disabled: false,

            active_params: -1,
        }
    },
    template:  `<div class="parametrs">
                    <div class="title">
                        <h3>Параметры для расчетов</h3>
                    </div>

                    <div class="collumn_titles" v-if="not_null(params_formulas)">
                        <div class="computing_null">

                        </div>

                        <div class="computing_value_title">
                            <p>Значение</p>
                        </div>

                        <div class="computing_meassure_title">
                            <p>Ед. изм.</p>
                        </div>

                        <div class="edit_btns_title">
                        </div>
                    </div>

                    <div class="params_content">
                        <div class="params_list">
                            <div class="params" v-for="(param, index) in params_formulas">
                                <div class="params_row">
                                    <div class="computing_name">
                                        <p>{{index + 1}}. {{param.name}}</p>
                                    </div>

                                    <div class="computing_value">
                                        <p>{{value_text(param.variable)}}</p>
                                    </div>

                                    <div class="computing_meassure">
                                        <p>{{meassure_text(param.meassure)}}</p>
                                    </div>

                                    <div class="edit_btns">
                                        <button class="btn btn-warning edit_btn" v-on:click="edit(index)" :disabled="disabled"><i class="fa fa-pencil"></i></button>
                                        <button class="btn btn-danger edit_btn" @click="delete_param(index)" :disabled="disabled"><i class="fa fa-times"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="edit_show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <input type="number" class="form-control input_value" v-model="variable_inner" placeholder="0"/>
                                <input type="text" class="form-control input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="change(active_params)">Сохранить</button>
                                <button class="btn btn-outline-danger save" @click="edit_cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control computing_input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <input type="text" class="form-control computing_input_value" v-model="variable_inner" placeholder="Введите имя переменной"/>
                                <input type="text" class="form-control computing_input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="addParam">Добавить</button>
                                <button class="btn btn-outline-danger save" @click="cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="button_add">
                            <button type="button" class="btn btn-info btn_green" @click="changeShow" :disabled="disabled">Добавить параметр</button>
                        </div>
                    </div>
                </div>`,
    methods: {
        changeShow: function(index) {
            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        cancel: function() {
            this.name_inner = "";
            this.variable_inner = "";
            this.meassure_inner = "";

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        not_null: function(array) {
            if(array.length > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        addParam: function() {
            var new_par = {
                name: this.name_inner,
                variable: this.variable_inner,
                meassure: this.meassure_inner,
            }

            this.params_formulas.push(new_par);

            this.name_inner = "";
            this.variable_inner = "";
            this.meassure_inner = "";

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        delete_param: function(index) {
            this.params_formulas.splice(index, 1);
        },

        edit: function(index) {
            this.name_inner = this.params_formulas[index].name;
            this.variable_inner = this.params_formulas[index].variable;
            this.meassure_inner = this.params_formulas[index].meassure;

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = index;
        },

        change: function(index) {
            var new_par = {
                name: this.name_inner,
                variable: this.variable_inner,
                meassure: this.meassure_inner,
            }

            Vue.set(this.params_formulas, index, new_par);

            this.name_inner = "";
            this.variable_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        edit_cancel: function() {
            this.name_inner = "";
            this.variable_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        value_text: function(value) {
            if(value == "") {
                return "-";
            } else {
                return value;
            }
        },

        meassure_text: function(value) {
            if(value == "") {
                return "-";
            } else {
                return value;
            }
        }
    },
})

Vue.component ('period_parametrs', {
    props: ["period_parametrs"],
    data: function() {
        return {
            show: false,
            edit_show: false,

            name_inner: "",
            meassure_inner: "",

            disabled: false,

            active_params: -1,
        }
    },
    template:  `<div class="parametrs">
                    <div class="title">
                        <h3>Параметры с периодичностью</h3>
                    </div>

                    <div class="collumn_titles" v-if="not_null(period_parametrs)">
                        <div class="computing_null">

                        </div>

                        <div class="computing_meassure_title">
                            <p>Ед. изм.</p>
                        </div>

                        <div class="edit_btns_title">
                        </div>
                    </div>

                    <div class="params_content">
                        <div class="params_list">
                            <div class="params" v-for="(param, index) in period_parametrs">
                                <div class="params_row">
                                    <div class="computing_name">
                                        <p>{{index + 1}}. {{param.name}}</p>
                                    </div>

                                    <div class="computing_meassure">
                                        <p>{{meassure_text(param.meassure)}}</p>
                                    </div>

                                    <div class="edit_btns">
                                        <button class="btn btn-warning edit_btn" v-on:click="edit(index)" :disabled="disabled"><i class="fa fa-pencil"></i></button>
                                        <button class="btn btn-danger edit_btn" @click="delete_param(index)" :disabled="disabled"><i class="fa fa-times"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="edit_show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <input type="text" class="form-control input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="change(active_params)">Сохранить</button>
                                <button class="btn btn-outline-danger save" @click="edit_cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="parametrs_form" v-if="show">
                            <div class="inputs_fields">
                                <input type="text" class="form-control computing_input_name" v-model="name_inner" placeholder="Введите параметр"/>
                                <input type="text" class="form-control computing_input_meassure" v-model="meassure_inner" placeholder="Ед. изм."/>
                            </div>

                            <div class="save_button">
                                <button class="btn btn-outline-info save" @click="addParam">Добавить</button>
                                <button class="btn btn-outline-danger save" @click="cancel">Отмена</button>
                            </div>
                        </div>

                        <div class="button_add">
                            <button type="button" class="btn btn-info btn_green" @click="changeShow" :disabled="disabled">Добавить параметр</button>
                        </div>
                    </div>
                </div>`,
    methods: {
        change_period: function() {
            this.period = !this.period;
        },

        changeShow: function(index) {
            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        cancel: function() {
            this.name_inner = "";
            this.meassure_inner = "";

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        not_null: function(array) {
            if(array.length > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        addParam: function() {
            var new_par = {
                name: this.name_inner,
                meassure: this.meassure_inner,
            }

            this.period_parametrs.push(new_par);

            this.name_inner = "";
            this.variable_inner = "";
            this.meassure_inner = "";
            this.period = false;

            this.show = !this.show;
            this.disabled = !this.disabled;
        },

        delete_param: function(index) {
            this.period_parametrs.splice(index, 1);
        },

        edit: function(index) {
            this.name_inner = this.period_parametrs[index].name;
            this.meassure_inner = this.period_parametrs[index].meassure;

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = index;
        },

        change: function(index) {
            var new_par = {
                name: this.name_inner,
                meassure: this.meassure_inner,
            }

            Vue.set(this.period_parametrs, index, new_par);

            this.name_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        edit_cancel: function() {
            this.name_inner = "";
            this.meassure_inner = "";

            this.edit_show = !this.edit_show;
            this.disabled = !this.disabled;
            this.active_params = -1;
        },

        meassure_text: function(value) {
            if(value == "") {
                return "-";
            } else {
                return value;
            }
        }
    },
})

Vue.component ('description', {
    props: ["descriptions"],
    template:  `<div class="description">
                    <div class="description_inputs_forms">
                        <h3>Дополнительная информация</h3>

                        <textarea value="" class="form-control description_input"  placeholder="HSE" v-model="descriptions.attention"/>

                        <textarea value="" class="form-control description_input"  placeholder="Риски" v-model="descriptions.risks"/>
                    </div>
                </div>`,
})

Vue.component ('ex_time', {
    props: ["value"],
    template:  `<div class="extra_parametrs">
                    <div class="extra_params_form">
                        <h3>Длительность подэтапа</h3>
                        <input type="number" class="form-control" v-model="experiment_time_link" placeholder="0"/>
                    </div>
                </div>`,
    computed: {
        experiment_time_link: {
            get() {
                return this.value;
            },
            set(element) {
                this.$emit('input', element);
            }
        },
    }
})

Vue.component ('ex_name', {
    props: ["value"],
    template:  `<div class="name_form">
                    <h3>Описание подэтапа</h3>
                    <textarea type="text" placeholder="Введите описание подэтапа" class="form-control" v-model="experiment_name_link"/>
                </div>`,
    computed: {
        experiment_name_link: {
            get() {
                return this.value;
            },
            set(element) {
                this.$emit('input', element);
            }
        },
    }
})

Vue.component ('equipments', {
    props: ["equipments", "dishes", "reagents", "value"],
    data: function() {
        return {
            show: false,
        }
    },
    template:  `<div class="equipment_form">
                    <div v-bind:class="['equip_title', show ? 'on' : 'off']">
                        <h3>Привязать</h3>
                        <button @click="show = !show" class="btn_selector">
                            <icon />
                        </button>
                    </div>
                    <transition name="slide" class="slide">
                        <div class="check_form" v-show="show">
                            <div class="check_block" v-if="not_null(equipments)">
                                <div class="check_title">
                                    <h4>Оборуудование</h4>
                                </div>
                                <div class="check_input" v-for="(element, index) in equipments">
                                    <input type="radio" :value="element" v-model="eq_link">
                                    <label>{{element}}</label>
                                </div>
                            </div>

                            <div class="check_block" v-if="not_null(reagents)">
                                <div class="check_title">
                                    <h4>Реактивы</h4>
                                </div>
                                <div class="check_input" v-for="(element, index) in reagents">
                                    <input type="radio" :value="element" v-model="eq_link">
                                    <label>{{element}}</label>
                                </div>
                            </div>

                            <div class="check_block" v-if="not_null(dishes)">
                                <div class="check_title">
                                    <h4>Посуда</h4>
                                </div>
                                <div class="check_input" v-for="(element, index) in dishes">
                                    <input type="radio" :value="element" v-model="eq_link">
                                    <label>{{element}}</label>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>`,
    methods: {
        not_null: function(array) {
            if(array.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    },
    computed: {
        eq_link: {
            get() {
                return this.value;
            },
            set(element) {
                this.$emit('input', element);
            }
        },
    }
})

Vue.component ('icon', {
    template:  `<svg width="1em" height="1em" viewBox="0 0 16 16"   class="bi bi-chevron-down icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>`,
})

Vue.component ('condition_bar_podetaps', {
    props: ["podetap", "pindex", "vindex"],
    template:  `<transition name="fade">
                <div class="popup_window" v-if="podetap.vetvleniya_of_podetap_condition_visible">
                    <div class="small_window_form">
                        <div class="condition_main_title">
                            <h2>Ветвления этапа "{{podetapName(podetap.name)}}"</h2>
                        </div>

                        <div class="condition_inner_container">
                            <div class="condition_form" v-for="(condition, index) in podetap.vetvleniya_of_podetap_condition">
                                <div class="condition_title">
                                    <p>Условие для ветки {{index + 1}}</p>
                                </div>

                                <div class="condition_input">
                                    <input type="text" class="form-control" v-model="podetap.vetvleniya_of_podetap_condition[index]" placeholder="Введите условие"/>
                                </div>
                            </div>
                        </div>

                        <div class="footer_bar_inner">
                            <button class="btn btn-info btn_green" @click="close">Ок</button>
                        </div>
                    </div>
                </div>
            </transition>`,
    methods: {
        podetapName: function(name) {
            if(name == "") {
                return "Подэтап";
            } else {
                return name;
            }
        },

        close: function() {
            this.podetap.vetvleniya_of_podetap_condition_visible = !this.podetap.vetvleniya_of_podetap_condition_visible;
            axios.post('/stages/sub/crud/', {
                    type: 'parallel',
                    Stage: JSON.parse(document.getElementById('Stage').textContent),
                    parallel: this.podetap.vetvleniya_of_podetap_condition,
                    Head: 'n',
                    Number:this.vindex,
                    index:this.pindex,
                }).then(function(){
                    Toast.add({
                        text: 'Ветвление успешно добавлено!',
                    });
                }).catch(function(){
                    Toast.add({
                        text: 'Ветвление не добавлено, произошла ошибка!',
                        color: '#ff0000',
                        delay: 100000,
                    });
                });;
        }
    }
})

Vue.component ('povtor', {
    props: ["povtor", "podetaps", "index"],
    template:  `<div class="povtor">
                    <div class="povtor_title">
                        <h3>Повотрение</h3>
                    </div>

                    <div class="povtor_content">
                        <div class="povtor_column long">
                            <div class="povtor_check">
                                <div class="povtor_check_title">
                                    <h4>Повторить выполнение определенных этапов?</h4>
                                </div>

                                <input type="checkbox" class="povtor_checkbox" v-model="povtor.check" />
                            </div>

                            <textarea value="" class="form-control povtor_input"  placeholder="Введите критерий необходимости повтора предыдущих этапов" v-model="povtor.message"/>
                        </div>

                        <div class="povtor_column short">
                            <povtors_array  :podetaps="podetaps"
                                            :index="index"
                                            :povtor="povtor">
                            </povtors_array>
                        </div>
                    </div>
                </div>`,
})

Vue.component ('povtors_array', {
    props: ["podetaps", "index", "povtor"],
    data: function() {
        return {
            show: false,
            array: [],
        }
    },
    template:  `<div class="povtor_form">
                    <div v-bind:class="['povtor_form_title', show ? 'on' : 'off']">
                        <h3>Выбрать подэтапы</h3>
                        <button @click="change_show" class="btn_selector">
                            <icon />
                        </button>
                    </div>
                    <transition name="slide" class="slide">
                        <div class="povtor_check_form" v-show="show">
                            <div class="button_close_povtor">
                                <button class="btn btn-info btn_green" @click="change_show">Сохранить</button>
                            </div>
                            <div class="check_block">
                                <checkbox v-for="(podetap, number) in podetaps"
                                            :number="number"
                                            :index="index"
                                            :podetap="podetap"
                                            :val="podetap.number"
                                            v-model="array"
                                            :key="number">
                                </checkbox>
                            </div>
                        </div>
                    </transition>
                </div>`,
    methods: {
        change_show: function() {
            if(this.show) {
                this.show = !this.show;
                this.povtor.povtor_podetaps = this.array;
                this.array = [];
            } else {
                this.show = !this.show;
                this.array = this.povtor.povtor_podetaps;
            }
        },
    },
})

Vue.component('checkbox', {
    props: ['value', 'val', "number", "index", "podetap"],
    template: `<div class="check_input" v-if="number < index">
                    <input type="checkbox"
                        :value="val"
                        v-model="model">
                    <label>{{number + 1}}. {{podetap.name}}</label>
                </div>`,
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
});

new Vue ({
    el: '#wrapper',
    data: {
        etapnumber: JSON.parse(document.getElementById('Number').textContent),
        Stage: JSON.parse(document.getElementById('Stage').textContent),
        Experiment: JSON.parse(document.getElementById('Experiment').textContent),
        replay: [],
        etap_name: "Приемка проб нефти",
        variants: [
            {
                podetaps: [
                    /*
                    {
                        variants_podetps: [
                            {
                                podetaps_of_podetaps: [
                                    {
                                        name: "",
                                        visible: false,

                                        params: [
                                            {
                                                name: "",
                                                eq: "",
                                                value: "",
                                                meassure: "",
                                            }
                                        ],
                                        params_formulas: [
                                            {
                                                name: "",
                                                variable: "",
                                                meassure: "",
                                                period: false;
                                            }
                                        ],
                                        add_picture: false,
                                        experiment_times: "",
                                        descriptions: {attention: "", risks: ""},
                                        selected_eq: [],
                                        selected_siz: [],
                                    }
                                ],

                                number: 0,
                            }
                        ],

                        number: 0,
                        name: "",
                        visibles: false,

                        vetvlenie_of_podetap: [false],
                        vetvleniya_of_podetap_condition: [],
                        vetvleniya_of_podetap_condition_visible: false,
                        is_condition: false,

                        params: [
                            {
                                name: "",
                                eq: "",
                                value: "",
                                meassure: "",
                            }
                        ],
                        params_formulas: [
                            {
                                name: "",
                                variable: "",
                                meassure: "",
                                period: false;
                            }
                        ],
                        period_params: [
                            {
                                name: "",
                                variable: "",
                                meassure: "",
                                period: false;
                            }
                        ],
                        add_picture: false,
                        experiment_time: "",
                        descriptions: {attention: "", risks: ""},
                        selected_eq: [],
                        selected_siz: [],
                    }
                    */
                ],
                number: 0,
            }
        ],
        vetvleniya: [false],
        vetvleniya_condition: [],
        vetvleniya_condition_visible: false,

        //Взяты с предыдущего этапа создания проекта
        equipments: [],
        dishes: [],
        reagents: [],
    },
    computed: {
        is_vetvlenie: function() {
            if(this.vetvleniya_condition.length >= 2) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {

        Finish: function(ms) {
            window.location.href = '/stages/minicheckprepare/?Stage=' + this.Stage;
        },

        Stuffs: function(ms) {
            axios.get('/api/stage/?id='+this.Stage).then(response => {
                if (response.data[0].PreparatoryStage){
                    window.location.href = '/stages/stuffs/?Stage=' + this.Stage;
                }
                else{
                    window.location.href = '/stages/preparatory/?Stage=' + this.Stage;
                }
            })
        },

        sleep: function(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },

        addPodetap: function(index, show, item, params, calcparams, json1name) {
            //Добавляем новое ветвление
            if(this.variants[index].podetaps.length == 0) {
                var variant = {
                    podetaps: [],
                    number: this.variants[index].number + 1,
                }

                //this.variants.push(variant);
                this.vetvleniya.push(false);
                if (show != 1)
                    this.vetvleniya_condition.push("");
            }

            if(this.vetvleniya.length >= 3 && this.variants[index].podetaps.length == 0) {
                if (show != 1)
                    this.vetvleniya_condition_visible = true;
            }

            Vue.set(this.vetvleniya, index, true);
            //-----------------------------

            conditions = [];
            if (json1name != null)
            json1name.forEach(function (jsitem) {
                if (jsitem.Parent == item.id)
                    conditions.push(jsitem.Condition)

            })


            newparams =[];
            if (params != null)
            params.forEach(function(item, i, pname){
                newparams.push({
                        name: item.ParameterName,
                        eq: item.Equipment,
                        value: item.ExactValue,
                        meassure: item.Unit,
                    });
            });

            newcalcparams=[];
            newperiodparams =[];
            if (calcparams != null)
                calcparams.forEach(function(item, i, pname){
                    let newparam = {
                            name: item.ParameterName,
                            variable: item.VarName,
                            meassure: item.Unit,
                        }
                    if(item.Period == true)
                        newperiodparams.push(newparam);
                    else
                        newcalcparams.push(newparam);
                });

            if (item == null )
            {
                var item = {
                    Name: ''
                }
            }

            var podetap_number = this.variants[index].podetaps.length;

            //Добавляем новый подэтап в выбранное ветвление
            var podetap = {
                variants_podetps: [
                    {
                        podetaps_of_podetaps: [],
                        number: 0,
                    }
                ],
                id:item.id,
                number: podetap_number,
                name: item.Name,
                visibles: false,

                vetvlenie_of_podetap: [false],
                vetvleniya_of_podetap_condition: conditions,
                vetvleniya_of_podetap_condition_visible: false,
                is_condition: false,

                params: newparams,
                params_formulas: newcalcparams,
                period_params: newperiodparams,
                povtor: {
                            check: false,
                            message: item.ReplayMessage,
                            povtor_podetaps: [],
                        },
                add_picture: item.Picture,
                experiment_time: item.Duration,
                descriptions: {description: "", attention: "", risks: ""},
                selected_eq: [],
                selected_siz: [],
            }

            if (show==0)
            axios.post('/stages/sub/crud/', {
                type: 'add',
                Name: '',
                Stage:this.Stage,
                Main: this.variants[index].number,
                Number: (this.variants[index].podetaps).length,
                SubNumber: null,
                index: null
            }).then((request, response) => {
                podetap.id=request.data
                this.variants[index].podetaps.push(podetap);
                this.podetaps_visiblechange(this.variants[index].podetaps.length - 1, index);
                Toast.add({
                    text: 'Подэтап успешно добавлен!',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подэтап не добавлен, произошла ошибка!',
                    color: '#ff0000',
                    delay: 100000,
                });
            });
            else
                this.variants[index].podetaps.push(podetap);
            //----------------------------
        },

        addPod_podetap: function(v_number, p_number, index, item, show, params, calcparams) {
            //Добавляем новое ветвление
            var podetaps_var = this.variants[v_number].podetaps[p_number].variants_podetps[index];

            if(podetaps_var.podetaps_of_podetaps.length == 0) {
                var variant = {
                    podetaps_of_podetaps: [],
                    number: podetaps_var.number + 1,
                }

                this.variants[v_number].podetaps[p_number].variants_podetps.push(variant);
                this.variants[v_number].podetaps[p_number].vetvlenie_of_podetap.push(false);
                if (show != 1)
                    this.variants[v_number].podetaps[p_number].vetvleniya_of_podetap_condition.push("");

            }

            if(this.variants[v_number].podetaps[p_number].vetvlenie_of_podetap.length >= 3 && podetaps_var.podetaps_of_podetaps.length == 0) {
                if (show != 1) {
                    this.variants[v_number].podetaps[p_number].vetvleniya_of_podetap_condition_visible = true;
                }
                this.variants[v_number].podetaps[p_number].is_condition = true;
            }

            Vue.set(this.variants[v_number].podetaps[p_number].vetvlenie_of_podetap, index, true);
            //-----------------------------
            newparams =[];
            if (params != null)
            params.forEach(function(item, i, pname){
                var newparam=
                    {
                        name: item.ParameterName,
                        eq: item.Equipment,
                        value: item.ExactValue,
                        meassure: item.Unit,
                    }
                ;
                newparams.push(newparam);
            });
            newcalcparams=[];
            newperiodparams =[];
            if (calcparams != null)
                calcparams.forEach(function(item, i, pname){
                    let newparam = {
                            name: item.ParameterName,
                            variable: item.VarName,
                            meassure: item.Unit,
                        }
                    if(item.Period == true)
                        newperiodparams.push(newparam);
                    else
                        newcalcparams.push(newparam);
                });

            var podpodetap_number = podetaps_var.podetaps_of_podetaps.length;
            //Добавляем новый подэтап в выбранное ветвление
            var pod_podetap = {
                name: item.Name,
                visibles: false,
                id: item.id,
                params: newparams,
                params_formulas: newcalcparams,
                period_params: newperiodparams,
                number: podpodetap_number,
                povtor: {
                            check: false,
                            message: item.ReplayMessage,
                            povtor_podetaps: [],
                        },
                add_picture: item.Picture,
                experiment_time: item.Duration,
                descriptions: {description: item.Name, attention: item.Attention, risks: item.Risks},
                selected_eq: [],
                selected_siz: [],
            }
            if (show==0)
                axios.post('/stages/sub/crud/', {
                    type: 'add',
                    Stage:this.Stage,
                    Name: '',
                    Main: v_number,
                    Number: p_number,
                    SubNumber: null,
                    index: index
                }).then((request, response) => {
                pod_podetap.id=request.data
                pod_podetap.name = ''
                podetaps_var.podetaps_of_podetaps.push(pod_podetap);
                this.pod_podetaps_visiblechange(podetaps_var.podetaps_of_podetaps.length - 1, index, p_number, v_number)
            }).then(function(){
                Toast.add({
                    text: 'Подподэтап успешно добавлен',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подподэтап не добавлен, произошла ошибка!',
                    color: '#ff0000',
                    delay: 100000,
                });
            });
            else
                podetaps_var.podetaps_of_podetaps.push(pod_podetap);


            //----------------------------
        },

        delete_podetap: async function(index, number) {
            axios.post('/stages/sub/crud/', {
                type: 'del',
                Stage:this.Stage,
                id:this.variants[number].podetaps[index].id,
            }).then(function(){
                Toast.add({
                    text: 'Подэтап успешно удален',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подэтап не удален, произошла ошибка!',
                    color: '#ff0000',
                    delay: 100000,
                });
            });
            this.variants[number].podetaps[index].visibles = false;

            var podetaps = this.variants[number].podetaps;
            podetaps.splice(index, 1);

            if(podetaps.length == 0) {
                var len = this.variants.length;

                for (var i = number + 1; i < len; i++) {
                    this.variants[i].number = this.variants[i].number - 1
                }

                this.vetvleniya.splice(number, 1);
                this.vetvleniya_condition.splice(number, 1);
                this.variants.splice(number, 1);
            }
        },

        delete_pod_podetap: async function(index, v_p_number, p_number, v_number) {
            SubStage = this.variants[v_number].podetaps[p_number].variants_podetps[v_p_number].podetaps_of_podetaps[index]
            axios.post('/stages/sub/crud/', {
                type: 'del',
                Stage:this.Stage,
                id: SubStage.id,
            }).then(function(){
                Toast.add({
                    text: 'Подподэтап успешно удален',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Подэтап не удален, произошла ошибка!',
                    color: '#ff0000',
                    delay: 100000,
                });
            });;
            this.variants[v_number].podetaps[p_number].variants_podetps[v_p_number].podetaps_of_podetaps[index].visibles = false;

            var pod_podetaps = this.variants[v_number].podetaps[p_number].variants_podetps[v_p_number].podetaps_of_podetaps;
            pod_podetaps.splice(index, 1);

            if(pod_podetaps.length == 0) {
                var len = this.variants[v_number].podetaps[p_number].variants_podetps.length;

                for (var i = v_p_number + 1; i < len; i++) {
                    this.variants[v_number].podetaps[p_number].variants_podetps[i].number = this.variants[v_number].podetaps[p_number].variants_podetps[i].number - 1
                }

                this.variants[v_number].podetaps[p_number].vetvlenie_of_podetap.splice(v_p_number, 1);
                this.variants[v_number].podetaps[p_number].vetvleniya_of_podetap_condition.splice(v_p_number, 1);
                this.variants[v_number].podetaps[p_number].variants_podetps.splice(v_p_number, 1);
            }

            if(this.variants[v_number].podetaps[p_number].vetvlenie_of_podetap.length < 3) {
                this.variants[v_number].podetaps[p_number].is_condition = false;
            }
        },

        podetaps_visiblechange: function(index, number) {
            this.variants[number].podetaps[index].visibles = !this.variants[number].podetaps[index].visibles;
        },

        pod_podetaps_visiblechange: async function(index, v_p_number, p_number, v_number) {
            this.variants[v_number].podetaps[p_number].variants_podetps[v_p_number].podetaps_of_podetaps[index].visibles = !this.variants[v_number].podetaps[p_number].variants_podetps[v_p_number].podetaps_of_podetaps[index].visibles
        },

        podetapName: function(name) {
            if(name == "") {
                return "Подэтап";
            } else {
                return name;
            }
        },

        podetap_number: function(etapnumber, var_number, index) {
            if(this.vetvleniya.length == 2) {
                var string = etapnumber + "." + index;
                return string;
            } else {
                var string = etapnumber + ".В" + var_number + "." + index;
                return string;
            }
        },

        pod_podetap_number: function(etapnumber, var_number, podetap_number, podetaps_variant_number, index) {
            var vetka = this.variants[var_number - 1].podetaps[podetap_number - 1].vetvlenie_of_podetap;

            if(vetka.length == 2) {
                var string = this.podetap_number(etapnumber, var_number, podetap_number) + "." + index;
                return string;
            } else {
                var string = this.podetap_number(etapnumber, var_number, podetap_number) + ".В" + podetaps_variant_number + "." + index;
                return string;
            }
        },

        change_condition_visible: function() {
            this.vetvleniya_condition_visible = !this.vetvleniya_condition_visible;
            axios.post('/stages/sub/crud/', {
                type: 'parallel',
                Head: 'y',
                Stage: JSON.parse(document.getElementById('Stage').textContent),
                parallel: this.vetvleniya_condition,
            }).then(function(){
                Toast.add({
                    text: 'Ветвление подподэтапов успешно добавлено',
                });
            }).catch(function(){
                Toast.add({
                    text: 'Ветвление подподэтапов не добавлено, произошла ошибка!',
                    color: '#ff0000',
                    delay: 100000,
                });
            });;
        },

        change_podetap_condition_visible: function(number, index) {
            this.variants[number].podetaps[index].vetvleniya_of_podetap_condition_visible = !this.variants[number].podetaps[index].vetvleniya_of_podetap_condition_visible;
        }
    },
    created: async function() {
        const vm = this;
        paramsss = [];
        let equipmentsdb = await axios.get('/api/stuffs/equipment/?Stage='+vm.Stage)
        equipmentsdb.data.forEach(function (item) {
            vm.equipments.push(item.Name)
        })

        let dishesdb = await axios.get('/api/stuffs/dishes/?Stage='+vm.Stage)
        dishesdb.data.forEach(function (item) {
            vm.dishes.push(item.Name)
        })

        let reagentsdb = await axios.get('/api/stuffs/reagents/?Stage='+vm.Stage)
        reagentsdb.data.forEach(function (item) {
            vm.reagents.push(item.Name)
        })

        let replaydb = await axios.get('/api/replay/?MainStage='+vm.Stage)
        replaydb.data.forEach(function (item) {
            vm.replay.push(item)
        })

        let substagesdb = await axios.get('/api/substage/?Main='+vm.Stage)
        let parametersdb = await axios.get('/api/parameters/?Main=' + this.Stage)
        let calcparametersdb = await axios.get('/api/calcparameters/?Main=' + this.Stage)

        let json=substagesdb.data,
            json1=substagesdb.data,
            json2=substagesdb.data,
            json3=substagesdb.data,
            param = parametersdb.data,
            calcparam = calcparametersdb.data;

        json.forEach(function (item,i) {
            if (item.Parent == null){
                vm.vetvleniya_condition.push(item.Condition)
            }
        })

        var variant = {
            podetaps: [],
            number: 0,
        }
        var iter = -1;
        json.forEach(function(item, i, json){
            if (json[i].Parent == null) {
                ++iter;
                var iter1 = -1;
                json1.forEach(function (item1, i1, json1name) {
                    if (item1.Parent == item.id) {
                        ++iter1;
                        var iter2 = -1;
                        newparam = jsonGetParam(param, item1.id);
                        newcalcparam = jsonGetParam(calcparam, item1.id);
                        newPovtor = jsonGetParam(calcparam, item1.id);
                        vm.addPodetap(iter, 1, item1, newparam, newcalcparam, json1name);
                        json2.forEach(function (item2, i2, json2name) {
                            if (item1.id == item2.Parent){
                                ++iter2;
                                json3.forEach(function (item3, i3, json3name) {
                                    if (item2.id == item3.Parent){
                                        newsubparam = jsonGetParam(param, item3.id);
                                        newsubcalcparam = jsonGetParam(calcparam, item3.id);
                                        vm.addPod_podetap(iter, iter1,iter2,item3,1,newsubparam, newsubcalcparam);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

        vm.variants.forEach(function (variant) {
            variant.podetaps.forEach(function (substage) {
                vm.replay.forEach(function (repl) {
                    if (substage.id == repl.ReplaySubStage) {
                        repl.ReplaySubStage=substage.number
                    }
                })
                substage.variants_podetps.forEach(function (subvariant) {
                    subvariant.podetaps_of_podetaps.forEach(function (subsubstage, subsubNum) {
                        vm.replay.forEach(function (repl) {
                            if (subsubstage.id == repl.ReplaySubStage) {
                                repl.ReplaySubStage=subsubstage.number
                            }
                        })
                    })
                })
            })
        })


        //замена id этапа на номер на странице
        vm.variants.forEach(function (variant) {
            variant.podetaps.forEach(function (substage) {
                vm.replay.forEach(function (repl) {
                    if (substage.id == repl.ReplaySubStage) {
                        repl.ReplaySubStage=substage.number
                    }
                })
                substage.variants_podetps.forEach(function (subvariant) {
                    subvariant.podetaps_of_podetaps.forEach(function (subsubstage, subsubNum) {
                        vm.replay.forEach(function (repl) {
                            if (subsubstage.id == repl.ReplaySubStage) {
                                repl.ReplaySubStage=subsubstage.number
                            }
                        })
                    })
                })
            })
        })

        //добавление повторяющихся этапов в 'POVTOR'
        vm.variants.forEach(function (variant) {
            variant.podetaps.forEach(function (substage) {
                vm.replay.forEach(function (repl) {
                    if (substage.id == repl.SubStage){
                        substage.povtor.povtor_podetaps.push(repl.ReplaySubStage)
                        substage.povtor.check = true;
                    }
                })
                substage.variants_podetps.forEach(function (subvariant) {
                    subvariant.podetaps_of_podetaps.forEach(function (subsubstage, subsubNum) {
                        vm.replay.forEach(function (repl) {
                            if (subsubstage.id == repl.SubStage){
                                subsubstage.povtor.povtor_podetaps.push(repl.ReplaySubStage);
                                subsubstage.povtor.check = true;
                            }
                        })
                    })
                })
            })
        })

        let variant0 = vm.variants[0];
        vm.variants=[];
        vm.variants.push(variant0)
    }
})

function jsonGetParam(json, SubStage) {
    let Param = [];
    json.forEach(function (item){
        if (item.SubStage == SubStage)
            Param.push(item);
    })
    return Param;
}

function someornull(x) {
    if (x == null)
    return '';
    return x
}