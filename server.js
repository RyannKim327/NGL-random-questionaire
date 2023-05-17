const axios = require("axios")
const fs = require("fs")
const express = require("express")

const app = express()
const PORT = process.env.PORT | 3000 | 5000

app.get("/", (req, res) => {
	res.send("hi")
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

app.listen(PORT, () => {
	console.log("You're server is currently wordking on PORT: " + PORT)
	setInterval(async () => {
		let { data } = await axios.get("https://ngl.mpoprevii.repl.co")
		console.log(data)
	}, 60000 * 5)
})