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


###
to cascade delete for events, when user is deleted
all successful response must be json


{
    "id": "sms_notifications",
    "enabled": true
}

doesn't have a time stamp, getting the order of creation might become cumbersome when the list starts to grow

it's better to capture the whole notification state of the user, than each individual state, over time.


what this means is that instead of storing each individual event email_notifications, or sms_notifications.
we can store the state of both event together. this way, we can query for the whole state at any point in time, and other services can aptly use the whole notifcation state (or even a single or subset), and make notification perference update more wholistically.

i also changed the id type to be unique, so each event can be uniquely identified, has the whole notifcation perference state, and a time stamp