# mindsoil-admin
### MEAN app for Mindsoil CMS

Clone repository:<br />
<code>$ git clone https://github.com/jeremyclarkwilliams/mindsoil-admin.git</code>

Navigate to app directory:<br />
<code>$ cd mindsoil-admin</code>

Install dependencies:<br />
<code>$ npm install</code>

Run Node app:<br />
<code>$ node app.js</code>

Open browser and navigate to [localhost:5000/admin/](http://localhost:5000/admin/)

#### Current Panel Features

* See listing of all projects
* Add new projects (added to MongoDB database)
  - Project Name (must be unique; visual feedback if not)
  - Title
  - Blurb
  - Objective
  - Solution
  - Image (uploaded to folder /public/uploads/)
  - (unique ID automatically assigned)
* Edit existing projects
  - Update existing images
* Toggle whether a project shows on site (from listing)
* Toggle whether a project is featured on homepage (from listing; only if toggled to "show")

#### Future Panel Features

* Delete projects within app
  - currently projects must be deleted directly from database
* Update video on home page
* Update/add/remove quotes on about page
* Add/update videos to projects
