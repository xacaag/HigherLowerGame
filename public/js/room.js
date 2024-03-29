const randomIdGenerator = () => {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uniqid = randLetter + Date.now();
  return uniqid;
};


const createroom = async () => {
  var a = 1;
  document.getElementById("loader").style.visibility = "visible";
  let ref = await db.collection("rooms").add({
    nameArr: [],
    players: 1,
    ready: false,
    start: false,
    time: firebase.firestore.FieldValue.serverTimestamp(),
    gamer: [],
    name:"multiplayer-classic",
  });
  localStorage.setItem("admin", a);

  let uid = randomIdGenerator().slice(8);
  await db.doc(`links/${uid}`).set({
    link: ref.id,
  });
  window.location = `lobby.html?roomid=${uid}`;
};

const join = async () => {

  const joincode = document.getElementById("join").value;

  let doc = await db.collection("links").doc(`${joincode}`).get();

  if(doc.data() === undefined){
    alert('Joincode invalid')
   }else{
  document.getElementById('joinroom').disabled = true

  document.getElementById("loader").style.visibility = "visible";

  let { link } = doc.data();

  let roomData = await db.collection("rooms").doc(`${link}`).get();

  let { players } = roomData.data();



  if (players > 5) {
    alert("Өрөө дүүрсэн байна");
    return;
  }
  await db
    .collection("rooms")
    .doc(`${link}`)
    .set(
      {
        players: ++players,
        ready: true,
      },
      { merge: true }
    );
  window.location = `lobby.html?roomid=${joincode}`;
}
};
