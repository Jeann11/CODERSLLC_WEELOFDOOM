window.alert ("Wheel of Doom is an Alpha. We hope to develop the next sprints soon. Sorry for the inconvenience.");

var blink = document.getElementById('blink');
  
setInterval(function () {
        blink.style.opacity = 
        (blink.style.opacity == 0 ? 1 : 0);
}, 1000); 


window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})