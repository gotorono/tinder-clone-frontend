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

export const getRoomString = (currentUserID, sendingMessageToID) => {
  let roomName = currentUserID + sendingMessageToID;
  roomName = roomName.split("");
  roomName.sort();
  roomName = roomName.join("");
  return roomName;

  //01111224444444555556677788abbccccddddddddeefffff
  //01111224444444555556677788abbccccddddddddeefffff
}