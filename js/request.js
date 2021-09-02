// export class Request {
//   constructor(url, method, data, config = {}) {
//     t
//   }
// }

const request = (url, method, data = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    if (method.toLowerCase() === 'get') {
      const keys = Object.keys(data)
      const values = Object.values(data)

      url += '?' + new Array(keys.length)
        .fill(0)
        .map(index => {
          return keys[index] + '=' + values[index]
        })
        .join('&')

      xhr.open(method, url)
      xhr.send()
    } else {
      xhr.open(method, url)

      const headers = config.header || {}
      const keys = Object.keys(headers)

      keys.forEach((key, index) => {
        xhr.setRequestHeader(key, headers[key])
      })

      xhr.send("asdasdas")
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response)
      }
    }
  })
}

request('http://localhost:3000/api/datac/demo', 'post', {name: 'sweet'})
.then(res => {
  console.log(res)
})