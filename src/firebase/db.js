//this is going to store Firebase realtime database API code
import { db } from "./firebase";
import { ref, update, push, set, remove } from "firebase/database";


//create an user and store it at users/id path (it's an asynchronous func)

export const doCreateUser = (id, email, phoneNumber) =>{
  update(ref(db, `users/${id}`), { email, phoneNumber });
}

export const doCreateNewCandidate = (data) =>{
  const candidateListRef = ref(db, `newCandidates`);
  const newCandidateListRef = push(candidateListRef);
  set(newCandidateListRef, {
      name:data.name,
      emailAddress:data.address,
      dateOfBirth:data.dateOfBirth,
      state:data.state,
      age:data.age,
      pincode:data.pincode
  });
}

export const doUpdateCandidate = (id,data) =>{
  update(ref(db, `newCandidates/${id}`),{
      name:data.name,
      emailAddress:data.address,
      dateOfBirth:data.dateOfBirth,
      state:data.state,
      age:data.age,
      pincode:data.pincode,
      status:data.status
  });
}

export const doCreateUserItemPurchased = (id, itemPurchased) =>{
  update(ref(db, `users/${id}`), {itemPurchased});
}

export const doDeleteNewCandidate = (reference) =>{
  remove(reference);
}


