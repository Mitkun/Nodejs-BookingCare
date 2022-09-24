import bcrypt from 'bcryptjs';
import db from '../models';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(e);
    }
  });
};

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
          raw: true,
        });

        if (user) {
          //TODO compate password
          let check = await bcrypt.compareSync(password, user.password);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = 'OK';

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = 'User not found!';
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Your's Email isn't exist in your system. plz try other email";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });

      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = {};

      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password'],
          },
        });
      } else if (userId) {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password'],
          },
        });
      }

      resolve(users);
    } catch (err) {
      reject(err);
    }
  });
};

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //TODO check email is exist
      let checkEmail = await checkUserEmail(data.email);

      if (checkEmail) {
        resolve({
          errCode: 1,
          message: 'Your email is already in used. Plz try another email!',
        });
      }

      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender,
        roleId: data.roleId,
        positionId: data.positionId,
      });

      resolve({
        errCode: 0,
        message: 'ok create a new user succeed!',
      });
    } catch (err) {
      reject(err);
    }
  });
};

const editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          message: 'Missing required paremeters!',
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });

        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;

          await user.save();

          // await db.User.save({
          //   firstName: data.firstName,
          //   lastName: data.lastName,
          //   address: data.address
          // })

          resolve({
            errCode: 0,
            message: 'Update the user succeed!',
          });
        } else {
          resolve({
            errCode: 1,
            message: "User's not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "The user isn't exist!",
        });
      } else {
        await user.destroy();

        resolve({
          errCode: 0,
          errMessage: 'The user is deleted!',
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters!',
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: typeInput },
        });

        res.errCode = 0;
        res.data = allCode;

        resolve(res);
      }
    } catch (error) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  editUser: editUser,
  deleteUser: deleteUser,
  getAllCodeService: getAllCodeService,
};
