const loggedIn = localStorage.getItem("loggedInUser");
if(!loggedIn) window.location.href="index.html";

let albums = JSON.parse(localStorage.getItem("albums") || "[]");
let currentAlbum = null;
let currentLightboxFile = null;

// DOM refs
const logoutBtn = document.getElementById("logoutBtn");
const newAlbumName = document.getElementById("newAlbumName");
const newAlbumPin = document.getElementById("newAlbumPin");
const createAlbumBtn = document.getElementById("createAlbumBtn");
const albumsList = document.getElementById("albumsList");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const refreshGalleryBtn = document.getElementById("refreshGalleryBtn");
const gallery = document.getElementById("gallery");
const currentAlbumTitle = document.getElementById("currentAlbumTitle");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeLightbox = document.getElementById("closeLightbox");
const downloadBtn = document.getElementById("downloadBtn");
const deleteBtn = document.getElementById("deleteBtn");

// Logout
logoutBtn.onclick = ()=>{
  localStorage.removeItem("loggedInUser");
  window.location.href="index.html";
};

// Create Album
createAlbumBtn.onclick = () => {
  const name = newAlbumName.value.trim();
  const pin = newAlbumPin.value.trim();
  if(!name || !/^\d{4,6}$/.test(pin)){ alert("Album name & PIN required (4-6 digits)"); return; }
  albums.push({name, pin, locked:true, images:[]});
  localStorage.setItem("albums", JSON.stringify(albums));
  newAlbumName.value=""; newAlbumPin.value="";
  renderAlbums();
};

// Render Albums
function renderAlbums(){
  albumsList.innerHTML="";
  albums.forEach((a,i)=>{
    const el=document.createElement("div"); el.className="albumCard";
    const cover = document.createElement("img");
    cover.className="albumCover"; cover.src=a.images[0]?.url || "https://via.placeholder.com/180x120?text=Album";
    const title = document.createElement("div"); title.className="albumTitle"; title.textContent=a.name;
    const actions = document.createElement("div"); actions.className="albumActions";
    const del = document.createElement("button"); del.textContent="Delete";
    del.onclick=(e)=>{ e.stopPropagation(); if(confirm("Delete album?")){albums.splice(i,1); localStorage.setItem("albums", JSON.stringify(albums)); renderAlbums(); gallery.innerHTML="";}};
    const lock = document.createElement("button"); lock.textContent=a.locked?"Unlock":"Lock";
    lock.onclick=(e)=>{ e.stopPropagation(); a.locked=!a.locked; renderAlbums(); };
    actions.appendChild(del); actions.appendChild(lock);
    el.appendChild(cover); el.appendChild(title); el.appendChild(actions);
    el.onclick = ()=>{
      if(a.locked){ const p=prompt("Enter PIN"); if(p!==a.pin){alert("Incorrect PIN"); return;} a.locked=false; renderAlbums();}
      currentAlbum = a; currentAlbumTitle.textContent = a.name; loadGallery();
    };
    albumsList.appendChild(el);
  });
}

// Upload Images
uploadBtn.onclick = ()=>{
  if(!currentAlbum){alert("Select album"); return;}
  for(const f of fileInput.files){
    const url = URL.createObjectURL(f);
    currentAlbum.images.push({name:f.name,url});
  }
  localStorage.setItem("albums", JSON.stringify(albums));
  fileInput.value="";
  loadGallery();
};

// Load Gallery
function loadGallery(){
  gallery.innerHTML="";
  if(!currentAlbum.images.length){ gallery.innerHTML="<div class='muted'>No images</div>"; return; }
  currentAlbum.images.forEach(imgObj=>{
    const img = document.createElement("img");
    img.src = imgObj.url; img.alt = imgObj.name;
    img.onclick=()=>{ currentLightboxFile=imgObj; lightboxImg.src=imgObj.url; downloadBtn.href=imgObj.url; downloadBtn.download=imgObj.name; lightbox.classList.remove("hidden");};
    gallery.appendChild(img);
  });
}

// Lightbox
closeLightbox.onclick = ()=>lightbox.classList.add("hidden");
deleteBtn.onclick = ()=>{
  if(!currentLightboxFile) return;
  if(!confirm("Delete this photo?")) return;
  currentAlbum.images = currentAlbum.images.filter(f=>f!==currentLightboxFile);
  localStorage.setItem("albums", JSON.stringify(albums));
  loadGallery(); lightbox.classList.add("hidden");
};

refreshGalleryBtn.onclick=loadGallery;

// Initial render
renderAlbums();
