'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    var Tasks = function () {
        function Tasks() {
            _classCallCheck(this, Tasks);

            this.activeTasksContainer = $('#active-task .container');
        }

        _createClass(Tasks, [{
            key: 'init',
            value: function init() {
                var self = this;

                this.checkToken(self).then(this.getTasks).catch(this.logout);
            }
        }, {
            key: 'logout',
            value: function logout() {
                window.location = '/login';
            }
        }, {
            key: 'checkToken',
            value: function checkToken(self) {
                return new Promise(function (resolve, reject) {
                    var index = document.cookie.indexOf('_id');
                    var indexEnd = document.cookie.indexOf(';', index);
                    var token = indexEnd === -1 ? document.cookie.slice(index) : document.cookie.slice(index, indexEnd);

                    if (token) resolve(self);else reject('Token not found');
                });
            }
        }, {
            key: 'getTasks',
            value: function getTasks(self) {
                console.log('getting tasks...', task);
                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:8080/allTasks',
                    success: function success(res) {
                        self.sortTasks(res).then(self.render).catch(function (error) {
                            console.error(error);
                        });
                    },
                    error: function error(_error) {
                        console.error(_error);
                    }
                });
            }
        }, {
            key: 'sortTasks',
            value: function sortTasks(res) {
                console.log('sorting tasks...');
                // console.log(res);
                // console.log(this.logout);

                return new Promise(function (resolve, reject) {
                    var tasks = Tasks.createObjFromArr(res);
                    var activeTasks = res.filter(function (task) {
                        return task.status === 'undone';
                    });
                    activeTasks = Tasks.createObjFromArr(activeTasks);
                    var result = {
                        task: task,
                        activeTasks: activeTasks
                    };

                    if (tasks && activeTasks) resolve(result);else reject('Sort error');
                });
            }
        }, {
            key: 'render',
            value: function render(tasks) {
                console.log('rendering tasks...');
                var allTasks = tasks.tasks;
                var activeTasks = tasks.activeTasks;
                var activeTaskContent = Tasks.renderTaskWrap(activeTasks);
                var activeTasksContainer = $('#active-task'.container);
                activeTasksContainer.html(activeTaskContent);
                $('.task-header').on('click', Tasks.task_accordion);
                console.log(activeTaskContent);
            }
        }], [{
            key: 'createObjFromArr',
            value: function createObjFromArr(res) {
                var tasks = {};

                res.forEach(function (task, i) {
                    task.datems = Date.parse(task.date);
                    task.day = new Date(task.datems).getDate();
                    task.month = new Date(task.datems).toLocaleString('ru', { month: 'short' });

                    if (tasks[res[i].date]) {
                        tasks[res[i].date].push(res[i]);
                    } else {
                        tasks[res[i].date] = [];
                        tasks[res[i].date].push(res[i]);
                    }
                });

                return tasks;
            }
        }, {
            key: 'renderTasksBlock',
            value: function renderTasksBlock(array) {
                var taskmarkup = '';
                var data = Date.now();

                array.forEach(function (task) {
                    var taskClass = task.status !== 'undone' ? 'success' : '';
                    var taskWarning = date > task.datems ? 'warning' : '';

                    taskmarkup += '\n                    <div class="task ' + taskClass + ' ' + taskWarning + '">\n                                <div class="to-do-time">' + task.time + '</div>\n                                <div class="task-header flex-container">\n                                    <span class="icon icon-arrow"></span>\n                                    <span class="short-task-text">' + task.text + '</span>\n                                    <span class="icon icon-cancel"></span>\n                                </div>\n                                <div class="task-content-wrap">\n                                    <div class="time-row flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-time"></span>\n                                        </div>\n                                        <div class="time">' + task.time + '</div>\n                                        <div class="task-icon">\n                                            <span class="icon icon-bell"></span>\n                                        </div>\n                                    </div>\n                                    <div class="task-text-row flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-list"></span>\n                                        </div>\n                                        <div class="text">\n                                           ' + task.text + '\n                                        </div>\n                                    </div>\t\n                                    <div class="task-check-row check-done flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-check"></span>\n                                        </div>\n                                        <div class="check">\n                                            <input type="checkbox" name="status" id="status">\n                                            <label for="status">\u042F \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B \u0437\u0430\u0434\u0430\u0447\u0443</label>\n                                        </div>\n                                    </div>\n                                    <div class="task-check-row check-current flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-check"></span>\n                                        </div>\n                                        <div class="check">\n                                            <input type="checkbox" name="status" id="status">\n                                            <label for="status">\u0417\u0430\u0434\u0430\u0447\u0430 \u0435\u0449\u0435 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430</label>\n                                        </div>\n                                    </div>\n                                    <div class="task-edit-row flex-container">\n                                        <span class="icon icon-edit"></span>\n                                    </div>\n\n                                </div>\n                                <div class="task-message deadline">\n                                    <div class="message-row flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-warning"></span>\n                                        </div>\n                                        <div class="text">\n                                            <p>\u0412\u044B \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u043B\u0438 \u044D\u0442\u0443 \u0437\u0430\u0434\u0430\u0447\u0443</p>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class="task-message done">\n                                    <div class="message-row flex-container">\n                                        <div class="task-icon">\n                                            <span class="icon icon-star"></span>\n                                        </div>\n                                        <div class="text">\n                                            <p>\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C!</p>\n                                            <p>\u0412\u044B \u0441\u043F\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u0441 \u0437\u0430\u0434\u0430\u0447\u0435\u0439</p>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                ';
                });

                return taskmarkup;
            }
        }, {
            key: 'renderTaskWrap',
            value: function renderTaskWrap(obj) {
                console.log('renderTaskWrap', obj);
                var markup = '';

                for (var key in obj) {
                    markup += '\n                    <div>\n                        <div class="task-day" data-change-bg>\n                            <span class="day">' + obj[key][0].day + '</span>\n                            <span class="month">' + obj[key][0].month + '</span>\n                        </div>\n\n                        <div class="all-task-wrap">\n                            ' + Tasks.renderTasksBlock(obj[key]) + '\n                        </div>\n                    </div>\n                ';
                }

                return markup;
            }
        }, {
            key: 'task_accordion',
            value: function task_accordion(e) {
                var parent_task = $(this).closest('.task');
                var task_content_wrap = $(parent_task).find('.task-content-wrap');

                if ($(parent_task).hasClass('open')) {
                    $(task_content_wrap).slideUp(500, function () {
                        $(parent_task).removeClass('open');
                    });
                } else {
                    $(task_content_wrap).slideDown(500, function () {
                        $(parent_task).addClass('open');
                    });
                }
            }
        }]);

        return Tasks;
    }();

    var loadTasks = new Tasks();
    loadTasks.init();
})(jQuery);