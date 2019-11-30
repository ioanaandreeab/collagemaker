var myCanvas = document.querySelector("#myCanvas");

/*functii pentru drag n drop
window.ondragover = function(e) {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
};
window.ondrop = function(e) {
  e.preventDefault(); //nu lasa browserul sa deschida imaginea in pagina
    draw(e.dataTransfer.files[0]);
};*/

var myImages = [];

let imageArea = document.querySelector("#imageLoader");
imageArea.ondragover = function(e) {
  e.preventDefault();
};

imageArea.ondrop = function(e) {
  e.preventDefault();
  let files = e.dataTransfer.files;
  if (files.length > 0) {
    let reader = new FileReader();
    reader.onload = function(e) {
      let dest = document.querySelector("#imageLoader");
      let currImg = new Image();
      currImg.src = e.target.result;
      currImg.id = "img" + myImages.length;
      currImg.selected = 0;
      currImg.onclick = selectImg();
      myImages.push(currImg);
      console.log(myImages);
      console.log(currImg);
      dest.appendChild(currImg);
      var x = document.createElement("INPUT");
      x.setAttribute("type", "checkbox");
      dest.appendChild(x);
    };
    reader.readAsDataURL(files[0]);
  }
};

function selectImg() {
  this.selected = 1;
  console.log(this);
}

function draw(mySrc) {
  let myImage1 = new Image();
  myImage1.src = mySrc;
  let canvas = document.getElementsByTagName("canvas")[0];
  let context = canvas.getContext("2d");
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

//functie de salvare a colajului din canvas
function save() {
  let canvas = document.getElementsByTagName("canvas")[0];
  let button = document.getElementById("download");
  let dataURL = canvas.toDataURL("image/png");
  button.href = dataURL;
}

//function for background image
function fillbg() {
  let image = new Image();
  image.src = "media/pattern.png";
  image.onload = () => {
    context.fillStyle = context.createPattern(image, "repeat-x");
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
}
