const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/experiment', { useNewUrlParser: true });

const database = mongoose.connection;

database.on('error', (error) => {
	console.log(error);
});
database.once('connected', () => {
	console.log('Database Connected');
});

const expSchema = {
	no: String,
	message: String,
};
const apiModel = mongoose.model('dbapi2', expSchema);

app
	.route('/api')
	.get(async (req, res) => {
		let apiData = await apiModel.find();
		res.send(apiData);
	})
	.post(async (req, res) => {
		const apiDataNo = req.body.no;
		const apiDataMessage = req.body.message;
		console.log(req.body);
		console.log(apiDataNo);
		console.log(apiDataMessage);
		const data = new apiModel({
			no: apiDataNo,
			message: apiDataMessage,
		});
		try {
			const dataToSave = await data.save();
			res.status(200).json(dataToSave);
			console.log(dataToSave);
		} catch (error) {
			res.status(400).json({ message: error.message });
			console.log(dataToSave);
		}
	})
	.delete(async (req, res) => {
		try {
			const dataToDelete = await apiModel.deleteMany();
			res.status(200).json(dataToDelete);
			console.log(dataToDelete);
		} catch (error) {
			res.status(400).json({ message: error.message });
			console.log(dataToDelete);
		}
	});

app
	.route('/api/:no')
	.get(async (req, res) => {
		try {
			const find = await apiModel.findOne({ no: req.params.no });
			res.status(200).json(find);
			console.log(find);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	})
	.delete(async (req, res) => {
		try {
			const del = await apiModel.deleteOne({ no: req.params.no });
			res.status(200).json(del);
			console.log(del);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	})
	.put(async (req, res) => {
		try {
			const update = await apiModel.findOneAndUpdate(
				{ no: req.params.no },
				{ $set: { message: req.body.message } }
			);
			res.status(200).json(update);
			console.log(update);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	});

app.listen(3000, () => {
	console.log(`Server Started at ${3000}`);
});
