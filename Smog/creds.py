import json

creds = {}
creds['CONSUMER_KEY'] = 'xh3QxXMALqopTKlJDKLDsL2fq'
creds['CONSUMER_SECRET'] = 'COyegL7KHmeHKlYGEwsZUyanX48S5evlwZu2Dc2M46cfhL2bzT'
creds['ACCESS_TOKEN'] = '1202370909807501314-gxgPvdZ3HlUSpSisXWQ5tAKva9rSjQ'
creds['ACCESS_SECRET'] = 'U3eeGxqCcMkZ5dHCU62hSLPBAJEGwmQuJLpLJ5wmgOilZ'

with open("creds.json", "w") as file:
    json.dump(creds, file)