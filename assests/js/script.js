
//Testiomonial Slider
document.addEventListener("DOMContentLoaded", function() {
    var testimonialsCarousel = document.querySelector(".client-testimonial");
    
    if (testimonialsCarousel) {
      var slickSettings = {
        centerMode: true,
        centerPadding: "40px",
        dots: true,
        slidesToShow: 3,
        infinite: true,
        arrows: false,
        lazyLoad: "ondemand",
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              centerMode: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      };
      
      $(testimonialsCarousel).slick(slickSettings);
    }
  });

//rpa faq section
  document.addEventListener("DOMContentLoaded", function() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      var question = item.querySelector('h3');
      var answer = item.querySelector('.answer');
      var icon = item.querySelector('h3 i');
      icon.addEventListener('click', function() {
        item.classList.toggle('active');
        icon.classList.toggle('open');
        if (item.classList.contains('active')) {
          answer.style.display = 'block';
        } else {
          answer.style.display = 'none';
        }
      });
    });
  });


//heathcare testimonial
document.addEventListener("DOMContentLoaded", function() {
  $('.testimonial-carousel').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
  });
});
window.onscroll = function() {myFunction()};

var header = document.getElementById("sticky-header");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

