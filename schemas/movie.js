import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';	//自增ID 模块
autoIncrement.initialize(mongoose.connection);        //初始化

let MovieSchema = new mongoose.Schema({
	doctor : String,
	title : String,
	language : String,
	country : String,
	summary : String,
	flash : String,
	poster : String,
	year  : Number,
	meta : {
		createAt : {
			type : Date,
			default : Date.now(),
		},
		updateAt : {
			type : Date,
			default : Date.now(),
		},
	},
});


MovieSchema.plugin(autoIncrement.plugin, {
    model: 'Movie',   //数据模块，需要跟同名 x.model("Movie", MovieSchema);
    field: 'id',     //字段名
    startAt: 1,    //开始位置，自定义
    incrementBy: 1    //每次自增数量
});

MovieSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
});

// MovieSchema.statics = {
// 	fetch : (cb) => {
// 		return this
// 			.find({})
// 			.sort('meta.updateAt')
// 			.exec(cb);
// 	},
// 	findById: (id, cb) => {
// 		// console.log(this);
// 		return this
// 			.findOne({_id: id})
// 			.exec(cb);
// 	},
// }

MovieSchema.static('fetch', function (cb) {
  	return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
});

MovieSchema.static('findById', function (id, cb) {
  	return this
		.findOne({id: id})
		.exec(cb);
});

export default MovieSchema;