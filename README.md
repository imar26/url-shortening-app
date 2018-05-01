# URL Shortening App

This is an URL-Shortening APP which takes the entire URL as the input and converts that input into a 6 digit short unique uid and returns back to the user with a short link. The user clicks on this new link, which in turn redirects the user to the original url passed as an input by the user.

## Steps to Setup and Run the Application

### Installation and Running
1. You need to have **angular cli**, **node.js**, **npm**, **redis**, **elasticsearch** and **kibana** installed on your machine. Once installed, you can check the versions using the below commands

```sh
node -v
npm -v
```
Links for reference:
* [install node.js](https://nodejs.org/en/download/)
* [install angular-cli](https://github.com/angular/angular-cli)
* [install redis](https://www.npmjs.com/package/redis)
* [install elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/5.2/windows.html)
* [install kibana](https://www.elastic.co/guide/en/kibana/current/windows.html)

2. Clone the project from GitHub Repository and Install all the necessary packages
```sh
git clone https://github.com/imar26/url-shortening-app.git
cd url-shortening-app
npm install
```
3. Start node.js server
```sh
node index.js
```

4. Start angular server
```
npm start
```

5. Start Elasticsearch and Kibana console
    1. In one shell run
        ```
        cd {{path to elastic-search}}
        .\bin\elasticsearch.bat
        ```
    2. In another shell run
        ```
        cd {{path to kibana}}
        .\bin\kibana.bat
        ```

6. Open your browser and go to [http://localhost:4200/](http://localhost:4200/)

### Technologies Used

* Node.js
* Angular 4
* Redis
* Express JS
* REST API
* Elasticsearch
* Kibana

### Production

Application deployed on: https://my-url-shorten.herokuapp.com/

Kibana Server: https://fig-5382430-us-east-1.k4s.bonsaiapps.net/app/kibana#/dev_tools/console?_g=()
