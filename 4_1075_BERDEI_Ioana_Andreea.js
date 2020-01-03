var myCanvas = document.querySelector("#myCanvas");
var context = myCanvas.getContext("2d");
//model - imaginile uploadate prin drag & drop
var myImages = [];

//INITIALIZARE MODEL - incarcarea imaginilor prin drag & drop
var imageArea = document.querySelector("#imageLoader");
imageArea.ondragover = e => {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
};
imageArea.ondrop = e => {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
  let files = e.dataTransfer.files;
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.onload = e => {
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
        correspCB.addEventListener("change", e => {
          var currImgSelected;
          var currCheckbox = e.target;
          if (currCheckbox.checked) {
            let currCheckboxId = currCheckbox.id;
            let currImgSelectedId = "img_" + currCheckboxId.split("_")[1];
            currImgSelected = document.getElementById(currImgSelectedId);
            currImgSelected.selected = 1;
          }
          console.log(currImgSelected);
        });
        dest.appendChild(correspCB);
      };
      reader.readAsDataURL(files[i]);
    }
  }
};

//ACTUALIZARE MODEL -> SABLON 1 - desenarea unui numar de imagini pe verticala
function drawVertical(images) {
  for (var i = 0; i < images.length; i++) {
    let currentImage = images[i];
    //imageHeight & imageHeight -> inaltimea si latimea pe care o are imaginea pe canvas
    var imageHeight, imageWidth, x, y;
    //verificam daca imaginea are orientarea portret sau peisaj
    let currentImageRatio = currentImage.width / currentImage.height;
    let myCanvasRatio = myCanvas.width / images.length / myCanvas.height; //se imparte la numarul imaginilor pentru a imparti canvasul in sectiuni pentru fiecare imagine
    //latimea canvasului este mai mare decat cea a imaginii
    //imaginea e portret
    if (currentImageRatio < myCanvasRatio) {
      //pentru a putea fi vizibile marginile de 10 sus si 10 jos scadem 20 din inaltime
      imageHeight = myCanvas.height - 20;
      //scalare -> pentru inaltimea canvasului modificam latimea a.i. sa se pastreze aspectul imaginii
      imageWidth = currentImage.width * (imageHeight / currentImage.height);
      //centrare pe orizontala
      x =
        (i * myCanvas.width - 20) / images.length +
        (myCanvas.width / images.length - imageWidth) / 2;
      //marginea de 10
      y = 10;
    }
    //latimea imaginii este mai mare decat cea a canvasului
    //imaginea e landscape
    else if (currentImageRatio > myCanvasRatio) {
      //pentru a putea fi vizibile marginile 10 stanga si 10 dreapta scadem 20 din latime
      imageWidth = myCanvas.width / images.length - 20;
      //scalare -> pentru latimea canvasului modificam inltimea a.i. sa se pastreze aspectul imaginii
      imageHeight = currentImage.height * (imageWidth / currentImage.width);
      x = 10 + (i * myCanvas.width) / images.length;
      //centrare pe verticala
      y = (myCanvas.height - imageHeight) / 2;
    } else {
      //imaginea nu necesita prelucrari suplimentare asupra aspectului
      imageHeight = myCanvas.height - 20;
      imageWidth = myCanvas.width / images.length - 20;
      x = 10 + (i * myCanvas.width) / images.length;
      y = 10;
    }
    context.drawImage(currentImage, x, y, imageWidth, imageHeight);
  }
}

//actulaizare model -> SABLON 2 - desenarea unui numar de imagini pe orizontala
function drawHorizontal(images) {
  for (var i = 0; i < images.length; i++) {
    let currentImage = images[i];
    //imageHeight & imageHeight -> inaltimea si latimea pe care o are imaginea pe canvas
    var imageHeight, imageWidth, x, y;
    //pentru a putea fi vizibile marginile de 10 sus si 10 jos scadem 20 din inaltime
    imageHeight = myCanvas.height / images.length - 20;
    //scalare -> pentru inaltimea canvasului modificam latimea a.i. sa se pastreze aspectul imaginii
    imageWidth = currentImage.width * (imageHeight / currentImage.height);
    //centrare pe orizontala
    x = (myCanvas.width - imageWidth) / 2;
    //marginea de 10
    y = 10 + (i * myCanvas.height) / images.length;
    context.drawImage(currentImage, x, y, imageWidth, imageHeight);
  }
}
//actualizare model -> SABLON 3 - desenarea a 3 imagini, una in jumatatea de sus, doua in jumatatea de jos
function drawSplitTrio(images) {
  let image1 = images[0];
  let image2 = images[1];
  let image3 = images[2];
  var x1,
    x2,
    x3,
    y1,
    y2,
    imageHeight1,
    imageHeight2,
    imageWidth1,
    imageWidth2,
    imageWidth3;
  //prima imagine ocupa prima jumatate a canvasului, pe orizontala
  imageHeight1 = myCanvas.height / 2 - 20;
  imageWidth1 = image1.width * (imageHeight1 / image1.height);
  x1 = (myCanvas.width - imageWidth1) / 2;
  y1 = 10;
  context.drawImage(image1, x1, y1, imageWidth1, imageHeight1);

  //celelalte doua imagini ocupa cate jumatate din cealalta jumatate a canvasului, pe orizontala
  imageHeight2 = myCanvas.height / 2 - 20;
  imageWidth2 = image2.width * (imageHeight2 / image2.height);
  imageWidth3 = image3.width * (imageHeight2 / image3.height);
  x2 = (myCanvas.width / 2 - imageWidth2) / 2;
  y2 = myCanvas.height / 2 + 10;
  x3 = myCanvas.width / 2 + (myCanvas.width / 2 - imageWidth3) / 2;
  context.drawImage(image2, x2, y2, imageWidth2, imageHeight2);
  context.drawImage(image3, x3, y2, imageWidth3, imageHeight2);
}
//actualizare model -> SABLON 4 - desenarea a 4 imagini, fiecare ocupand cate un sfert din canvas
function drawQuarter(images) {
  let image1 = images[0];
  let image2 = images[1];
  let image3 = images[2];
  let image4 = images[3];
  var x1,
    x2,
    x3,
    x4,
    y1,
    y2,
    imageWidth1,
    imageWidth2,
    imageWidth3,
    imageWidth4,
    imageHeight;

  imageHeight = myCanvas.height / 2 - 20;
  imageWidth1 = image1.width * (imageHeight / image1.height);
  imageWidth2 = image2.width * (imageHeight / image2.height);
  imageWidth3 = image3.width * (imageHeight / image3.height);
  imageWidth4 = image4.width * (imageHeight / image4.height);
  x1 = (myCanvas.width / 2 - imageWidth1) / 2;
  x2 = (myCanvas.width / 2 - imageWidth2) / 2 + myCanvas.width / 2;
  x3 = (myCanvas.width / 2 - imageWidth3) / 2;
  x4 = (myCanvas.width / 2 - imageWidth4) / 2 + myCanvas.width / 2;
  y1 = 10;
  y2 = myCanvas.height / 2 + 10;
  context.drawImage(image1, x1, y1, imageWidth1, imageHeight);
  context.drawImage(image2, x2, y1, imageWidth2, imageHeight);
  context.drawImage(image3, x3, y2, imageWidth3, imageHeight);
  context.drawImage(image4, x4, y2, imageWidth4, imageHeight);
}
//functie de salvare a colajului din canvas
function save() {
  let button = document.getElementById("download");
  let dataURL = myCanvas.toDataURL("image/png");
  button.href = dataURL;
}

//posibilitate selectare imagine de fundal (predefinita)
//pentru canvas, la apasarea unui buton
//se preia instanta butonului
let buttonBg = document.querySelector("#buttonSelectBg");
//handle pentru evenimentul de click
buttonBg.addEventListener("click", () => {
  let backgroundImage = new Image();
  backgroundImage.src = "media/pattern.jpg";
  backgroundImage.onload = () => {
    context.fillStyle = context.createPattern(backgroundImage, "repeat");
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
  };
});

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

function getSelectedImages() {
  let selectedImages = [];
  for (let i = 0; i < myImages.length; i++) {
    if (myImages[i].selected === 1) {
      selectedImages.push(myImages[i]);
    }
  }
  return selectedImages;
}

function drawSelectedImgs() {
  var selectedImages = getSelectedImages();
  var noPhotos = document.querySelector("#noPhotos").value;
  var template = document.querySelector("#template").value;
  console.log(selectedImages.length);
  console.log(noPhotos);
  if (selectedImages.length == 0)
    alert("Trebuie să selectați măcar o imagine pentru desenare!");
  else if (selectedImages.length != noPhotos) {
    alert(
      "Numărul de fotografii alese nu este același cu numărul de fotografii suportate de template-ul selectat!"
    );
  } else {
    if (template == 1) {
      drawVertical(selectedImages);
    } else if (template == 2) {
      drawHorizontal(selectedImages);
    } else if (template == 3 && selectedImages.length == 3) {
      drawSplitTrio(selectedImages);
    } else if (template == 4 && selectedImages.length == 4) {
      drawQuarter(selectedImages);
    }
  }
}
