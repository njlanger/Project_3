import pandas as pd
import sqlite3

# Read the CSV data into a dataframe
df = pd.read_csv('All_stock_data.csv')

# Convert selected columns to numeric types
numeric_columns = ['Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume', 'Price Target', '52W Low', '52W High', '200 MA', 'Stock Price']
df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors='coerce')

# Convert 'Date' column to datetime type
df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

# Connect to the database
conn = sqlite3.connect('stock_data.sqlite')

# Create a new column 'id' as a composite primary key using 'Date' and 'Ticker'
df['id'] = df['Date'].astype(str) + '_' + df['Ticker']

# Replace the existing data in the 'stock' table with the modified data
df.to_sql('stock', conn, index=False, if_exists='replace', dtype={'id': 'TEXT PRIMARY KEY'})

# Close the connection
conn.close()
