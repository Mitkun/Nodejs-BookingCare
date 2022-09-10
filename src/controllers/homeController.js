import db from '../models';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();

    return res.render('homepage.ejs', { data: JSON.stringify(data) });
  } catch (err) {
    console.log('error', err);
  }
};

let getAboutPage = async (req, res) => {
  return res.render('test/about.ejs');
};

const getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

const postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);

  return res.send('post crud from server');
};

const displayGetCRUD = async (req, res) => {
  const data = await CRUDService.getAllUser();
  console.log('data all users', data);
  return res.render('displayCRUD.ejs', {
    dataTable: data,
  });
};

const getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserInfoById(userId);

    return res.render('editCRUD.ejs', {
      user: userData,
    });
  } else {
    return res.send('Users not found!');
  }
};

const putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUserData(data);
  return res.render('displayCRUD.ejs', {
    dataTable: allUsers,
  });
};

const deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUderById(id);
    return res.send('Delete the user succeed!');
  } else {
    return res.send('User not found!');
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
