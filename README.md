# Hypothetical Meals
ECE 458 design project.

## Requirements

### Setup
1. Clone the code in github
2. Run `npm install` in the root directory.
3. Create a `configs.js` file in the `./backend` directory using the following tempate, but filling in the fields:
```
module.exports = {
    mongoURI: <INSERT URI>,
    secretOrKey: "secret"
};
```
4. Run `npm start` in the root directory.

### Deployment Guide
To deploy using this guide, you need an Ubuntu 18.04 machine, which you can get from vcm.duke.edu.

Once the machine is reserved, ssh into it and download the .tar file containing 45gr8's code. After unpacking the code, do the following.

Create a `configs.js` file in the `./backend` directory using the following tempate, but filling in the fields:
```
module.exports = {
    mongoURI: <INSERT URI>,
    secretOrKey: "secret"
};
```

Then run `npm install` in the root directory

After this finishes, go into `bin` and run `./deploy 45gr8.colab.duke.edu`, or use whichever domain you created for your VCM. 

After this finishes running, you will need to run `sudo certbot --nginx -d`  and follow the prompts.   Once this finishes, restart nginx with `sudo systemctl reload nginx
`, then return to the root directory and run `npm run-script deploy`. This will deploy the app to production, and you can access it at the domain name you create.
