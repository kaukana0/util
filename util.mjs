export function replaceEuInRawData(arrayBuffer) {
	var dataView = new DataView(arrayBuffer)
	var decoder = new TextDecoder('utf8')
	try {
		var obj = JSON.parse(decoder.decode(dataView).replaceAll("EU27_2020", "EU").replaceAll("EA19", "EA") )
		return obj
	} catch(e) {
		console.error("main: invalid (json) or no data. native error follows.\n\n", e)
		return {}
	}
}


export function getURLParameterValue (parameter) {
	'use strict'
	parameter = parameter.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
	let regexS = '[\\?&]' + parameter + '=([^&#]*)'
	let regex = new RegExp(regexS)
	let results = regex.exec(window.location.href)
	if (results === null) {
		return null
	} else {
		return results[1]
	}
}

/*
o1
  a
    b

o2
  a
    c

expected result
	a
		b
		c

test:
const a= {a:{b:{bla:"b"}}}
const b= {a:{c:{bla:"c"}}}
console.log(mergeObjects(a,b))

*/
export function mergeObjects(a, b) {
	let retVal = structuredClone(a)

	function iter(retVal, b) {
		for (const [key,val] of Object.entries(b)) {
			if(Array.isArray(val)) {
				if(retVal[key]) {
					if(Array.isArray(retVal[key])) {
						retVal[key] = Array.from(val)
						// or this? retVal[key] = retVal[key].concat(val)
					} else {
						// do nothing
						console.warn("util: prop exists and is not an array")
					}
				} else {
					retVal[key] = structuredClone(val)
				}
			} else {
				if(retVal[key]) {
					if(typeof val === "object") {
						retVal[key] = iter(val, b[key])
					}	else {
						console.warn("util: ?")
					}
				} else {
					retVal[key] = structuredClone(val)
				}
			}
		}
		return retVal
	}

	return iter(retVal, b)
}
