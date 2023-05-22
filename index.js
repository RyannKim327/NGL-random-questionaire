const cron = require("node-cron")
const ngl = require("./ngl")
const server = require("./server")

console.log("Program starts")

cron.schedule("* * * * *", () => {
	console.log("API Executing...")
	ngl.start()
	console.log("API executed")
}, {
	timezone: "Asia/Manila",
	scheduled: true
})