export const setRequestOtions = (method, data = null) => {
  return {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: method,
    body: JSON.stringify(data)
  }
};

export const formToJson = (form) => {
  const data = new FormData(form);
  const keys = data.keys();//keys est un objet itérable. en tant qu’itérable il fonctionne avec for of (et non for in)
  const dataToSend = {};
  //On réucupère les données du formulaire
  for (const key of keys) {
    dataToSend[key] = data.get(key);
  };
  return dataToSend;
};
