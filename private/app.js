module.exports = function(app, client) {
    //Generate unique ID for keys in the redis
    var ShortUniqueId = require('short-unique-id');
    //Install elastic search
    var elasticsearch = require('elasticsearch');
    var bonsai_url = process.env.BONSAI_URL || "";

    if(bonsai_url) {
        var elasticClient = new elasticsearch.Client({  
            host: bonsai_url,
            log: 'info'
        });
    } else {
        var elasticClient = new elasticsearch.Client({  
            host: 'localhost:9200',
            log: 'info'
        });
    }

    var indexName = "urlindex";

    // Rest Api's
    app.get("/", function (req, res) {
        // res.sendFile(path.join(__dirname, 'src/index.html'));
        res.sendFile(path.join(__dirname+'/dist/index.html'));
    });
    
    //Api called to generate short url of a long url and store it in the database
    app.post("/api/shortenUrl", function (req, res) {
        // get long url from angular
        var long = req.body.url;
        // generate unique id for key
        var uid = new ShortUniqueId();
        uid = uid.randomUUID(6);
        // get all keys from redis database
        client.keys("*", function(err, listKeys) {
            if(err) {
                res.status(404).json(err);
            } else {            
                // check if any key exists in the database
                if(listKeys.length > 0) {
                    let j = 0;
                    for(let i=0; i<listKeys.length; i++) {                        
                        // check the value of each key
                        client.get(listKeys[i], function(err, output) {
                            if(err) {
                                res.status(404).json(err);
                            } else {
                                // if value of the key is same as the value of the long url
                                if(output === long) {
                                    // return the key to the user
                                    let url = "";
                                    if(req.headers.host === "my-url-shorten.herokuapp.com") {
                                        url = req.headers.origin + '/' + listKeys[i];
                                    } else {
                                        url = 'http://localhost:3000/' + listKeys[i];
                                    }
                                    res.status(200).json(url);
                                } else {
                                    j++;
                                    // if no keys have the value that match with the value of the long url, 
                                    // generate a new key in the redis database
                                    if(j === listKeys.length) {
                                        client.set(uid, long, function(err, output) {
                                            if(err) {
                                                res.status(404).json(err);
                                            } else {
                                                let url = "";
                                                if(req.headers.host === "my-url-shorten.herokuapp.com") {
                                                    url = req.headers.origin + '/' + uid;
                                                } else {
                                                    url = 'http://localhost:3000/' + uid;
                                                }          
                                                res.status(200).json(url);
                                            }
                                        });

                                        let data = {
                                            id: uid,
                                            longUrl: long
                                        };              
                                        
                                        createIndex(req, res, uid, data);
                                    }
                                }
                            }
                        });                      
                    }
                } else {
                    // no key exists, create a new key
                    client.set(uid, long, function(err, output) {
                        if(err) {
                            res.status(404).json(err);
                        } else {     
                            let url = "";
                            if(req.headers.host === "my-url-shorten.herokuapp.com") {
                                url = req.headers.origin + '/' + uid;
                            } else {
                                url = 'http://localhost:3000/' + uid;
                            }          
                            res.status(200).json(url);
                        }
                    });

                    let data = {
                        id: uid,
                        longUrl: long
                    };              
                    
                    createIndex(req, res, uid, data);
                }
            }
        });        
    });
    
    // Get key value from the url and redirect to the desired location
    app.get("/:shortCode", function (req, res) {
        let code = req.params.shortCode;
        client.get(code, function(err, output) {
            if(err) {
                res.status(404).json(err);
            } else {
                res.redirect(output);
            }
        });
    });

    // Create index and store the url in the elasticsearch
    function createIndex(req, res, uid, data) {
        elasticClient.indices.exists({
            index: indexName
        }).then(function(resp) {
            if(!resp) {
                elasticClient.indices.create({
                    index: indexName
                }).then(function(resp) {
                    elasticClient.index({
                        index: indexName,
                        type: 'url',
                        id: uid,
                        body: data
                    }).then(function(resp) {
                        let response = resp;
                    }, function(err) {
                        console.log(err);
                    });
                }, function(err) {
                    console.log(err);
                });
            } else {
                elasticClient.index({
                    index: indexName,
                    type: 'url',
                    id: uid,
                    body: data
                }).then(function(resp) {
                    let response = resp;
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
    }
};