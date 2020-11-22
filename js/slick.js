import 'uikit/dist/css/uikit.min.css';
import '../styles/style.scss';
import 'slick-carousel/slick/slick.scss'
import 'slick-carousel/slick/slick'

import $ from 'jquery'

// console.log(slick())

$('.my-first-slick').slick({
    autoplay: true,
    autoplaySpeed: 1000,
    appendArrows: $('.custom-arrows'),
    appendDots: $('.custom-dots'),
    dots: true,
    dotsClass: 'custom-dots__dots-list'
})
