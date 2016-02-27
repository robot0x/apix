/*
* dao层
* 
* 操作数据库
* 
* */

'use strict';

const mongoose = require('mongoose');

const util = require('../helper/util');
const schemas = require('../dao/schemas');

let db = mongoose.createConnection('localhost', 'apix');

let UserModel = db.model('User', schemas.userSchema),
	SystemModel = db.model('System', schemas.systemSchema),
	GroupModel = db.model('Group', schemas.groupSchema),
	ApiModel = db.model('Api', schemas.apiSchema);

let mongo = {};

mongo.login = (username, password, res) => {
	UserModel.findOne({username: username, password: password}, (err, user) => {
		if(err){
			console.log(err);
			return res.sendStatus(401);
		}
		if(user){
			// 利用id和username生成token	
			let tokendata = {
				id: user._id,
				username: user.username
			}
			let token = util.genToken(tokendata);
			return res.json({
				pass: true,
				token: token,
				data: user
			})
		}else{
			return res.json({
				pass: false,
				data: 'Incorrect Username/Password'
			})
		}
	})
};

mongo.signUp = (username, password, res) => {
	UserModel.findOne({username: username}, (err, user) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(user){
			return res.json({
				pass: false,
				data: 'Username Already Exists'
			})
		}else{
			let user = new UserModel({
				username: username,
				password: password
			});
			user.save((err, doc) => {
				if(err){
					console.log(err);
					return res.sendStatus(500);
				}
				return res.json({
					pass: true,
					data: doc
				});
			})
		}
	})
}

mongo.listSystems = (userId, res) => {
	SystemModel.find({userId: userId}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			return res.json(doc);
		}else{
			return res.sendStatus(404);
		}
	})
}

mongo.listGroups = (system, res) => {
	GroupModel.find({system: system}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			return res.json(doc);
		}else{
			return res.sendStatus(404);
		}
	})
}

mongo.listApis = (params, res) => {
	ApiModel.find(params, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			return res.json(doc);
		}else{
			return res.sendStatus(404);
		}
	})
}

mongo.createSystem = (systemData, res) => {
	let system = new SystemModel(systemData);
	system.save((err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		return res.json(doc);
	})
}

mongo.getGroup = (params, res) => {
	GroupModel.findOne({system: params.system, name: params.name}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			return res.json(doc);
		}else{
			return res.sendStatus(404);
		}
	})
}

mongo.createGroup = (groupData, res) => {
	let group = new GroupModel(groupData);
	group.save((err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		return res.json(doc);
	})
}

mongo.updateGroup = (params, groupData, res) => {
	GroupModel.update(params, {$set: groupData}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			if(groupData.name){
				let apiParams = {
					system: params.system,
					group: params.name
				}
				ApiModel.update(apiParams, {$set: {group: groupData.name}}, { multi: true }, (err, doc) => {
					if(err){
						console.log(err);
						return res.sendStatus(500);
					}
					return res.json(doc);
				})
			}else{
				return res.json(doc);
			}
		}else{
			return res.sendStatus(404);
		}
	})
}


mongo.getApi = (apiId, res) => {
	ApiModel.findOne({_id: apiId}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		if(doc){
			return res.json(doc);
		}else{
			return res.sendStatus(404);
		}
	})
}

mongo.createApi = (apiData, res) => {
	let api = new ApiModel(apiData);
	api.save((err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		return res.json(doc);
	})
}

mongo.updateApi = (apiId, apiData, res) => {
	ApiModel.findByIdAndUpdate(apiId, {$set: apiData}, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		return res.json(doc);
	})
}

mongo.deleteApi = (apiId, res) => {
	ApiModel.findByIdAndRemove(apiId, (err, doc) => {
		if(err){
			console.log(err);
			return res.sendStatus(500);
		}
		console.log('delete', doc)
		return res.json(doc);
	})
}

module.exports = mongo;

