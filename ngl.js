const axios = require("axios")
const fs = require("fs")
const logs = require("./logs")

let execute = async (username, message) => {
	const user_agent = [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",

		"Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/113.0.5672.109 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/113.0.5672.109 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPod; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/113.0.5672.109 Mobile/15E148 Safari/604.1",
		
		"Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.76 Mobile Safari/537.36",
		
		"Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
		"Mozilla/5.0 (X11; Linux i686; rv:109.0) Gecko/20100101 Firefox/113.0",
		"Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/113.0",

		"Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:109.0) Gecko/20100101 Firefox/113.0",
		"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
		"Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
		
		""
	]
	let agent = user_agent[Math.floor(Math.random() * user_agent.length)]
	username = username.toLowerCase().replace(/\s/gi, "")
	let data = {
		"question": message,
		"username": username,
		"deviceId": ""
	}
	let f = await axios.post("https://ngl.link/api/submit", {
		headers: {
			"Content-Type": "application/json",
			"user-agent": agent
		},
		"question": message,
		"username": username,
		"deviceId": ""
	}).then(res => {
		let js = res.data
		js['msg'] = message
		js['username'] = username
		js['user-agent'] = agent
		console.log(js)
		return js
	}).catch(e => {
		console.error(e)
		return e
	})
	return f
}

let sent = async () => {
	let sents = []
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
	const sets = fs.readFileSync("data", "utf-8").split("\n")
	const senders = Object.keys(JSON.parse(fs.readFileSync("users.json", "utf-8")))
	let lists = []

	for(let i = 0; i < senders.length; i++){
		if((i % 5) == 0){
			await delay(5000)
		}

		if((i % 25) == 0){
			await delay(10000)
		}

		let n = Math.floor(Math.random() * sets.length)
		while(lists.includes(n)){
			n = Math.floor(Math.random() * sets.length)
		}
		lists.push(n)
		const msg = sets[n].replace(/ \r|\r/gi, "")

		const s = i // Math.floor(Math.random() * senders.length)

		const d = await execute(senders[s], `\nQuestion #${n + 1}. ${msg}\n\nFrom: Random Questionaire`).catch(e => {
			return e
		})
		try{
			sents.push(d)
		}catch(e){
			console.error(e)
		}
	}
	return sents
}

let start = async () => {
	let getIt = await sent()
	logs("")
	logs("------------------------------Separator only------------------------------")
	logs("")
	for(let i = 0; i < getIt.length; i++){
		logs(JSON.stringify(getIt[i]))
	}
}


module.exports = {
	execute,
	start
}