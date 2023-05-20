const axios = require("axios")
const fs = require("fs")
const express = require("express")

const ngl = require("./ngl")

const app = express()
const PORT = process.env.PORT | 3000 | 5000

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})

app.get("/insert", (req, res) => {
	let users = fs.readFileSync("users", "utf-8").split("\n")
	if(users.includes(req.query.usn.toLowerCase())){
		res.send("You're already in")
	}else{
		let user = fs.readFileSync("users", "utf-8")
		user += "\n" + req.query.usn.toLowerCase()
		fs.writeFileSync("users", user, "utf-8")
		res.send("Welcome, you've been added in the server, expect that every hour, the server will send you some questions. Enjoy answering.")
	}
})

app.post("/verif", async (req, res) => {
	let json = JSON.parse(fs.readFileSync("users.json", "utf-8"))
	let body = req.headers.body.replace(/\s/gi, "")
	if(json[body] != undefined){
		return res.send(JSON.stringify({
			ok: false,
			msg: "Your account is already in our database"
		}))
	}
	if(body.length < 5){
		return res.send(JSON.stringify({
			ok: false,
			msg: "Please check your USERNAME"
		}))
	}

	const verification = () => {
		const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
		let total = Math.floor(Math.random() * 5) + 5
		let code = ""
		for(let i = 0; i < total; i++){
			code += alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
		}
		return code
	}

	let code = verification()
	console.log(code)
	json[body] = code

	fs.writeFileSync("users.json", JSON.stringify(json), "utf-8")
	await ngl.execute(body, `Greetings, here is your verification code for NGL Random Questions: "${code}" Enjoy answering.\nFrom: Random Questionaire.`)
	res.send(JSON.stringify({
		ok: true,
		msg: "Please check your NGL account and get the verification code."
	}))
})

app.post("/done", (req, res) => {
	let json = JSON.parse(fs.readFileSync("users.json", "utf-8"))
	const body = JSON.parse(req.headers.body)
	if(body.code.length < 5){
		return res.send(JSON.stringify({
			ok: false,
			msg: "Wrong Verification"
		}))
	}
	if(json[body.usn] == body.code){
		json[body.usn] = ""
		fs.writeFileSync("users.json", JSON.stringify(json), "utf-8")
		res.send(JSON.stringify({
			ok: true,
			msg: "You're now one of us, enjoy answering some questions from our server. Thanks."
		}))
	}else{
		res.send(JSON.stringify({
			ok: false,
			msg: "Wrong Verification"
		}))
	}
})

app.listen(PORT, () => {
	console.log("You're server is currently wordking on PORT: " + PORT)
	setInterval(async () => {
		//let { data } = await axios.get("https://ngl.mpoprevii.repl.co")
		// console.log(data)
	}, 60000 * 5)
})