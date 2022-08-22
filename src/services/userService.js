import bcrypt from 'bcryptjs';

import db from "../models";

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUerEmail(email);
      if (isExist) {

        let user = await db.User.findOne({
          where: { email: email },
          attributes: ['email', 'roleId', 'password'],
          raw: true,
        })

        if (user) {
          //TODO compate password
          let check = await bcrypt.compareSync(password, user.password)

          if (check) {

            userData.errCode = 0;
            userData.errMessage = 'OK';

            delete user.password
            userData.user = user
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }

        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found!";
        }


      } else {
        userData.errCode = 1;
        userData.errMessage = "Your's Email isn't exist in your system. plz try other email";
      }
      resolve(userData)
    } catch (error) {
      reject(error)
    }
  })
};


const checkUerEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail }
      })

      if (user) {
        resolve(true);
      } else {
        resolve(false)
      }

    } catch (error) {
      reject(error)
    }
  })
}

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = {};

      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password']
          }
        })
      } else if (userId) {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password']
          }
        })
      }

      resolve(users)

    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
}