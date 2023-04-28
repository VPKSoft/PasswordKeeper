Invoke-WebRequest -URI "https://use.fontawesome.com/releases/v6.4.0/fontawesome-free-6.4.0-web.zip" -OutFile "./fontawesome-free-6.4.0-web.zip"
Expand-Archive -Path "./fontawesome-free-6.4.0-web.zip" -DestinationPath "../src/assets/css"
rm "./fontawesome-free-6.4.0-web.zip"
