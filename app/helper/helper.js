const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const userRepo = require('user/repositories/user.repository');

class Helper {
	constructor() {
		
	}
	
	async isEmailAvailable(email){
		let emailAvailable = await userModel.findOne({email:email});
		if(emailAvailable){
			return true;
		}
		else{
			return false;
		}
	}
	
	async getDate(){
		return (new Date()).toISOString().substring(0, 10) ;
	}
	
	async getRandomString(text){
		return text + Math.floor((Math.random() * 100000) + 1);
	}
	
	async getRandomInt(){
		return Math.floor((Math.random() * 100000) + 1);
	}
	
	async getRandomAmount(){
		let amount = ((Math.random() * 100) + 1).toFixed(2);
		return amount;
	}
	
	async generateUniqueOrderNumber(req){
		const obj = {
			'length': 6,
			'chars': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
		};
		const uniqueNumber = await this.randomString(obj);
	    const hasUniqueNumber =  req.user.generateHash(uniqueNumber);

	//	console.log('hashuique ',hasUniqueNumber);

		const checkpass = await userRepo.getByField({
			'password': hasUniqueNumber
		});

		//console.log(checkpass);
		
		if(_.isEmpty(checkpass)) {

			return uniqueNumber
		} else {
			return generateUniqueOrderNumber()
		}	

	}
	
	async randomString(req){
		var result = '';
		for (var i = req.length; i > 0; --i)
			result += req.chars[Math.round(Math.random() * (req.chars.length - 1))];
		return result;
	}
}

module.exports = new Helper();

// const orderDet = orderRepo.getByField({
// 	'order_no': uniqueNumber.toString()
// });
// if (_.isEmpty(orderDet)) {
// 	return uniqueNumber;
// }
// else {
// 	return generateUniqueOrderNumber();
// }
