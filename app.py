# import dependencies 
import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


# Create engine using the `demographics.sqlite` database file
engine = create_engine("sqlite:///Jupyter/db/wine_data.sqlite")

# Declare a Base using `automap_base()`
Base = automap_base()

# Use the Base class to reflect the database tables
Base.prepare(engine, reflect=True)

# Print all of the classes mapped to the Base
Base.classes.keys()

# Assign the demographics class to a variable called `Demographics`
Wine= Base.classes.wine_db

# Create a session
session = Session(engine)# Create our session (link) from Python to the DB


#import necessary libraries
from flask import (Flask, 
                   jsonify, 
                   render_template, 
                   request, 
                   redirect)

# Flask Setup
app = Flask(__name__)


# Flask Routes
@app.route("/")
def default():
    return render_template("index.html")


@app.route("/columns")
def columns():
   # """Return a list of wines."""

    stmnt = session.query(Wine).statement
    df = pd.read_sql_query(stmnt, session.bind)
    df.set_index('id', inplace=True)

    # Returning list of the column names (sample names)
    # return jsonify(list(df.columns))
    return jsonify(list(df))

@app.route('/wines')
def list_wines():
    """Return the MetaData for a given sample."""
    
    results = session.query(Wine.id, Wine.country, Wine.description, Wine.designation, Wine.points, Wine.price, Wine.province, Wine.region_1, Wine.variety, Wine.winery).all()

    # Create a dictionary entry for each row of metadata information
    wines = []
    for result in results:
        wines.append({
        "ID":result[0],
        "Country":result[1],
        "Description":result[2],
        "Designation":result[3],
        "Points":result[4],
        "Price":result[5],
        "Province":result[6],
        "Region":result[7],
        "Variety":result[8],
        "Winery":result[9]   
        })

    return jsonify(wines)

if __name__ == '__main__':
    app.run(debug=True)