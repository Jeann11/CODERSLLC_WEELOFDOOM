window.alert ("Welcome for the Wheel of Doom.");
window.addEventListener("load", function(){
    setTimeout(
        function open(event){
            document.querySelector(".popup").style.display = "block";
        },
        1000
    )
});

document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
});

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