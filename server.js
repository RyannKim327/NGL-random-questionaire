const axios = require("axios")
const fs = require("fs")
const express = require("express")

const ngl = require("./ngl")

const app = express()
const PORT = process.env.PORT | 3000 | 5000

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/index.html`)
})

app.post("/verif", async (req, res) => {
	let json = JSON.parse(fs.readFileSync("users.json", "utf-8"))
	let body = req.headers.body.toLowerCase().replace(/\s/gi, "")
	if(/ngl\.link\/([\w_\-\.]+)/.test(body)){
		body = body.match(/ngl\.link\/([\w_\-\.]+)/)[1]
	}
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
		const alphanumeric = "abcdefghijklmnopqrstuvwxyz123456789_-"
		let total = Math.floor(Math.random() * 5) + 5
		let code = ""
		for(let i = 0; i < total; i++){
			code += alphanumeric[Math.floor(Math.random() * alphanumeric.length)]
		}
		return code
	}

	let code = verification()
	json[body] = code

	fs.writeFileSync("users.json", JSON.stringify(json), "utf-8")
	let data = await ngl.execute(body, `Greetings, here is your verification code for NGL Random Questions: "${code}" Enjoy answering.\nFrom: Random Questionaire.`)
	res.send(JSON.stringify({
		ok: true,
		msg: "Please check your NGL account and get the verification code."
	}))
})

app.post("/done", async (req, res) => {
	let json = JSON.parse(fs.readFileSync("users.json", "utf-8"))
	const body = JSON.parse(req.headers.body)
	if(/ngl\.link\/([\w_\-\.]+)/.test(body.usn)){
		body.usn = body.usn.match(/ngl\.link\/([\w_\-\.]+)/)[1]
	}
	if(body.code.length < 5){
		return res.send(JSON.stringify({
			ok: false,
			msg: "Wrong Verification"
		}))
	}
	if(json[body.usn.toLowerCase()] == body.code.toLowerCase()){
		json[body.usn.toLowerCase()] = ""
		fs.writeFileSync("users.json", JSON.stringify(json), "utf-8")
		let data = await ngl.execute(body.usn, `Thank you for joining, I hope you'll enjoy this.\nFrom: Random Questionaire`)
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
		// let { data } = await axios.get("https://ngl.mpoprevii.repl.co")
		// console.log(data)
	}, 60000 * 5)
})