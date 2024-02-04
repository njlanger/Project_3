from sqlite3 import Date
import numpy as np
import logging

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///stock_data.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine, reflect=True)

# Save reference to the table
print(Base.classes.keys())
stock = Base.classes.stock

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/api/data/<base_ticker>", methods=['GET'])
def get_data(base_ticker):
    session = Session(engine)
    try:
        # Query the required columns for the specified ticker
        results = session.query(
            stock.Date, 
            stock.Ticker, 
            getattr(stock, 'Price Target'), 
            getattr(stock, '52W Low'),
            getattr(stock, '52W High'), 
            getattr(stock, '200 MA'), 
            getattr(stock, 'Stock Price'),
            getattr(stock, 'Close')
        ).filter(stock.Ticker == base_ticker).all()

        # Log the data being retrieved
        for data in results:
            logging.info(f"Data: {data}")

        # Prepare the JSON data
        stock_data = [{
            "Date": data.Date, 
            "Ticker": data.Ticker, 
            "PriceTarget": float(getattr(data, 'Price Target')) if getattr(data, 'Price Target') else None,
            "52WLow": float(getattr(data, '52W Low')) if getattr(data, '52W Low') else None,
            "52WHigh": float(getattr(data, '52W High')) if getattr(data, '52W High') else None,
            "200MA": float(getattr(data, '200 MA')) if getattr(data, '200 MA') else None,
            "StockPrice": float(getattr(data, 'Stock Price')) if getattr(data, 'Stock Price') else None,
            "Close": float(getattr(data, 'Close')) if getattr(data, 'Close') else None
        } for data in results]

        return jsonify(stock_data)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)