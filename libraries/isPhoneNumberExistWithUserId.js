import User from "../models/User.js";
const isPhoneNumberExistWithUserId = async (id, phoneNumber) => {
  const user = await User.findOne({ phoneNumber: phoneNumber, _id: { $ne: id } });
  if (!user) {
    return false;
  }
  return true;
};

export default isPhoneNumberExistWithUserId;
