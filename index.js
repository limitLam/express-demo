import express from 'express';
import path from 'path';
import ejs from 'ejs';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
// import multer from 'multer';

//	underscore
import _ from 'underscore';

//	mongoose
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import Movie from './models/movie';

mongoose.connect('mongodb://localhost/imooc');

let app = express();

const PORT = process.env.PORT || 3000;
const CLIENT_PATH = path.join(__dirname, 'client/dist');

// 设置views路径和模板
app.use(serveStatic(CLIENT_PATH));
app.set('views', CLIENT_PATH);
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//	设置请求body
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

// 对所有(/)URL或路由返回index.html
app.get('/',(req, res) => {
	res.render('index');
});

app.listen(PORT, () => {
	console.log(`server running http://localhost:${PORT}`);
});

// app.get('/admin/update/:id', ( req, res ) => {
// 	let id = req.params.id;
// 	res.send({
// 		code : 200,
// 		data : id
// 	});
// });

const errData = ( err ) => {
	return {
		code : 500,
		data : err,
		message : '服务端错误',
	}
}

const successData = ( data ) => {
	return {
		code : 200,
		data : data,
		message : null,
	}
}

//	修改和新增
app.post('/admin/movie/update', (req, res) => {
	// console.log(req.body);
	// res.json(req.body);

	let id = req.body._id;
	let movieObj = req.body;
	let _movie;

	if(id !== undefined){
		Movie.findById(id, (err, movie) => {
			if(err){
				console.log(err);
				res.json(errData(err));
				return false;
			}

			_movie = _.extend(movie, movieObj);
			// console.log(_movie);
			_movie.save( (err, movie) => {
				if (err){
					console.log(err);
					res.json(errData(err));
					return false;
				}

				res.json(successData(movie));
			});
		});
	}else{
		_movie = new Movie({
			doctor : movieObj.doctor,
			title : movieObj.title,
			language : movieObj.language,
			country : movieObj.country,
			summary : movieObj.summary,
			flash : movieObj.flash,
			poster : movieObj.poster,
			year  : movieObj.year,
		});
		// console.log('limit')
		_movie.save((err, movie) => {
			if (err){
				console.log(err);
				res.json(errData(err));
				return false;
			}

			res.json(successData(movie));
		});
	}
});

//	列表数据截取
let listFilter = (list, pageData) => {

	// //	数据转化处理
	// for(let prop in pageData){
	// 	pageData[prop] = parseInt(pageData[prop]);
	// }

	let filterList = list.slice(pageData.skip, pageData.skip + pageData.limit);

	return {
		list : filterList,
		pageNum : pageData.pageNum,
		pageSize : pageData.limit,
		total : list.length,
	};
}

//	整数类型参数
let filterIntParam = ( param , defaultParam ) => {
	if(param && parseInt(param)){
		return parseInt(param);
	}else{
		return defaultParam;
	}
}

//	查询数据
app.get('/admin/movie/list', (req, res) => {
	//	默认的页码数据
	let defaultParams = {
		pageNum : 1,	//	第一页
		pageSize : 10,	//	展示十个
	};

	//	获取传参数据
	let reqQuery = req.query;
	let {
		pageNum,
		pageSize
	} = reqQuery;

	pageNum = filterIntParam(pageNum, defaultParams.pageNum);
	pageSize = filterIntParam(pageSize, defaultParams.pageSize);

	let pageData = {
		limit : pageSize,
		skip : pageSize * ( pageNum - 1 ),
		pageNum : pageNum,
	}

	Movie.fetch((err, list) => {
		if(err){
			console.log(err);
			res.json(errData(err));
			return false;
		}

		let data = listFilter(list, pageData);

		res.json(successData(data));
	});
});

//	查询单条数据
app.get('/admin/movie/:id', (req, res) => {
	let id = req.params.id;

	Movie.findById(id, (err, movie) => {
		if(err){
			console.log(err);
			res.json(errData(err));
			return false;
		}

		res.json(successData(movie));
	});
});


