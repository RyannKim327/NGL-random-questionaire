const fs = require("fs")

const data = fs.readFileSync("data", "utf-8")
const datas = data.split("\n")

let lists = []

let res = ""

for(let i = 0; i < datas.length; i++){
	const n = Math.floor(Math.random() * datas.length)
	if(lists.includes(n)){
		i--
	}else{
		lists.push(n)
	}
}

for(let i = 0; i < lists.length; i++){
	res += datas[lists[i]] + "\n"
}

fs.writeFileSync("ds", res, "utf-8")