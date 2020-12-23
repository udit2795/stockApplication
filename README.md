# stockApplication
## Steps to start the project in local
- clone the repository
- run <b>npm i</b> in terminal
- run <b>npm start</b> to start the application

## CURL command to insert data in db
  1. To add a urer
  ```curl
  curl --location --request POST 'http://localhost:5000/addData' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=udit999' \
--data-urlencode 'password=pass' \
--data-urlencode 'email=udit999@gmail.com' \
--data-urlencode 'type=user' \
--data-urlencode 'stocks=[{"name": "CUB", "code": "cub","quantity": "4", "buyingPrice": "11.10"}]'
  
  ```
  2. To add a stock
  ```crul
  curl --location --request POST 'http://localhost:5000/addData' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=ICICI Bank' \
--data-urlencode 'type=stock' \
--data-urlencode 'code=ICICIBANK' \
--data-urlencode 'price=503.60' \
--data-urlencode 'high=611.99' \
--data-urlencode 'low=496.90'
  ```
 ** Please make sure stock code matches in both user and stock collection.
 
 3. To Add new stock in user stocks
 ```curl
 curl --location --request POST 'http://localhost:5000/buySellStock' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=udit@gmail.com' \
--data-urlencode 'type=buy' \
--data-urlencode 'code=reliance' \
--data-urlencode 'name=Reliance' \
--data-urlencode 'quantity=5' \
--data-urlencode 'buyingPrice=1998.80'
 ```
 4. To remove a stock from user stocks
 ```curl
 curl --location --request POST 'http://localhost:5000/buySellStock' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=udit@gmail.com' \
--data-urlencode 'type=sell' \
--data-urlencode 'code=reliance'
 ```
 
You can see this in live server as well. 
[click here](https://udit-stock-application.herokuapp.com/) 
 to have a look.
