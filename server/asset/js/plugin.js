'use strict';

;(function ($) {
    var add_task_btn = $('.add-task');
    var edit_modal = $('.edit-task');
    var overlay = $('.overlay');
    var task_link = $('.toggle-task-list a');
    var task_content = $('.task-content');
    var task_header = $('.task-header');

    function open_edit_modal(e) {
        $([overlay, edit_modal]).toggleClass('open');
    }

    function tab_task(e) {
        e.preventDefault();
        var activeBlock = $(this).attr('href');
        $(task_link).removeClass('active');
        $(task_content).removeClass('active');
        $(this).addClass('active');
        $(activeBlock).addClass('active');
    }

    // function task_accordion(e) {
    //     let parent_task = $(this).closest('.task');
    //     let task_content_wrap = $(parent_task).find('.task-content-wrap');

    //     if($(parent_task).hasClass('open')) {
    //         $(task_content_wrap).slideUp(500, function() {
    //             $(parent_task).removeClass('open');
    //         });

    //     } else {
    //         $(task_content_wrap).slideDown(500, function() {
    //              $(parent_task).addClass('open');
    //         });

    //     }
    // }

    add_task_btn.on('click', open_edit_modal);
    overlay.on('click', open_edit_modal);
    task_link.on('click', tab_task);
    // task_header.on('click', task_accordion);
})(jQuery);

(function ($) {
    var li = $('.change-color li');
    var changed_blocks = $('[data-change-bg]');
    var color = localStorage.getItem('bg-color') || '00a1f1';

    function setColor(color) {
        changed_blocks.each(function (i, el) {
            $(el).css("background-color", color);
        });
    }

    li.each(function (i, el) {
        var color = $(el).attr('data-bg');
        $(el).css("background-color", color);
    });

    li.on('click', function (e) {
        var color = $(this).attr('data-bg');

        setColor(color);

        localStorage.setItem('bg-color', color);
    });
    setColor(color);
})(jQuery);

//PRELOAD///////////////////////
(function ($) {
    var loader = $('#loading');
    $(document).ready(function (e) {
        loader.addClass('hide');
    });
})(jQuery);