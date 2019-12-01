//prelucrari pentru afisarea div-urilor in functie de ce e selectat din meniu
window.onload = fillbg();
var myCanvas = document.querySelector("#myCanvas");
var context = myCanvas.getContext("2d");
//model - imaginile uploadate prin drag & drop
var myImages = [];

//actualizare - desenare pe canvas

//posibilitate de stergere

//alegere format canvas

var imageArea = document.querySelector("#imageLoader");
imageArea.ondragover = function(e) {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
};

imageArea.ondrop = function(e) {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
  let files = e.dataTransfer.files;
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onload = function(e) {
        let dest = document.querySelector("#imageLoader");
        let currImg = new Image();
        currImg.src = e.target.result;
        currImg.id = "img_" + myImages.length;
        currImg.selected = 0;
        myImages.push(currImg);
        console.log(myImages);
        console.log(currImg);
        dest.appendChild(currImg);
        var correspCB = document.createElement("input");
        correspCB.setAttribute("type", "checkbox");
        correspCB.id = "checkBox_" + (myImages.length - 1);
        correspCB.addEventListener("change", function(e) {
          var currCheckbox = e.target;
          if (currCheckbox.checked) {
            let currCheckboxId = currCheckbox.id;
            let currImgSelectedId = "img_" + currCheckboxId.split("_")[1];
            var currImgSelected = document.getElementById(currImgSelectedId);
            currImgSelected.selected = 1;
          } else currImgSelected.selected = 0;
        });
        dest.appendChild(correspCB);
      };
      reader.readAsDataURL(files[i]);
    }
  }
};

function draw(images) {
  var canvas = document.getElementsByTagName("canvas")[0];
  var context = canvas.getContext("2d");
  for (let i = 0; i < images.length; i++) {
    let myImage1 = new Image();
    myImage1.src = mySrc;
    myImage1.onload = function() {
      context.drawImage(
        myImage1,
        0,
        0,
        myImage1.width,
        myImage1.height,
        10,
        10,
        canvas.width / 2 - 10,
        canvas.height - 20
      );
    };
  }
}

//functie de salvare a colajului din canvas
function save() {
  let canvas = document.getElementsByTagName("canvas")[0];
  let button = document.getElementById("download");
  let dataURL = canvas.toDataURL("image/png");
  button.href = dataURL;
}

//functie pentru stabilirea imaginii de fundal
function fillbg() {
  let image = new Image();
  image.src = "media/pattern.png";
  image.onload = () => {
    context.fillStyle = context.createPattern(image, "repeat");
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
  };
}

function deleteSelectedImg() {
  var imagesToBeDeleted = [];
  for (let i = 0; i < myImages.length; i++) {
    if (myImages[i].selected === 1) {
      imagesToBeDeleted.push(myImages[i]);
    }
  }
  for (let i = 0; i < imagesToBeDeleted.length; i++) {
    let currCheckboxSelected = document.getElementById(
      "checkBox_" + imagesToBeDeleted[i].id.split("_")[1]
    );
    currCheckboxSelected.parentNode.removeChild(currCheckboxSelected);
    imagesToBeDeleted[i].parentNode.removeChild(imagesToBeDeleted[i]);
    let indexRemoved = myImages.indexOf(imagesToBeDeleted[i]);
    if (indexRemoved > -1) {
      myImages.splice(indexRemoved, 1);
    }
    console.log(myImages);
  }
}
