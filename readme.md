[![CircleCI](https://circleci.com/gh/opendialogai/webchat/tree/master.svg?style=svg&circle-token=ef6ed717ecefce0b6acabcd01a40dc913370412a)](https://circleci.com/gh/opendialogai/webchat/tree/master)

# Steps to use this package

## Composer set up

Require as a dependency in your composer.json file

+ Add the repository to the repositories section:

             {
                 "type": "git",
                 "url": "https://github.com/GreenShootLabs/OpenDialog-Webchat.git"
             }
             
+ As this is hosted in a private Repo at the moment, you will need credentials to be able to pull it in. Generate a key\
in GitHub personal access token for an account that has access to this repo.

+ Create a file named `auth.json` in the root of your project that looks like this and includes the token generated

      {
        "http-basic": {},
        "github-oauth": {
          "api.github.com": "{token}"
        }
      }
      
+ Install the composer dependencies with `composer update`

## Front end set up

+ Change to the `vendor/opendialog/webchat-frontend` directory and run `npm install; npm run dev` (for development)

+ Publish the update script by running:
    + `php artisan vendor:publish --tag=scripts`
    
+ This should move a script named `update-web-chat.sh` to your project root. Run it every time there is an update to OpenDialog webchat by running:
```bash update-web-chat.sh``` 

## Pusher Setup

Change the value for BROADCAST_DRIVER from whatever it is currently to 'pusher', and define the following variables in your .env file:

+ PUSHER_APP_ID
+ PUSHER_APP_KEY
+ PUSHER_APP_SECRET
+ PUSHER_CLUSTER

# Configuration 

The webchat configuration can be found in the `webchat_settings` table. Before running, the config table should be seeded
by running:

```php artisan db:seed --class="OpenDialogAi\Webchat\Database\Seed\WebchatSettingsTableSeeder"```

This will load a row for each available setting. If new settings are added, they should be added in a separate seeder file.

Config items can still be overwritten in the `openDialogSettings` javascript variable that is added to the parent web page.

# Features

## Chat Open param

If the url of the page hosting the chatbot has the query param 'chat_open=true', the chat will load pre-opened

## Callback ID of open event

When the chat window is opened, and default callback_id of welcome is sent along with the chat open event. This can be
overridden by setting the 'callback_id' query param on the url of the page hosting the chatbot. Whatever value is set
as the query param will be sent with the chat open event. It is then down to the user to set up a conversation that
deals with that callback_id 

## Comments tab

The webchat widget can fetch comments from an endpoint matching the JSON:API spec. To enable comments, add a
commentsEnabled parameter to opendialogSettings, set to true. You will additionally need to pass information
about the comment entity name, author entity name, and section entity name. (If present)

Example config:

```javascript
window.opendialogSettings = {
    url: "{{env('APP_URL')}}",
    commentsEnabled: true,
    commentsApiConfig: {
        axiosConfig: {
            baseURL: 'http://localhost/json/',
            headers: {
              // Authorization: `Bearer ${Laravel.apiToken}`,
              'Content-Type': 'application/vnd.api+json'
            }
        },
        // Pass the user ID here.
        loggedInUserId: '{{ env('USER_ID') }}',
        comment: {
            entityName: 'comments',
            fieldMapping: {
                createdField: 'created',
                textField: 'comment',
                readField: 'read',
            },
        },
        author: {
            entityName: 'people',
            relationshipName: 'commentAuthor',
            fieldMapping: {
                idField: 'id',
                nameField: 'name',
            },
        },
        section: {
            entityName: 'posts',
            relationshipName: 'post',
            fieldMapping: {
                idField: 'id',
                nameField: 'title',
            },
        },
        sectionPathPattern: 'home\\\/posts\\\/(\\\d*)$',
    },
};
```

## Running Code Sniffer
To run code sniffer, run the following command
```./vendor/bin/phpcs --standard=psr12 src/```
