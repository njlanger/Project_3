Trading Dashboard – A visualization of equity securities with technical indicators

Overview:

The purpose of this project was to tell a story through data visualization. I chose to do a stock trading dashboard that was html based and driven by user input. I first needed to gather and combine the data using Python. The next step was to create a SQLite database that the API call could access. Once this was finished, the next steps were the Flask set-up and setting up the formatting of the data into JSON format. The coding to get data into the html came next. The interactive html allows the user to input a security ticker and choose from 1 of 4 technical indicators. The website will display a chart of the chosen security’s price alongside the S&P. In an information box, the selected security price and the technical indicator price along with information about that indicator will be displayed. The indicator that is selected will provide a ‘buy’ or ‘sell’ recommendation. 
Disclaimers for this project:
The project was meant for educational purposes only and not to provide trading advice. The prices that are used are from 01/26/2024 and are stagnant. There are only four technical indicators the user can choose from; when making investment decisions, considerations should be given to a larger number of factors. The ‘buy’/’sell’ recommendations are based solely on the theory of buying low and selling high. If a security’s price is below the technical indicator’s price, the recommendation is to ‘buy’. If the security’s price is above the technical indicator, the recommendation is to ‘sell’.
The files in the Trading Dashboard Folder are as follows:
All_stock_data.csv – stock data 
app_solution – Flask set-up and JSON formation
create_sqliteDB – taking the csv file and storing in a SQL database for access from the API                           
index.html – website locations
stock_data.sqlite – SQLite database
stock_pull – python code to pull stock data
visualization – JavaScript code behind the html

Instructions:

The app_solution.py needs to be run first. This sets up the database from SQLite. It then creates a Flask, which queries the data and prepares it in a JSON format. The API call is to local host, which is why the index.html will not function in the current situation. The index.html needs to be accessed, which loads the web page. Once the web page is loaded, a stock ticker can be entered into the ‘search bar’. A technical indicator can also be chosen. The technical indicator is what determines a ‘buy’ or ‘sell’ recommendation for the searched for stock ticker.



Data ethics considerations:

The data ethics of this project are that even with the above disclaimers, the website could be used in an adverse way other than the intention. This could lead to unintended actions being taken on a financial security which could lead to potential financial losses. The data itself does not disadvantage or isolate one group or individual from another. In other words, there is no data biases in this data set. 


Data sources:

Below are the data sources that were used for this project. StockAnalysis.com was used to obtain the universe of listed securities, as well as the data for the price target, 52-week low, 52-week high, and the 200-day moving average. 

Yahoo Finance via the ‘yfinance’ python library, was used to obtain data for open price, high price, low price, close price, adjusted close price, and volume. The Yahoo Finance data points are all from 01/26/2024.

Two libraries were used that were not covered in class – yfinance, for data gathering, and chart.js, for creating the charts within the html.

The Python code named ‘stock_pull’ was written from a combination of my coding knowledge and assistance from Stack Overflow.


Stock Analysis:

https://stockanalysis.com/

Yahoo Finance:

https://finance.yahoo.com/ 

yfinance library:

https://pypi.org/project/yfinance/

chart.js library:

https://www.chartjs.org/



