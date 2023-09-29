# Veracode HMAC Authorization

An extension for the RapidApi (Paw) REST Client to authenticate into the Veracode REST APIs using HMAC.

## Setup


If you have more than one Veracode credential profile defined in your `~/.veracode/credentials` you can specify which profile to authenticate with. Create an environment variable with the value of the api creds profile you're using, and in the Dynamic Value select your newly created environment variable.
![Example Profile Env Variable Setup GIF](setup_example.gif)