# Import dependencies
import pandas as pd
import yfinance as yf
import datetime

# Define timeframe
start = datetime.datetime(2023, 1, 1)
end = datetime.datetime(2023, 12, 31)

# What stock sybol to pull
Symbols = ["AAPL"]

# Loop through the securities list
for i in Symbols:
    # print the symbol which is being downloaded
    print(str(Symbols.index(i)) + str(' : ') + i)

    try:
        # download the stock price
        stock = yf.download(i, start=start, end=end, progress=False)

        if not stock.empty:
            stock['Ticker'] = i  # Add a new column 'Ticker' with the stock symbol
            stock.reset_index(inplace=True)  # Reset the index to default integers
            df_existing = pd.read_csv('/Users/njlan/OneDrive/Desktop/Project_3/combined.csv')

    
            if df_existing.empty:
                df_combined = stock
                df_combined.to_csv('/Users/njlan/OneDrive/Desktop/Project_3/combined.csv', index=False)
                
            else:
                df_combined = pd.concat([df_existing, stock], ignore_index=True)
                df_combined.to_csv('/Users/njlan/OneDrive/Desktop/Project_3/combined.csv', index=False)
    except Exception as e:
        print(f"An unexpected error occurred for {i}: {e}")
