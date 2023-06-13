# Nextjs TesloShop  App 
needs db to run locally 

``` docker-compose up -d ```

* -d = detached

* Local URL

``` mongodb://localhost:27017/teslodb ```


## Call the database with development info with

``` http://localhost:3000/api/seed ```


# Take a look in the link below 

### https://tesloshop-pi.vercel.app/ ###

### PaypalSandbox: sb-iswd816861968@personal.example.com ###

### Production .env file ###

``` 
HOST_NAME='Host base URL'


MONGO_URL=mongodb+srv://test:test@cluster0.7egwi.mongodb.net/teslodb

JWT_SECRET_SEED=Th!s!S@$ecretTok3n
NEXTAUTH_SECRET=92bae302adaa78800d4658c616d6e6a7

NEXT_PUBLIC_TAX_RATE=0.09

# Providers
GITHUB_ID=aa96bdd6bffbf38ddf64
GITHUB_SECRET=651ed274c210eb7dc5d15c7d402df3f852211f8c

# Paypal
NEXT_PUBLIC_PAYPAL_CLIENT=AXPyJGm7NfeXQx_uNi5icI85Wf3X3RAw6oxENSRGALEbRNT58jxJkXtxQaSjcKyMaCtwICohHeuLB9jN
PAYPAL_SECRET=ELvb5Kuwx99fcUVq-j79hEWvVhLWa9u7qygaKUXCU-_Nqcvkx7teaz92jxKLZXrTy8IyaEBdd-tO3x0r


PAYPAL_OAUTH_URL=https://api-m.sandbox.paypal.com/v1/oauth2/token
PAYPAL_ORDERS_URL=https://api.sandbox.paypal.com/v2/checkout/orders


# CLOUDINARY 
CLOUDINARY_URL=cloudinary://984454644236667:JraX5pVBcjL6esWTO37GF_fPPLE@dyej4hpgt
```

