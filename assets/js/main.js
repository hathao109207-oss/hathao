(function ($) {
    "use strict";

    $(document).ready(function($){
        
        // testimonial sliders
        $(".testimonial-sliders").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:1,
                    nav:false
                },
                1000:{
                    items:1,
                    nav:false,
                    loop:true
                }
            }
        });

        // homepage slider
        $(".homepage-slider").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            nav: true,
            dots: false,
            navText: ['<i class="fas fa-angle-left"></i>', '<i class="fas fa-angle-right"></i>'],
            responsive:{
                0:{
                    items:1,
                    nav:false,
                    loop:true
                },
                600:{
                    items:1,
                    nav:true,
                    loop:true
                },
                1000:{
                    items:1,
                    nav:true,
                    loop:true
                }
            }
        });

        // promo carousel
        $(".promo-carousel").owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            autoplayTimeout: 3000,
            margin: 20,
            nav: false,
            dots: false,
            responsive:{
                0:{ items:1 },
                576:{ items:2 },
                992:{ items:3 },
                1200:{ items:4 }
            }
        });

        // logo carousel
        $(".logo-carousel-inner").owlCarousel({
            items: 4,
            loop: true,
            autoplay: true,
            margin: 30,
            responsive:{
                0:{
                    items:1,
                    nav:false
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:4,
                    nav:false,
                    loop:true
                }
            }
        });

        // count down
        if($('.time-countdown').length){  
            $('.time-countdown').each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
                var $this = $(this).html(event.strftime('' + '<div class="counter-column"><div class="inner"><span class="count">%D</span>Days</div></div> ' + '<div class="counter-column"><div class="inner"><span class="count">%H</span>Hours</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%M</span>Mins</div></div>  ' + '<div class="counter-column"><div class="inner"><span class="count">%S</span>Secs</div></div>'));
            });
         });
        }

        // projects filters isotop
        $(".product-filters li").on('click', function () {
            
            $(".product-filters li").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr('data-filter');

            $(".product-lists").isotope({
                filter: selector,
            });
            
        });
        
        // isotop inner
        $(".product-lists").isotope();

        // magnific popup
        $('.popup-youtube').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        // light box
        $('.image-popup-vertical-fit').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            mainClass: 'mfp-img-mobile',
            image: {
                verticalFit: true
            }
        });

        // homepage slides animations
        $(".homepage-slider").on("translate.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").removeClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").removeClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

        $(".homepage-slider").on("translated.owl.carousel", function(){
            $(".hero-text-tablecell .subtitle").addClass("animated fadeInUp").css({'opacity': '0'});
            $(".hero-text-tablecell h1").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.3s'});
            $(".hero-btns").addClass("animated fadeInUp").css({'opacity': '0', 'animation-delay' : '0.5s'});
        });

       

        // stikcy js
        $("#sticker").sticky({
            topSpacing: 0
        });

        //mean menu
        $('.main-menu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: "992"
        });
        
         // search form
        $(".search-bar-icon").on("click", function(){
            $(".search-area").addClass("search-active");
        });

        $(".close-btn").on("click", function() {
            $(".search-area").removeClass("search-active");
        });
    
    });


    jQuery(window).on("load",function(){
        jQuery(".loader").fadeOut(1000);
    });

    // ============================================================
    // Form Loading States
    // ============================================================
    $('form').on('submit', function() {
        var $btn = $(this).find('button[type="submit"]');
        if ($btn.length && !$btn.hasClass('no-loading')) {
            var originalHtml = $btn.html();
            $btn.prop('disabled', true).data('original-html', originalHtml);
            $btn.html('<i class="fas fa-spinner fa-spin"></i> Đang xử lý...');
        }
    });

    // ============================================================
    // Real-time Form Validation
    // ============================================================
    $('.form-control').on('blur', function() {
        var $input = $(this);
        var value = $input.val().trim();
        var isValid = true;

        if ($input.prop('required') && value === '') {
            isValid = false;
        }

        if ($input.attr('type') === 'email' && value !== '') {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if ($input.attr('minlength') && value.length > 0 && value.length < parseInt($input.attr('minlength'))) {
            isValid = false;
        }

        if ($input.attr('name') === 'phone' && value !== '') {
            isValid = /^[0-9]{10,11}$/.test(value);
        }

        $input.removeClass('is-valid is-invalid');
        if (value !== '') {
            $input.addClass(isValid ? 'is-valid' : 'is-invalid');
        }
    });

    // Password match validation
    $('input[name="confirm_password"]').on('input', function() {
        var $input = $(this);
        var newPassword = $('input[name="new_password"]').val();
        var isValid = $input.val() === newPassword && $input.val().length >= 6;
        $input.removeClass('is-valid is-invalid');
        if ($input.val() !== '') {
            $input.addClass(isValid ? 'is-valid' : 'is-invalid');
        }
    });

    // ============================================================
    // Auto-dismiss Toast Notifications
    // ============================================================
    $('.toast').each(function() {
        var $toast = $(this);
        setTimeout(function() {
            $toast.fadeOut(300, function() { $(this).remove(); });
        }, 4000);
    });

}(jQuery));
