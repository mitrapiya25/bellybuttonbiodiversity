# -*- coding: utf-8 -*-
"""
Created on Sun May 20 18:11:46 2018

@author: mitra
"""
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask,
    render_template,
    jsonify)

app = Flask(__name__)

engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)

@app.route("/")
def index():
   return render_template("index.html")

@app.route("/names")
def names():
    sample =[]
    df = pd.read_csv("DataSets/belly_button_biodiversity_samples.csv", dtype=object)
    sample = list(df)
    sample.pop(0)
    return jsonify(sample)

@app.route("/otu")
def otu():
    df = pd.read_csv("DataSets/belly_button_biodiversity_otu_id.csv", dtype=object)
    otu_id = df.loc[:,'lowest_taxonomic_unit_found'].values.tolist()
    print(otu_id)
    return jsonify(otu_id)
 
@app.route("/samples/<tsample>")
def sample(tsample):
    df = pd.read_csv("DataSets/belly_button_biodiversity_samples.csv", dtype=object)
    df = df.loc[:,['otu_id', tsample]]
    df = df.sort_values(tsample,ascending=False)
    sample = [{"out_id":df.iloc[0:10,0].values.tolist(),
           "sample_values":df.iloc[0:10,1].values.tolist()
          }]
    return jsonify(sample)
 
@app.route('/metadata/<tsample>') 
def metadata(tsample):
    tsample = tsample[3:]
    df = pd.read_csv("DataSets/Belly_Button_Biodiversity_Metadata.csv", dtype=object)
    df = df.loc[df['SAMPLEID'] == tsample,:]
    df = df.loc[:,['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']]
    metadata =df.to_dict(orient="records")
    return jsonify(metadata)

@app.route('/wfreq/<tsample>')
def wfreq(tsample):
    tsample = tsample[3:]
    df = pd.read_csv("DataSets/Belly_Button_Biodiversity_Metadata.csv", dtype=object)
    df = df.loc[df['SAMPLEID'] == tsample,:]
    df = df.loc[:,['WFREQ']]
    wfreq =df.to_dict(orient="records")
    return jsonify(wfreq)

if __name__ == "__main__":
    app.run(debug=True)

