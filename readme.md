[![CircleCI](https://circleci.com/gh/opendialogai/webchat/tree/master.svg?style=svg&circle-token=ef6ed717ecefce0b6acabcd01a40dc913370412a)](https://circleci.com/gh/opendialogai/webchat/tree/master)

This is the OpenDialog webchat package that contains the vue based webchat bot and APIs and database config for webchat settings.

# Setting up for Local Development

This application is intended to be worked on using the [OpenDialog Development Environment](https://github.com/opendialogai/opendialog-dev-environment.)
Please follow instructions there for setting up the containers. Tests should be run from within the `workspace` container.

## Running Code Sniffer

To run code sniffer, run the following command
```./vendor/bin/phpcs --standard=od-cs-ruleset.xml src/ --ignore=*/migrations/*,*/tests/*```

## Git Hooks

To set up the included git pre-commit hook, first make sure the pre-commit script is executable by running

```chmod +x .githooks/pre-commit```

Then configure your local git to use this directory for git hooks by running:

```git config core.hooksPath .githooks/```

Now every commit you make will trigger php codesniffer to run. If there is a problem with the formatting
of the code, the script will echo the output of php codesniffer. If there are no issues, the commit will
go into git.

# Steps to use this package in an application

## Composer set up

To install using [Composer](https://getcomposer.org/) run the following command:

`composer require opendialogai/webchat`

## Building Front End Assets

### CI build of assets

This project has been set up so that `css`, `js` and `image` assets are not pushed from the developers machine (they are
part of `.gitignore` to make sure). Instead, they are built and pushed by the
[CI process](https://app.circleci.com/pipelines/github/opendialogai/webchat) on each commit.

### Manual build of assets

To build assets whist developing follow this process:

+ Change to the `vendor/opendialog/webchat-frontend` directory and run `npm install; npm run dev` (for development)

+ Run `php artisan vendor:publish --tag=public --force` to move the newly built assets into the parent application to be
served

# Configuration 

The webchat configuration can be found in the `webchat_settings` table. Before running, the config table should be seeded
by running:

```php artisan webchat:settings```

This will load a row for each available setting.

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
commentsEnabled parameter to openDialogSettings, set to true. You will additionally need to pass information
about the comment entity name, author entity name, and section entity name. (If present)

Example config:

```javascript
window.openDialogSettings = {
    url: "{{env('APP_URL')}}",
    user : {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@opendialog.ai',
        external_id: "{{ auth()->user()->id }}",
    },
    comments: {
        commentsEnabled: true,
        commentsName: 'Comments',
        commentsAxiosConfig: {
            baseURL: 'http://localhost/json/',
            headers: {
                // eslint-disable-next-line no-undef
                Authorization: `Bearer {{ auth()->user()->api_token }}`,
                'Content-Type': 'application/vnd.api+json',
            },
        },
        commentsEntityName: 'comments',
        commentsCreatedFieldName: 'created',
        commentsTextFieldName: 'comment',
        commentsAuthorEntityName: 'people',
        commentsAuthorRelationshipName: 'commentAuthor',
        commentsAuthorIdFieldName: 'id',
        commentsAuthorNameFieldName: 'name',
        commentsSectionEntityName: 'posts',
        commentsSectionRelationshipName: 'post',
        commentsSectionIdFieldName: 'id',
        commentsSectionNameFieldName: 'title',
        commentsSectionPathPattern: 'home\\\/posts\\\/(\\\d*)$',
    },
};
```
