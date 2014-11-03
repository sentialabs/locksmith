# Locksmith
Locksmith is a browser extension for easily accessing the AWS console.
This tool is especially useful when managing many AWS accounts.

The principle is as follows:

  * Each physical person has one single personal IAM User.
  * Using the credentials of this single IAM user, the user can assume an
    IAM Role within any number of AWS accounts.
  * Locksmith enables your browser to access the AWS console of all the
    accounts in which you can assume a IAM Role.

For more information, please see the [Locksmith](http://www.sentialabs.io/locksmith.html)
page on [Sentia Labs](http://www.sentialabs.io).

![](http://www.sentialabs.io/assets/locksmith/bookmarks.png)

## Getting Started

### Install from Source
  1. Run `npm install`
  2. Add the extension in Chrome
     * Visit chrome://extensions/
     * Make sure the "Developer mode" checkbox is checked
     * Click "Load unpacked extension..."
     * Select the directory where you cloned the Locksmith extension source

### Use Locksmith Standalone
Locksmith can be used standalone and managed by a service.
Here we show how to setup Locksmith to work standalone.

#### Create an IAM User
First, create one IAM user in either your personal AWS account or in a AWS
account dedicated to holding IAM users for locksmith.
This IAM user will be solely used to assume roles in other AWS accounts, we will
configure its credentials in Locksmith.
Please create a dedicated IAM user, please don't add any other policies than the
one specified below.

You should choose a unique name for the user, we will use this as a name for
both the IAM User and the IAM Roles that will be created in the target accounts.
We suggest you use the user's email address as a name, in the examples we will
use `kif.kroker@doop.gov`, please replace this with the name of your preference.

  1. You can access Locksmith settings, by opening the Locksmith window and
     **clicking the cogwheel icon**.
  1. Please **enable "Use Local storage"**, this will disable the management of
     Locksmith by an API and enable the local database of bookmarks.
  1. In the AWS console, **create an IAM user** for programmatic access named
     `kif.kroker@doop.gov`, _do not add any policy yet!_
  1. **Fill the credentials** for the just created IAM user in the Locksmith's
     settings page.
  1. In the AWS console, show the details for the new IAM user, and in the
     Permissions tab **click the tiny "Add inline policy" link** in the lower
     right bottom of the tab.
  1. Select "Custom Policy"
  1. **Add the following _inline_ policy:**  
     **Name:** `stsAssumeRole`  
     **Policy Document:**
     
     ```json
     {
         "Statement": [
             {
                 "Effect": "Allow",
                 "Action": "sts:AssumeRole",
                 "Resource": "arn:aws:iam::*:role/kif.kroker@doop.gov"
             }
         ]
     }
     ```

  1. **Enable MFA for the IAM user** and **fill the serial/arn of the MFA in the
     extension's settings** page.
  1. **Make a note of the account ID** for the AWS account the user was created in,
     you can find this as the 12-digit number that is part of the User ARN.

#### Create an IAM Role
Second, create one IAM role for Cross-Account Access in an AWS account you would
like to manage.

As name for this role, you need to use the name that was specified in the policy
for the IAM user above.

  1. **Create a new IAM role** named `kif.kroker@doop.gov`.
  2. **Select the Role Type** "Role for Cross-Account Access", "Provide access
     between AWS accounts you own".
  3. **Enter the Account ID** of the account in which the IAM user was created.
  4. Select **"Require MFA"**.
  5. **Attach a Policy** you would like to use, for example "PowerUserAccess".
  6. **Make a note of the account ID** of this account, you can find this as
     the 12-digit number that is part of the Role ARN.
     
#### Create a Bookmark
  1. Open Locksmith.
  2. Click the **plus-sign** icon in the upper left corner of the popup window.
  3. Choose a **name for the bookmark**, something that clearly identifies the
     target account.
  4. Fill the **account ID** of the AWS account in which the IAM role was created.
  5. Fill the **name of the IAM role**, in the case of the example that would
     be `kif.kroker@doop.gov`.
  6. Optionally provide an URL of an image to be used as icon for the
     bookmark. You can also provide an email addres for which the Gravatar
     will be shown. Or provide a random string and it will show a Gravatar
     Identicon as bookmark.
  7. **Save** the bookmark.
 
#### Test Locksmith
  1. Open Locksmith.
  2. Click the **Bookmark**.
  3. A popup should appear, enter the current **MFA token**.
  4. A new browser window should open with **the AWS portal** for the target
     account.

## Development

Run `grunt` after JS/CSS changes to compile new JS/CSS bundles.

While `npm start` is running, you can access the application at http://127.0.0.1:8080/app/

## Running the Tests

### Unit Tests

```
npm test
```

### End-to-End Tests

```
npm start &
npm run protractor
```

### Example Configuration URL
chrome-extension://idahiicmmneinnceklagffdlmgdmdnhc/app/index.html

```
http://localhost:8080/app/#/setup?use_local_storage=false&incognito_sessions=true&api=https://beagle.unitt-route53.com/api&api_username=n/a&api_password=secret&aws_access_key_id=AKIAXXXXXXXX&aws_secret_access_key=xxxxxxxxxx&mfa_serial_number=arn:aws:iam::12345654321:mfa/somebody&account_management=false
```
