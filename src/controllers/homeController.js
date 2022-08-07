import db from '../models'

let getHomePage = async (req, res) => {
	try{
		const data = await db.User.findAll();
		console.log('data', data);
		return res.render('homepage.ejs',{data: JSON.stringify(data)});
}catch(err){
		console.log('error', err);
}
    
}

let getAboutPage = async (req, res) => {
    // try{
    //     const data = await db.User.findAll();
		// 		console.log('data', data);
    //     return res.render('test/about.ejs');
    // }catch(err){
    //     console.log('error', err);
    // }
		return res.render('test/about.ejs');

}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
}
