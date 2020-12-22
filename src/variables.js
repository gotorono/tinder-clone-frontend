import axios from './axios';

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

export const getMatchString = async(currentUserID, sendingMessageToID) => {

  const matchString = await axios.get('/tinder/users/matchString', {params: {
    _id: currentUserID,
    matchId: sendingMessageToID
  }})

  return matchString.data;

}