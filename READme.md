# App for jotting down video ideas. Built with node.js and express. CRUD app accessing a mongoDB database for storage of data.

## Utilzes Node, Express, Handlebars, Passport and MongoDB

### Video idea form has two fields "title" and "details" both of which must be filled else flash messages appear and errors prevent form button from being able to submit.

### On successful submission of form title and details are send via 'post' request to mongodb and added to database.

### Ideas list section accesses mongodb via 'get' request and gets complete list of all idea titles and details and renders list.  