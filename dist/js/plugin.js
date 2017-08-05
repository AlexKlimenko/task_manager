;(function($) {
    let add_task_btn = $('.add-task');
    let edit_modal = $('.edit-task');
    let overlay = $('.overlay');
    let task_link = $('.toggle-task-list a');
    let task_content = $('.task-content');
    let task_header = $('.task-header');

    function open_edit_modal(e) {
        $([overlay, edit_modal]).toggleClass('open');
    }

    function tab_task(e) {
        e.preventDefault();
        let activeBlock = $(this).attr('href');
        $(task_link).removeClass('active');
        $(task_content).removeClass('active');
        $(this).addClass('active');
        $(activeBlock).addClass('active');
    }

    function task_accordion(e) {
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

    add_task_btn.on('click', open_edit_modal);
    overlay.on('click', open_edit_modal);
    task_link.on('click', tab_task);
    task_header.on('click', task_accordion);
})(jQuery);



(function($) {
    let li = $('.change-color li');
    let changed_blocks = $('[data-change-bg]');
    let color = localStorage.getItem('bg-color') || '00a1f1';


    function setColor(color) {
         changed_blocks.each(function(i, el) {
            $(el).css("background-color", color);
        })
    }

    li.each(function(i, el) {
        let color = $(el).attr('data-bg');
        $(el).css("background-color", color);
        console.log(color)
    });

    li.on('click', function(e) {
        let color = $(this).attr('data-bg');

        setColor(color);

        localStorage.setItem('bg-color', color);
    })
    setColor(color);
})(jQuery);


//PRELOAD///////////////////////
(function($) {
    let loader = $('#loading');
    $(document).ready(function(e) {
        loader.addClass('hide');
    })
})(jQuery);
