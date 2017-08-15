# mongoVsPostgis
I made this during my master thesis in 2015. It is 2 node.js apps, one with mongodb, one with postgis. The thesis was written only in Hungarian, but I'm planning to add a sketchy translation about the important parts.

## Run

You can run both projects with the following command:

```bash
nodemon app.js
```

## Usage

You can send HTTP get requests to the port 3001 (postgres) and 8080 (mongodb)

The requests should look like:

http://localhost:3001/api/warmup-countries

Both of app has several api calls, you can find those in the app.js files (sometimes with example parameters in comments).

## Considerations

Please keep in mind that I finished this project in May of 2015 therefore it not working with newer version (7+) of Node.js
