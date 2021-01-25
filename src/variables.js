import axios from "./axios";

export const genderOptions = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "U", label: "Undefined" },
];

export const orientationOptions = [
  { value: "hetero", label: "Heterosexual" },
  { value: "homo", label: "Homosexual" },
  { value: "bi", label: "Bisexual" },
];

export const showOptions = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "everyone", label: "Everyone" },
];

export const getNotSeenCount = (unseenCount) => {
  if (unseenCount > 9) return "9+";
  else return unseenCount;
};

export const dateDiffInDays = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const dateDiffInMinutes = (a, b) => {
  var diff = Math.abs(new Date(a) - new Date(b));
  var minutes = Math.floor((diff/1000)/60);
  return minutes;
}

export const setSeen = (id, matchString) => {
  axios.post("/tinder/messages/setSeen", {
      _id: id,
      matchString
  });
};

export const getMatchString = async (currentUserID, sendingMessageToID) => {
  const matchString = await axios.get("/tinder/users/matchString", {
    params: {
      _id: currentUserID,
      matchId: sendingMessageToID,
    },
  });

  return matchString.data;
};
