//preluare canvas si context
var myCanvas = document.querySelector("#myCanvas");
var context = myCanvas.getContext("2d");

//model - imaginile uploadate prin drag & drop
var myImages = [];

//sunete folosite in app
var dingSound = new Audio("./media/ding.mp3");
var sparklesSound = new Audio("./media/sparkle.mp3");
var selectedSound = new Audio("./media/select.mp3");

//INITIALIZARE MODEL - incarcarea imaginilor prin drag & drop
var imageArea = document.querySelector("#imageLoader");
imageArea.ondragover = e => {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
};
imageArea.ondrop = e => {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
  let files = e.dataTransfer.files;
  if (files.length > 0) {
    //pentru toate imaginile incarcate
    for (let i = 0; i < files.length; i++) {
      //cu ajutorul unui filereader
      let reader = new FileReader();
      reader.onload = e => {
        let dest = document.querySelector("#imageLoader");
        //se creeaza o imagine noua si se adauga elementul in DOM
        let currImg = new Image();
        currImg.src = e.target.result;
        currImg.id = "img_" + myImages.length;
        currImg.selected = 0;
        myImages.push(currImg);
        dest.appendChild(currImg);
        //se adauga in DOM si checkboxurile corespunzatorare fiecarei imagini
        var correspCB = document.createElement("input");
        correspCB.setAttribute("type", "checkbox");
        correspCB.id = "checkBox_" + (myImages.length - 1);
        //handle eveniment de change pentru fiecare checkbox
        //sunet
        dingSound.play();
        correspCB.addEventListener("change", e => {
          var currImgSelected;
          var currCheckbox = e.target;
          var currCheckboxId = currCheckbox.id;
          var currImgSelectedId = "img_" + currCheckboxId.split("_")[1];
          currImgSelected = document.getElementById(currImgSelectedId);
          //sunet
          selectedSound.play();
          if (currCheckbox.checked) {
            currImgSelected.selected = 1;
          }
          if (currCheckbox.checked == false) {
            currImgSelected.selected = 0;
          }
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

//ACTUALIZARE MODEL -> SABLON 2 - desenarea unui numar de imagini pe orizontala
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

//ACTUALIZARE MODEL -> SABLON 3 - desenarea a 3 imagini, una in jumatatea de sus, doua in jumatatea de jos
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

//ACTUALIZARE MODEL -> SABLON 4 - desenarea a 4 imagini, fiecare ocupand cate un sfert din canvas
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
  //toate imaginile vor avea aceeasi inaltime, scalarea se va face pe latime
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

//event handler pentru adaugarea dinamica a optiunilor suplimentare pentru template-urile 3 si 4
let selectNoPhotos = document.querySelector("#noPhotos");
selectNoPhotos.addEventListener("change", () => {
  let selectTemplate = document.querySelector("#template");
  let newOption = document.createElement("option");
  if (selectNoPhotos.value == 3) {
    selectTemplate.options[2] = null;
    newOption.text = "3";
    newOption.value = "3";
    selectTemplate.appendChild(newOption);
  } else if (selectNoPhotos.value == 4) {
    selectTemplate.options[2] = null;
    newOption.text = "4";
    newOption.value = "4";
    selectTemplate.appendChild(newOption);
  } else {
    selectTemplate.options[2] = null;
  }
});

//posibilitate selectare imagine de fundal (predefinita)
//pentru canvas, la apasarea unui buton
//se preia instanta butonului
let buttonBg = document.querySelector("#buttonSelectBg");
//handler pentru evenimentul de click
buttonBg.addEventListener("click", () => {
  let backgroundImage = new Image();
  backgroundImage.src = "media/pattern.jpg";
  backgroundImage.onload = () => {
    context.fillStyle = context.createPattern(backgroundImage, "repeat");
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
  };
  //sunet
  dingSound.play();
});

//functie pentru stergerea imaginii selectate
function deleteSelectedImg() {
  var imagesToBeDeleted = [];
  //se preiau imaginile ce trebuiesc a fi sterse
  for (let i = 0; i < myImages.length; i++) {
    if (myImages[i].selected === 1) {
      imagesToBeDeleted.push(myImages[i]);
    }
  }
  //se gaseste fiecare checkbox selectat corespunzator unei imagini
  for (let i = 0; i < imagesToBeDeleted.length; i++) {
    let currCheckboxSelected = document.getElementById(
      "checkBox_" + imagesToBeDeleted[i].id.split("_")[1]
    );
    //se elimina din DOM si din lista de imagini
    currCheckboxSelected.parentNode.removeChild(currCheckboxSelected);
    imagesToBeDeleted[i].parentNode.removeChild(imagesToBeDeleted[i]);
    let indexRemoved = myImages.indexOf(imagesToBeDeleted[i]);
    // -1 pentru ca indexul porneste de la 0
    if (indexRemoved > -1) {
      myImages.splice(indexRemoved, 1);
    }
  }
}

//functie pentru preluarea imaginilor selectate
function getSelectedImages() {
  let selectedImages = [];
  for (let i = 0; i < myImages.length; i++) {
    //se verifica proprietatea selected a fiecarei imagini din array-ul de imagini incarcate
    if (myImages[i].selected === 1) {
      selectedImages.push(myImages[i]);
    }
  }
  //se returneaza array-ul ce contine doar imaginile selectate si dorite a fi desenate pe canvas
  return selectedImages;
}

//functie pentru desenarea imaginilor selectate pe canvas
function drawSelectedImgs() {
  var selectedImages = getSelectedImages();
  var noPhotos = document.querySelector("#noPhotos").value;
  var template = document.querySelector("#template").value;
  //validari daca s-a selectat ceva si daca numarul selectat de imagini corespunde numarului din optiuni
  if (selectedImages.length == 0)
    alert("Trebuie să selectați măcar o imagine pentru desenare!");
  else if (selectedImages.length != noPhotos) {
    alert(
      "Numărul de fotografii alese nu este același cu numărul de fotografii suportate de template-ul selectat!"
    );
    //desenari in functie de sablonul si numarul de imagini alese
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
    //sunet
    sparklesSound.play();
  }
}

//vor fi folosite in toate functiile ce privesc efecte de culoare
var imageData;
var info;
//prelucrari privind culoarea - gray, negativ, sepia
document.querySelector("#grayscale").addEventListener("click", () => {
  imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height);
  info = imageData.data;
  for (let i = 0; i < myCanvas.height * myCanvas.width * 4; i += 4) {
    info[i] = info[i + 1] = info[i + 2] =
      info[i] * 0.299 + 0.587 * info[i + 1] + 0.114 * info[i + 2];
  }
  context.putImageData(imageData, 0, 0);
});
document.querySelector("#negative").addEventListener("click", () => {
  imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height);
  info = imageData.data;
  for (let i = 0; i < myCanvas.height * myCanvas.width * 4; i += 4) {
    info[i] = 255 - info[i]; //rosu
    info[i + 1] = 255 - info[i + 1]; //verde
    info[i + 2] = 255 - info[i + 2]; //albastru
  }
  context.putImageData(imageData, 0, 0);
});
document.querySelector("#sepia").addEventListener("click", () => {
  imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height);
  info = imageData.data;
  for (let i = 0; i < myCanvas.height * myCanvas.width * 4; i += 4) {
    //se calculeaza valoarea pt tonurile de gri
    var gray = info[i] * 0.299 + 0.587 * info[i + 1] + 0.114 * info[i + 2];
    //se adauga culoare inapoi in tonurile de gri
    info[i] = gray + 50;
    info[i + 1] = gray + 20;
    info[i + 2] = gray;
  }
  context.putImageData(imageData, 0, 0);
});

//functie de salvare a colajului din canvas
function save() {
  let button = document.getElementById("download");
  let dataURL = myCanvas.toDataURL("image/png");
  button.href = dataURL;
}
