const fs = require("fs")

module.exports = (data) => {const a = new Date()
	Date.prototype.today = function () { 
		return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
	}
	Date.prototype.timeNow = function () {
		 return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
	}

	let txt = fs.readFileSync("logs.log", "utf-8")
	let date = new Date()
	let time = `${date.today()} @ ${date.timeNow()}`
	txt = `${time}:\t${data}\n${txt}`
	fs.writeFileSync("logs.log", txt, "utf-8")
	return "Check your logs now"
}