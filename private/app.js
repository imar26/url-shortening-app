module.exports = function(app, client) {
    var ShortUniqueId = require('short-unique-id');
    // Rest Api's
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, 'src/index.html'));
    });
    
    app.post("/api/shortenUrl", function (req, res) {
        var long = req.body.url;
        var uid = new ShortUniqueId();
        uid = uid.randomUUID(6);
        client.keys("*", function(err, listKeys) {
            if(err) {
                res.status(404).json(err);
            } else {            
                if(listKeys.length > 0) {
                    let j = 0;
                    for(let i=0; i<listKeys.length; i++) {                        
                        client.get(listKeys[i], function(err, output) {
                            if(err) {
                                res.status(404).json(err);
                            } else {
                                if(output === long) {
                                    res.status(200).json(listKeys[i]);
                                } else {
                                    j++;
                                    if(j === listKeys.length) {
                                        client.set(uid, long, function(err, output) {
                                            if(err) {
                                                res.status(404).json(err);
                                            } else {
                                                res.status(200).json(uid);
                                            }
                                        });
                                    }
                                }
                            }
                        });                      
                    }
                } else {
                    client.set(uid, long, function(err, output) {
                        if(err) {
                            res.status(404).json(err);
                        } else {
                            res.status(200).json(uid);
                        }
                    });
                }
            }
        });        
    });
    
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
};