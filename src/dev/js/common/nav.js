;(function() {
    var $navLeft = $('#nav-left-offcanvas'), // 左侧栏
        $document = $(document), // 文档缓存
        $body = $('body'), // body缓存
        initAddUpHeight = $navLeft.length != 0 ?
                $navLeft.height() + $navLeft.offset().top + 40 - $document.height() : 0 // 初始左侧栏高度，计算防止初始高度就不够

    // 产品导航
    $('[data-gen="nav-pro"]').each(function () {
        var $cur = $(this),
            $target = $($cur.data('target')),
            proCode = $target.data('pro')

        // 生成内容
        $target.addClass('bottom nav-popover nav-popover-media nav-pro').html(
        [
            '<div class="arrow"></div>',
            '<ul>',
            '<li', proCode == 1 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.free4lab,'" target="_blank"><img src="',
            AppUrl.newfront, 'img/brand-freewings.png" alt="freewings"/></a></li>',
            '<li', proCode == 2 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.about,'" target="_blank"><img src="', AppUrl.newfront, 'img/brand-about.png" alt="about"/></a></li>',
            '<li', proCode == 3 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.iaas, '" target="_blank"><img src="', AppUrl.newfront, 'img/brand-iaas.png" alt="iaas"/></a></li>',
            '<li', proCode == 4 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.paas, '" target="_blank"><img src="', AppUrl.newfront, 'img/brand-paas.png" alt="paas"/></a></li>',
            '<li', proCode == 5 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.freeshare, '" target="_blank"><img src="', AppUrl.newfront, 'img/brand-share.png" alt="freeshare"/></a></li>',
            '<li', proCode == 6 ? ' class="nav-cur-pro"' : '',
            '><a href="', AppUrl.listword, '" target="_blank"><img src="', AppUrl.newfront, 'img/brand-column.png" alt="column"/></a></li>',
            '</ul>'
        ].join("")
        )
    })

    // 弹出菜单
    $('[data-toggle="front-popover-bottom"]').each(function() {
        var $cur = $(this),
            $target = $($cur.data('target'))

        // 点击事件
        $cur.click(function(e) {
            e.stopPropagation() // 否则全局收回

            if (!$target.hasClass('in')) {

                $cur.addClass('front-open')

                clearPopover() // 收回其他打开的popover

                $cur.trigger('show.fr.popover') // 显示之前的事件
                $target.fadeIn({queue:false, duration:'fast'}).animate({top:60}, 200).addClass('in')
            } else {
                $target.fadeOut({queue:false, duration:'fast'}).animate({top:50}, 200).removeClass('in')
                $cur.removeClass('front-open')
            }
        })
    })

    function clearPopover() {
        $('[data-toggle="front-popover-bottom"]').each(function () {
            var $cur = $(this),
                $target = $($cur.data('target'))

            // 没显示直接返回
            if (!$target.hasClass('in')) {
                return;
            }

            $cur.removeClass('front-open')

            // 显示则隐藏
            $target.fadeOut({queue:false, duration:'fast'}).animate({top:50}, 200).removeClass('in')
        })
    }

    // 弹出菜单在别处点击，收回
    $document.on('click.fr.popover', function (e) {
        clearPopover(e)
    })

    // 左侧导航栏子菜单触发
    $('[data-toggle="front-nav-left-sub"]').each(function () {
        var $cur = $(this),
            $target = $($cur.data('target')),
            icon = $cur.children('span.glyphicon'),
            addUpHeight = 0 // 页面高度调整增量

        $cur.click(function (event) {
            event.preventDefault()

            if (!$target.hasClass('open')) {
                $target.slideDown(200, function () {
                    $target.addClass('open')
                    icon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')

                    addUpHeight = $navLeft.height() + $navLeft.offset().top + 40 - $document.height()

                    if (addUpHeight > 0) { // 调整高度
                        $body.height($body.height() + addUpHeight)
                    }
                })
            } else {
                $target.slideUp(200, function () {
                    $target.removeClass('open')
                    icon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')

                    if (addUpHeight > 0) { // 恢复高度
                        $body.height($body.height() - addUpHeight)
                        addUpHeight = 0
                    }
                })
            }
        })
    })

    // 左侧导航栏图片加载
    var $sideBarToggle = $('#front-nav-toggle-left').attr('src', AppUrl.newfront + 'img/sidebar-toggle.png')

    if ($sideBarToggle.length) {
        // 左侧导航栏触发
        $sideBarToggle.click(sidebarToggle)

        // 左侧导航栏中的点击事件停止冒泡
        $navLeft.on('click', function (e) {
            e.stopPropagation()
        })

        // 触发后点击其他地方收回
        if ($sideBarToggle.css('display') == 'block') { // 移动端
            $document.on('click.fr.sidebar', function () {
                var $canvas = $('#front-canvas')

                if ($canvas.hasClass('open')) {
                    $canvas.removeClass('open')
                    $navLeft.removeClass('open')

                    if (initAddUpHeight > 0) { // 恢复高度
                        $body.height($body.height() - initAddUpHeight)
                    }

                    $sideBarToggle.css('display',"");
                }
            })
        }
    }

    function sidebarToggle(e) {
        var $cur = $(this),
            $canvas = $('#front-canvas')

        e.stopPropagation() // 防止左侧栏收回

        if (!$canvas.hasClass('open')) {
            $canvas.addClass('open')
            $navLeft.addClass('open')

            if (initAddUpHeight > 0) { // 调整高度
                $body.height($body.height() + initAddUpHeight)
            }

            $sideBarToggle.css('display', 'none')
        }
    }

    // FIX IOS Safari 点击别处左侧栏不能收回的问题
    // The trick
    // http://stackoverflow.com/questions/10165141/jquery-on-and-delegate-doesnt-work-on-ipad
    if (/ip(hone|od)|ipad/i.test(navigator.userAgent)) {
        $("body").css ("cursor", "pointer");
    }
})();