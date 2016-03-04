var state = 
{
	"one" : 1,
	"two" : 2,
	"three" : 3
}

var s = JSON.stringify(state)
console.log(s)

Object.assign(state, { "four" : 4});

s = JSON.stringify(state)
console.log(s)

Object.assign(state, { "four" : 4.1});

s = JSON.stringify(state)
console.log(s)

