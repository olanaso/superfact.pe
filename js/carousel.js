$(document).ready(function() {
    $(".carousel").slick({
        lazyLoad: 'ondemand',
        autoplay: true
    });

    $(".carousel-items").slick({
        infinite: true,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        infinite: true
    });
});
