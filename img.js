window.onload = function (){
    console.log("This is working.")
    
    var png = document.getElementById("png");
    console.log(png);
    
    png.addEventListener("mouseover", hoverHandler);
    png.addEventListener("mouseout", nohoverHandler);
    
}

function hoverHandler (){
    
    png.style.backgroundImage = "url(https://strovi.neocities.org/flair/aa2.png)";
        
    
    
}

function nohoverHandler (){
    
    png.style.backgroundImage = "url(https://strovi.neocities.org/flair/aa.png)";
    
}
    