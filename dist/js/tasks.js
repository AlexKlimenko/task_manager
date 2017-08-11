;(function($) {

    class Tasks{
        constructor() {
            this.activeTasksContainer = $('#active-task .container');
        }

        init() {
            let self = this;

            this.checkToken(self)
                .then(this.getTasks)
                .catch(this.logout)
        }

        logout() {
            window.location = '/login';
        }

        checkToken(self) {
            return new Promise(function(resolve, reject) {
                let index = document.cookie.indexOf('_id');
                let indexEnd = document.cookie.indexOf(';', index);
                let token = indexEnd === -1 ?
                                document.cookie.slice(index) :
                                    document.cookie.slice(index, indexEnd);

                if(token) resolve(self);
                else reject('Token not found');
            })
        }

        getTasks(self) {
            console.log('getting tasks...', task);
            $.ajax({
                method: 'POST',
                url:'http://localhost:8080/allTasks',
                success: function(res) {
                    self.sortTasks(res)
                        .then(self.render)
                        .catch(function(error) {
                            console.error(error);
                        })
                },
                error: function(error) {
                    console.error(error);
                },
            })
        }

        static createObjFromArr(res) {
            let tasks = {};

            res.forEach((task, i) => {
                    task.datems = Date.parse(task.date);
                    task.day = new Date(task.datems).getDate();
                    task.month = new Date(task.datems).toLocaleString('ru', {month: 'short'});

                    

                    if(tasks[res[i].date]) {
                        tasks[res[i].date].push(res[i]);
                    } else {
                        tasks[res[i].date] = [];
                        tasks[res[i].date].push(res[i]);
                    }
                });

                return tasks;
        }

        sortTasks(res) {
            console.log('sorting tasks...');
            // console.log(res);
            // console.log(this.logout);

            return new Promise(function(resolve, reject) {
                let tasks = Tasks.createObjFromArr(res);
                let activeTasks = res.filter((task) => task.status === 'undone');
                activeTasks = Tasks.createObjFromArr(activeTasks);
                let result = {
                    task,
                    activeTasks
                }

                if(tasks && activeTasks) resolve(result);
                else reject('Sort error');
            })
        }

        static renderTasksBlock(array){
            let taskmarkup = '';
            let data = Date.now();

            array.forEach((task) => {
                let taskClass = task.status !== 'undone' ? 'success' : '';
                let taskWarning = date > task.datems ? 'warning' : '';

                taskmarkup += `
                    <div class="task ${taskClass} ${taskWarning}">
                                <div class="to-do-time">${task.time}</div>
                                <div class="task-header flex-container">
                                    <span class="icon icon-arrow"></span>
                                    <span class="short-task-text">${task.text}</span>
                                    <span class="icon icon-cancel"></span>
                                </div>
                                <div class="task-content-wrap">
                                    <div class="time-row flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-time"></span>
                                        </div>
                                        <div class="time">${task.time}</div>
                                        <div class="task-icon">
                                            <span class="icon icon-bell"></span>
                                        </div>
                                    </div>
                                    <div class="task-text-row flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-list"></span>
                                        </div>
                                        <div class="text">
                                           ${task.text}
                                        </div>
                                    </div>	
                                    <div class="task-check-row check-done flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-check"></span>
                                        </div>
                                        <div class="check">
                                            <input type="checkbox" name="status" id="status">
                                            <label for="status">Я выполнил задачу</label>
                                        </div>
                                    </div>
                                    <div class="task-check-row check-current flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-check"></span>
                                        </div>
                                        <div class="check">
                                            <input type="checkbox" name="status" id="status">
                                            <label for="status">Задача еще не выполнена</label>
                                        </div>
                                    </div>
                                    <div class="task-edit-row flex-container">
                                        <span class="icon icon-edit"></span>
                                    </div>

                                </div>
                                <div class="task-message deadline">
                                    <div class="message-row flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-warning"></span>
                                        </div>
                                        <div class="text">
                                            <p>Вы не выполнили эту задачу</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="task-message done">
                                    <div class="message-row flex-container">
                                        <div class="task-icon">
                                            <span class="icon icon-star"></span>
                                        </div>
                                        <div class="text">
                                            <p>Поздравляем!</p>
                                            <p>Вы справились с задачей</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                `
            })

            return taskmarkup;
        }

        static renderTaskWrap(obj){
            console.log('renderTaskWrap', obj)
            let markup = '';

            for (let key in obj){
                markup += `
                    <div>
                        <div class="task-day" data-change-bg>
                            <span class="day">${obj[key][0].day}</span>
                            <span class="month">${obj[key][0].month}</span>
                        </div>

                        <div class="all-task-wrap">
                            ${Tasks.renderTasksBlock(obj[key])}
                        </div>
                    </div>
                `
            }

            return markup;
        }

        static task_accordion(e) {
            let parent_task = $(this).closest('.task');
            let task_content_wrap = $(parent_task).find('.task-content-wrap');

            if($(parent_task).hasClass('open')) {
                $(task_content_wrap).slideUp(500, function() {
                    $(parent_task).removeClass('open');
                });
                
            } else {
                $(task_content_wrap).slideDown(500, function() {
                    $(parent_task).addClass('open');
                });
            
            }
        }

        render(tasks) {
            console.log('rendering tasks...');
            let allTasks = tasks.tasks;
            let activeTasks = tasks.activeTasks;
            let activeTaskContent = Tasks.renderTaskWrap(activeTasks);
            let activeTasksContainer = $('#active-task' .container);
            activeTasksContainer.html(activeTaskContent);
            $('.task-header').on('click', Tasks.task_accordion);
            console.log(activeTaskContent);

        }
    }

    let loadTasks = new Tasks();
    loadTasks.init();


})(jQuery);