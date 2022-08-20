import db from '../models';
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();
    console.log('data', data);
    return res.render('homepage.ejs', { data: JSON.stringify(data) });
  } catch (err) {
    console.log('error', err);
  }

}

let getAboutPage = async (req, res) => {
  return res.render('test/about.ejs');
}

const getCRUD = (req, res) => {
  return res.render('crud.ejs');
}

const postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);

  console.log(message);

  return res.send('post crud from server');
}

const displayGetCRUD = async (req, res) => {
  const data = await CRUDService.getAllUser();
  console.log('data all users', data);
  return res.render('displayCRUD.ejs', {
    dataTable: data
  })
}

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
}
