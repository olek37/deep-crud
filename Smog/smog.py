from twython import Twython
import pandas as pd

from geopy.geocoders import Nominatim
import gmplot

import json

with open("creds.json", "r") as file:
    creds = json.load(file)

python_tweets = Twython(creds['CONSUMER_KEY'], creds['CONSUMER_SECRET'])

query = {'q': 'smog',
        'result_type': 'popular',
        'count': 10000,
        'lang': 'en',
        }

dict_ = {'user': [], 'date': [], 'text': [], 'location': []}

tweets = python_tweets.search(**query)

for status in tweets['statuses']:
    dict_['user'].append(status['user']['screen_name'])
    dict_['date'].append(status['created_at'])
    dict_['text'].append(status['text'])
    dict_['location'].append(status['user']['location'])

df = pd.DataFrame(dict_)
df.sort_values(by='date', inplace=True, ascending=False)
df.head(5)

geolocator = Nominatim()

coordinates = {'latitude': [], 'longitude': []}

for count, user_loc in enumerate(df.location):
    try:
        location = geolocator.geocode(user_loc)
        
        if location:
            coordinates['latitude'].append(location.latitude)
            coordinates['longitude'].append(location.longitude)
        
    except:
        pass
    
gmap = gmplot.GoogleMapPlotter(30, 0, 3)

gmap.heatmap(coordinates['latitude'], coordinates['longitude'], radius=20)

gmap.draw("python_heatmap.html")