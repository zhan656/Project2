# import necessary libraries
from sqlalchemy import func
import datetime as dt
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask import Flask, jsonify, render_template, request, flash, redirect
from flask_sqlalchemy import SQLAlchemy

import sqlite3


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # default
#################################################
# Data Setup
#################################################

# This is how you make a connection
conn = sqlite3.connect("Wine.DB")

# Write to DB
wine_data = pd.read_csv("Data/clean_winemag-data.csv")
wine_data.to_sql("wine", conn, if_exists="replace")

# This will read
query = "select * from wine"
wine_df = pd.read_sql(query, conn)
# # otu_id
# Otu_id = pd.read_csv("DataSets/Belly_Button_Biodiversity_otu_id.csv")
# otu_id_df = pd.DataFrame(Otu_id)

# #samples
# Samples = pd.read_csv("DataSets/Belly_Button_Biodiversity_samples.csv")
# samples_df = pd.DataFrame(Samples)
# # Fill NAN values in 'samples' dataframe with 0
# samples_df = samples_df.fillna(0)

#################################################
# Flask Routes
#################################################
@app.route("/")
# """Return the dashboard homepage."""
def home():
    return render_template("index.html")
    


@app.route('/names')
# """List of wine variety names.
# Returns a list of sample names in the format
# [
    # "Champagne Blend",
    # "Champagne Blend",
    # "Champagne Blend",
    # "Champagne Blend",
    # "Champagne Blend",
    # "Champagne Blend",
    # "Champagne Blend",
    # ...
# ]

# """
def names():
    names = list(set(list(wine_df['variety'])))
    return jsonify(names)

@app.route('/price_points/<variety>')
# """List of prices, points and country for a certain wine variety.

# Returns a list of OTU descriptions in the following format

# [
    # 20,
    # 40,
    # 121,
    # 15,
    # 65,
    # ...
# ]
# """
def price_points(variety):
    prices = list(wine_df[wine_df['variety']==variety]['price'])
    points = list(wine_df[wine_df['variety']==variety]['points'])
    countries = list(wine_df[wine_df['variety']==variety]['country'])
    return jsonify({"points": list(map(int,points)), "prices": list(map(int,prices)), 'countries':countries})

    
@app.route('/metadata/<variety>')
# """MetaData for a given sample.


# Returns a json dictionary of sample metadata in the format

# {
    # Rating_Count: 200,
    # Min_Price: 4,
    # Max_Price: 2000,
    # Highest_Rating: "Winery Name"
    # Lowest_Rating; "Winery Name",
# }
# """
def meta(variety):
    prices = list(wine_df[wine_df['variety']==variety]['price'])
    points = list(wine_df[wine_df['variety']==variety]['points'])
    Rating_Count = len(points)
    Min_Price = min(prices)
    Max_Price = max(prices)
    variety_df = wine_df.loc[wine_df['variety']==variety,['points','winery']]
    Highest_Rating = list(set(variety_df[variety_df['points']==max(points)]['winery']))
    Lowest_Rating = list(set(variety_df[variety_df['points']==min(points)]['winery']))
    # all_meta = wine_df[wine_df['SAMPLEID'] == sampleID]
    # age = int(all_meta.AGE)
    # BBTYPE = all_meta.iloc[0]["BBTYPE"]
    # ETHNICITY = all_meta.iloc[0]["ETHNICITY"]
    # gender = all_meta.iloc[0]["GENDER"]
    # location = all_meta.iloc[0]["LOCATION"]
    sample_metadata = {}
    sample_metadata['Vareity Name'] = variety 
    sample_metadata['Rating_Count'] = Rating_Count
    sample_metadata['Min_Price (USD)'] = Min_Price
    sample_metadata['Max_Price (USD)'] = Max_Price
    sample_metadata['Highest Rating Winery'] = Highest_Rating
    sample_metadata['Lowest Rating Winery'] = Lowest_Rating
    return jsonify(sample_metadata)
    
    

if __name__ == "__main__":
    app.run(debug=True)


##############################################################################################################33