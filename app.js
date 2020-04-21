var request = require('request');
var rp = require('request-promise');
var fs = require('fs');
var _ = require('lodash');
var async = require("async");

let book_api_url = 'https://strapi.90m.top/articles'
let auth_url ='https://strapi.90m.top/auth/local'

var auth_options = {
    method: 'POST',
    url: auth_url,
    form: {
        'identifier': 'test',
        'password': ''
    }
};
rp(auth_options)
    .then(function (response) {
        console.log(`Got jwt==================${JSON.parse(response).jwt}`)
        return JSON.parse(response).jwt
    })
    .then(function (jwt) {
        setInterval(() => {
            console.log(`interval triggered =======`)

            let loopTimess = 10;
            for (let index = 0; index < loopTimess; index++) {
                let concurrent = 100
                let totalRequest = 200
                console.log(`forloop index === ${index}`)
                let urls = [...(new Array(totalRequest)).keys()]
                console.log(urls.length)
                async.mapLimit(urls, concurrent, async function(url) {
                    console.log(`before index === ${index}  url=== ${url}`)
                    const response = await rp({
                        method: 'GET',
                        uri: book_api_url,
                        headers: {
                            Authorization: `Bearer ${jwt}`
                        }
                    })
                    console.log(`after index === ${index}  url=== ${url}`)
                    return response
                }, (err, results) => {
                    if (err) throw err
                    // results is now an array of the response bodies
                    console.log(`${index} all finished ==== ${results.length}`)
                })
                
            }
        }, 20000);
        
        
        
        // for (let index = 0; index < num; index++) {
        //     for (let index = 0; index < concurrent; index++) {
        //         arr.push(rp({
        //             method: 'GET',
        //             uri: book_api_url,
        //             headers: {
        //                 Authorization: `Bearer ${jwt}`
        //             }
        //         }))
        //     }
        //     await Promise.all(arr)
        //         .then(function (bookres) {
        //             // console.log(`bookres=====${bookres}`)
        //             console.log(`bookres=====${index}`)
        //         })
            
        // }

    })
    .catch(function (err) {
        console.log(err.message)
    })








