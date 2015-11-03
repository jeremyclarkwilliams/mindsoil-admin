# mindsoil-admin
### MEAN app for Mindsoil CMS

**View Locally**

Clone repository:<br />
<code>$ git clone https://github.com/jeremyclarkwilliams/mindsoil-admin.git</code>

Navigate to app directory:<br />
<code>$ cd mindsoil-admin</code>

Install dependencies:<br />
<code>$ npm install</code>

Run Node app:<br />
<code>$ node app.js</code>

Open browser and navigate to [localhost:5000/admin/](http://localhost:5000/admin/)

**OR View as deployed on [Heroku](https://shrouded-sands-8450.herokuapp.com/admin/)**

#### Current Panel Features

* See listing and number of all projects
  - Toggle whether a project shows on site
  - Toggle whether a project is featured on homepage (only if toggled to "show")
* Add new projects (to MongoDB test database; persistent)
  - Project Name (must be unique; visual feedback if not)
  - Title
  - Blurb
  - Objective
  - Solution
  - Image (uploaded to folder /public/uploads/[uid]/)
  - (unique ID automatically assigned)
  - "Save" to add project and be taken to project edit page
  - "Save & Return" to add project and be taken back to listing page
  - "Cancel" to return to listing page without adding project
* Edit existing projects
  - Update all text fields and existing image
* Link back to listing via "Admin Panel" header

#### Future Panel Features

* Delete projects within app
  - currently projects must be deleted directly from database
* Update video on home page
* Update/add/remove quotes on about page
* Add videos to projects
