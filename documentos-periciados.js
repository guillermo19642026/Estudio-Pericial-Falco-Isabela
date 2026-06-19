import { auth, db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function guardarDocumentoPericiado(datos) {

  const user = auth.currentUser;

  if (!user) {
    alert("Debe iniciar sesión.");
    return;
  }

  await addDoc(collection(db, "documentos_periciados"), {

    ...datos,

    usuarioUID: user.uid,
    usuarioEmail: user.email,

    creadoEn: serverTimestamp()
  });

  await setDoc(
    doc(db, "usuarios", user.uid),
    {
      usado: true,
      fechaUso: new Date().toISOString()
    },
    { merge: true }
  );
}