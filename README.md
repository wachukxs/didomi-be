# will run /migrations to create the tables in our database:
npx sequelize-cli db:migrate

npx sequelize-cli db:migrate:undo

# adding new fields
# https://dev.to/nedsoft/add-new-fields-to-existing-sequelize-migration-3527
npx sequelize-cli migration:generate --name created_new_associations

heroku logs -n 1500 --app corpers-online

npx sequelize-cli migration:generate --name starting-again   


# Create database specified by configuration
sequelize db:create

# Drop database specified by configuration
sequelize db:drop


# Add ejs linter to comman line
PATH=$PATH:/Users/chuks/Documents/Work/corpers.online/node_modules/ejs-lint/node_modules/.bin

# /Users/chuks/Documents/Work/corpers.online/node_modules/ejs-lint/node_modules/ejs/usage.txt

# https://ionicabizau.github.io/ejs-playground/

# sample ejslint command to lint a file
ejs ./views/pages/profile.ejs

# access to files
chmod +x ./file.sh
https://stackoverflow.com/a/53229323/9259701



### steps

* run `sequelize init`

https://stackoverflow.com/a/39442849/9259701

| Route | Method | Functionality |
| :---: | :---: | :---: |
| `/api/contacts` | GET | Retrive all contacts |
| `/api/contacts/:id` | PUT | Update the details of a contact |


| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |


| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |