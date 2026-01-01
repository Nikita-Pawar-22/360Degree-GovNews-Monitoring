from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
import json
import csv
import requests
from bs4 import BeautifulSoup
import subprocess
from api import Aajtak_Video
from api import IndianExpress_Video
from api import ZeeNews_Video
import threading
import time
import xlsxwriter
import pandas as pd
import contractions
import re
import nltk
from nltk.tokenize import ToktokTokenizer
import spacy
import nltk
from deep_translator import GoogleTranslator
from keras.models import load_model
from transformers import TFDistilBertModel
from keras.preprocessing.sequence import pad_sequences
from transformers import DistilBertTokenizer
from keras.preprocessing.sequence import pad_sequences
import numpy as np
from transformers import AutoModelForSequenceClassification
from transformers import TFAutoModelForSequenceClassification
from transformers import AutoTokenizer
import numpy as np
from scipy.special import softmax
import csv
import urllib.request
import pandas as pd
import torch

import urllib.request
from urllib.request import urlopen
import ssl
import json
ssl._create_default_https_context = ssl._create_unverified_context


tokenizer = AutoTokenizer.from_pretrained("tokenizer_roberta/sentiment_tokenizer/")
model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment/")
labels=[]
# mapping_link = f"https://raw.githubusercontent.com/cardiffnlp/tweeteval/main/datasets/sentiment/mapping.txt"
# with urllib.request.urlopen(mapping_link,timeout=120) as f:
#     html = f.read().decode('utf-8').split("\n")
#     csvreader = csv.reader(html, delimiter='\t')
mapping_file_path = "mapping.txt"

with open(mapping_file_path, 'r', encoding='utf-8') as file:
    csvreader = csv.reader(file, delimiter='\t')
    labels = [row[1] for row in csvreader if len(row)>1]

from django.shortcuts import render

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import YourModel


def about_view(request):
    return render(request, 'about.html')


def sentiment(row):
    text = row[:1500]
    encoded_input = tokenizer(text, return_tensors='pt') 
    with torch.no_grad():  
        output = model(**encoded_input)
    scores = output.logits[0]  
    scores = torch.softmax(scores, dim=0)

    ranking = torch.argsort(scores, descending=True)
    max_score = 0
    ans=[0,0,0]
    for i in range(scores.shape[0]):
        l = labels[ranking[i].item()]
        s = scores[ranking[i]].item()
        if(l=="neutral"):
            ans[2]=s
        elif(l=="negative"):
            ans[1]=s
        else:
            ans[0]=s

    return ans[:]

custom_objects = {'TFDistilBertModel': TFDistilBertModel}

loaded_model = load_model("distilbert_model.h5", custom_objects=custom_objects)
categories = {
0:"Entertainment",
1:"Business" ,
2:"Politics" ,
3:"Judiciary" ,
4:"Crime"  ,
5:"Culture" ,
6:"Sports" ,
7:"Science"  ,
8:"International" ,
9:"Technology" 
}
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
print("tokenizer ready")
max_length = 512

def predict_text(loaded_model, text):

    inputs = tokenizer(text, return_tensors='tf', truncation=True, padding='max_length', max_length=max_length)
    

    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    

    predictions = loaded_model.predict([input_ids, attention_mask])
    
    return predictions




def classification(row):


    example_text = row
    predictions = predict_text(loaded_model, example_text)

    value_to_find = predictions[0].argmax()
    predicted_class = categories[value_to_find]
    return predicted_class


def preprocess(series):
    series = series.apply(lambda x: str(x).lower())
    
    def remove_contractions(row):
        return contractions.fix(row)
    series = series.apply(lambda x: remove_contractions(x))
    
    series = series.str.replace(r'[^\w\s]', '', regex=True)
    
    series = series.str.replace(r'[^a-zA-Z0-9\s]', '', regex=True)
    
    def remove_numbers(text):
        pattern = r'[^a-zA-z.,!?/:;\"\'\s]' 
        return re.sub(pattern, '', text)
    series = series.apply(lambda x: remove_numbers(x))
    
    nlp = spacy.load('en_core_web_sm')
    def get_lem(text):
        text = nlp(text)
        text = ' '.join([word.lemma_ if word.lemma_ != '-PRON-' else word.text for word in text])
        return text
    series = series.apply(lambda x: get_lem(x))
    
    tokenizer = ToktokTokenizer()
    stopword_list = nltk.corpus.stopwords.words('english')
    stopword_list.remove('not')
    def remove_stopwords(text):
        tokens = tokenizer.tokenize(text)
        tokens = [token.strip() for token in tokens]
        t = [token for token in tokens if token.lower() not in stopword_list]
        text = ' '.join(t)    
        return text
    series = series.apply(lambda x: remove_stopwords(x))
    return series


def PreProcessTheData():
    df = pd.read_excel("IndiaToday.xlsx")
    def remove_edited(row):
        index_of_edited_by = row.find("Edited By: ")

        if index_of_edited_by != -1:
            modified_text = row[:index_of_edited_by]
            return modified_text
        else:
            return row
    df.Body = df.Body.apply(lambda x: remove_edited(x)) 
    df = df[~df['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df = df[~df['Heading'].str.contains('horoscope', case=False)]
    df.Body = preprocess(df.Body)
    df = df.dropna()
    df2 = pd.read_excel("AajTak_Video.xlsx")
    df2 = df2[~df2['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df2 = df2.loc[~(df2['Heading'].str.contains("Aaj Ki Baat") | df2['Heading'].str.contains("Horoscope")
                | df2['Heading'].str.contains("Aap Ki Adalat"))]
    
    df2 = df2[~df2['Heading'].str.contains('horoscope', case=False)]

    df2.Body = preprocess(df2.Body)
    df2 = df2.dropna()
    df3 = pd.read_excel("IndianExpress_Video.xlsx")
    df3 = df3[~df3['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df3 = df3[~df3['Heading'].str.contains('horoscope', case=False)]
    df3.Body = preprocess(df3.Body)
    df3 = df3.dropna()
 
    df4 = pd.read_excel("ZeeNews_Video.xlsx")
    df4 = df4[~df4['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df4 = df4[~(df4['Body'].str.contains('dear subscriber', case=False))]
    df4 = df4[~df4['Heading'].str.contains('horoscope', case=False)]
    df4.Body = preprocess(df4.Body)
    
    df4 = df4.dropna()
    
    df5 = pd.read_excel("News18_Punjab.xlsx")
    df5 = df5[~df5['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df5 = df5[~(df5['Body'].str.contains('dear subscriber', case=False))]
    df5 = df5[~df5['Heading'].str.contains('horoscope', case=False)]
    df5.Body = preprocess(df5.Body)
    df5 = df5.dropna()
    df6 = pd.read_excel("AajTak.xlsx")
    df6 = df6[~df6['Body'].apply(lambda x: isinstance(x, (float, int)))]
    df6 = df6[~(df6['Body'].str.contains('dear subscriber', case=False))]
    df6 = df6[~df6['Heading'].str.contains('horoscope', case=False)]
    df6.Body = preprocess(df6.Body)
    df6 = df6.dropna()
    df7 = pd.concat([df,df2,df3,df4], ignore_index=True, axis=0, join='outer')
    df7["Cat"]=df7["Body"].apply(lambda x:classification(str(x)))
    df7["Sentiment"] = df7.Body.apply(lambda x: sentiment(str(x)))
    df7.shape
    file_name = "Final_Prepped_Data.xlsx"
    df7.to_excel(file_name, index=False)
    
    
def thePrint():
    import xlsxwriter
    
    # Create a new Excel workbook
    workbook = xlsxwriter.Workbook('ThePrint.xlsx')
    worksheet = workbook.add_worksheet()
    
    # Write headers to the first row of the worksheet
    headers = ["Heading", "Body", "Category", "URL"]
    for col, header in enumerate(headers):
        worksheet.write(0, col, header)
    
    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]
    
    # Write dummy data to the Excel file
    for row, data in enumerate(dummy_data, start=1):
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
    
    # Close the workbook to save changes
    workbook.close()

# Call the function to generate the Excel file
thePrint()

       

def News18():
    import xlsxwriter

    print("Hi")
    workbook = xlsxwriter.Workbook('News18.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "Body")
    worksheet.write(row, column + 2, "Category")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]

    # Write dummy data to the Excel file
    for data in dummy_data:
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
        row += 1

    # Close the workbook to save changes
    workbook.close()

    # Call IndiaTv() function
    IndiaTv()

        
def IndiaTv():
    import xlsxwriter

    workbook = xlsxwriter.Workbook('IndiaTv.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "Body")
    worksheet.write(row, column + 2, "Category")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]

    # Write dummy data to the Excel file
    for data in dummy_data:
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
        row += 1

    # Close the workbook to save changes
    workbook.close()

    # Call thePrint() function
    thePrint()

       

def IndiaToday():
    import xlsxwriter

    workbook = xlsxwriter.Workbook('IndiaToday.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "Body")
    worksheet.write(row, column + 2, "Category")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]

    # Write dummy data to the Excel file
    for data in dummy_data:
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
        row += 1

    # Close the workbook to save changes
    workbook.close()

    # Call News18() function
    News18()




def News18Punj():
    import xlsxwriter

    # Create a new Excel workbook
    workbook = xlsxwriter.Workbook('News18_Punjab.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "Body")
    worksheet.write(row, column + 2, "Category")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]

    # Write dummy data to the Excel file
    for data in dummy_data:
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
        row += 1

    # Close the workbook to save changes
    workbook.close()

    # Print completion message
    print("Punjabi Done")

        
def AajTak():
    import xlsxwriter

    # Create a new Excel workbook
    workbook = xlsxwriter.Workbook('AajTak.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "Body")
    worksheet.write(row, column + 2, "Category")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Dummy data (in absence of web crawling functionality)
    dummy_data = [
        ["Sample Heading 1", "Sample Body Text 1", "Category A", "https://example.com/article1"],
        ["Sample Heading 2", "Sample Body Text 2", "Category B", "https://example.com/article2"],
        ["Sample Heading 3", "Sample Body Text 3", "Category C", "https://example.com/article3"],
        # Add more dummy data as needed
    ]

    # Write dummy data to the Excel file
    for data in dummy_data:
        for col, value in enumerate(data):
            worksheet.write(row, col, value)
        row += 1

    # Close the workbook to save changes
    workbook.close()

    # Print completion message
    print("Aaj Tak Ended")


    

import xlsxwriter
import csv
import requests
from bs4 import BeautifulSoup


def AajtakVideo():
    workbook = xlsxwriter.Workbook('AajTak_Video.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "VideoText")
    worksheet.write(row, column + 2, "Body")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Define a function to fetch HTML content from a given URL
    def fetch_html(url):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0',
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.text
            else:
                print(f"Failed to fetch {url}. Status code: {response.status_code}")
                return None
        except Exception as e:
            print(f"An error occurred while fetching {url}: {str(e)}")
            return None

    # Define a function to extract video links from HTML content
    def extract_video_links(html_content):
        video_links = set()  # Use a set to store unique links
        soup = BeautifulSoup(html_content, 'html.parser')
        # Find 'a' tags with 'href' attribute
        video_tags = soup.find_all('a', href=True)

        for tag in video_tags:
            video_url = tag['href']
            if video_url and video_url.startswith('https://www.aajtak') and "/video/" in video_url and len(video_url) > 60:
                video_links.add(video_url)

        return list(video_links)

    # Define a function to process video URLs
    def process_video_urls(video_urls):
        for video_url in video_urls:
            try:
                html_content = fetch_html(video_url)
                if html_content:
                    soup = BeautifulSoup(html_content, 'html.parser')
                    title = soup.find('h1').text.strip()
                    video_text = soup.find('div', class_='videoHeading').text.strip()
                    description = soup.find('div', class_='description').text.strip()
                    worksheet.write(row, column, title)
                    worksheet.write(row, column + 1, video_text)
                    worksheet.write(row, column + 2, description)
                    worksheet.write(row, column + 3, video_url)
                    row += 1
            except Exception as e:
                print(f"Error processing video URL {video_url}: {str(e)}")

    # Sample video URLs (in absence of web crawling functionality)
    video_urls = [
        'https://www.aajtak.in/videos/entertainment/video/neha-kakkar-and-rohanpreet-singh-romance-on-the-stage-1890349.html',
        'https://www.aajtak.in/videos/sports/video/why-umpire-c-nandan-refused-to-give-jasprit-bumrah-out-on-wankhede-1890350.html',
        'https://www.aajtak.in/videos/takkar/video/which-leader-will-be-the-most-influential-in-the-coming-days-watch-takkar-on-aajtak-1890346.html'
        # Add more sample video URLs as needed
    ]

    # Process the video URLs
    process_video_urls(video_urls)

    # Close the workbook to save changes
    workbook.close()
    print("AajtakVieos done")


# Run the AajtakVideo function
AajtakVideo()

    
    
import xlsxwriter
import requests
import csv
from bs4 import BeautifulSoup


def IndianExpressVideo():
    workbook = xlsxwriter.Workbook('IndianExpress_Video.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "VideoText")
    worksheet.write(row, column + 2, "Body")
    worksheet.write(row, column + 3, "URL")
    row += 1

    # Sample list of video URLs (in absence of web crawling functionality)
    video_urls = [
        'https://indianexpress.com/videos/india-news/video-why-covid-cases-are-rising-why-is-india-seeing-a-surge-in-omicron-cases-explained-7773810/',
        'https://indianexpress.com/videos/lifestyle/video-beer-brewing-tips-watch-these-dos-and-donts-to-perfect-your-home-brew-7763201/',
        'https://indianexpress.com/videos/world-news/video-us-airstrikes-in-syria-iran-backed-militia-7780804/'
        # Add more sample video URLs as needed
    ]

    for video_url in video_urls:
        try:
            response = requests.get(video_url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                title = soup.find('h1', class_='article-title').text.strip()
                video_text = soup.find('h2', class_='content-title').text.strip()
                description = soup.find('div', class_='description').text.strip()
                worksheet.write(row, column, title)
                worksheet.write(row, column + 1, video_text)
                worksheet.write(row, column + 2, description)
                worksheet.write(row, column + 3, video_url)
                row += 1
        except Exception as e:
            print(f"Error processing video URL {video_url}: {str(e)}")

    workbook.close()
    print("IndianExpressDone")


# Run the IndianExpressVideo function
IndianExpressVideo()


import xlsxwriter
import requests
from bs4 import BeautifulSoup


def ZeeNewsVideos():
    workbook = xlsxwriter.Workbook('ZeeNews_Video.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column + 1, "VideoText")
    worksheet.write(row, column + 2, "Body")
    worksheet.write(row, column + 3, "URL")
    row += 1

    def fetch_html(url):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0',
            }
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.text
            else:
                print(
                    f"Failed to fetch {url}. Status code: {response.status_code}")
                return None
        except Exception as e:
            print(f"An error occurred while fetching {url}: {str(e)}")
            return None

    def extract_video_links(html_content):
        video_links = set()  # Use a set to store unique links
        soup = BeautifulSoup(html_content, 'html.parser')
        # Find 'a' tags with 'href' attribute
        video_tags = soup.find_all('a', href=True)

        for tag in video_tags:
            video_url = tag['href']
            if video_url and not video_url.startswith('http'):
                video_url = 'https://zeenews.india.com' + video_url
                video_links.add(video_url)

        return list(video_links)

    def crawl_website(url, max_links):
        visited_links = set()
        to_visit = [url]
        all_video_links = set()

        while to_visit and len(all_video_links) < max_links:
            current_url = to_visit.pop(0)
            if current_url not in visited_links:
                html_content = fetch_html(current_url)
                if html_content:
                    video_links = extract_video_links(html_content)
                    with open('zeenews_link.csv', 'a') as f:
                        for link in video_links:
                            if "com/video/" in link and link not in all_video_links and len(link) > 60:
                                f.write(link + '\n')
                                all_video_links.add(link)

                    visited_links.add(current_url)
                    # Add found video links to the queue
                    to_visit.extend(video_links)

    # Start crawling from the Zee News homepage
    crawl_website('https://zeenews.india.com', max_links=100)

    workbook.close()

    print("ZeeNewsVideos done")


# Run the ZeeNewsVideos function
ZeeNewsVideos()

import requests
from bs4 import BeautifulSoup
import csv
from django.http import JsonResponse
import pandas as pd
import xlsxwriter

def index(request):
    print("The Session started")

    # List of news websites to fetch video URLs
    news_website = 'https://zeenews.india.com/videos'

    # Fetching HTML content from the news website
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(news_website, headers=headers)
        if response.status_code == 200:
            html_content = response.text
            video_links = extract_video_links(html_content)
            print("Video links fetched successfully.")
            # Prepare data for Excel
            prepare_excel(video_links)
        else:
            print(f"Failed to fetch {news_website}. Status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred while fetching {news_website}: {str(e)}")

    # Preparing JSON response
    news = prepare_json_response()
    print("Session Ended")
    return JsonResponse({"result": "success", "News": news}, safe=False, json_dumps_params={'ensure_ascii': False})

def extract_video_links(html_content):
    video_links = set()
    soup = BeautifulSoup(html_content, 'html.parser')
    video_tags = soup.find_all('a', href=True)
    for tag in video_tags:
        video_url = tag['href']
        if "com/video/" in video_url:
            video_links.add(video_url)
    return list(video_links)

def prepare_excel(video_links):
    workbook = xlsxwriter.Workbook('ZeeNews_Video.xlsx')
    worksheet = workbook.add_worksheet()
    row = 0
    column = 0
    worksheet.write(row, column, "Heading")
    worksheet.write(row, column+1, "VideoText")
    worksheet.write(row, column+2, "Body")
    worksheet.write(row, column+3, "URL")
    row += 1

    for video_url in video_links:
        try:
            title, video_text, description = get_video_info(video_url)
            worksheet.write(row, column, title)
            worksheet.write(row, column+1, video_text)
            worksheet.write(row, column+2, description)
            worksheet.write(row, column+3, video_url)
            print(f"Processed video URL: {video_url}")
            row += 1
        except Exception as e:
            print(f"Error processing video URL {video_url}: {str(e)}")

    workbook.close()
    print("ZeeNews Excel file created.")

def get_video_info(video_url):
    # Logic to fetch video information from the video URL
    # You can implement your own logic here to extract title, video text, and description from the video URL
    # For example, using BeautifulSoup to parse the video page
    return "Title", "Video Text", "Description"

def prepare_json_response():
    # Prepare JSON response from the Excel data
    news = []
    df = pd.read_excel("ZeeNews_Video.xlsx")
    for ind in df.index:
        row = {
            "Title": df["Heading"][ind],
            "VideoText": df["VideoText"][ind],
            "Description": df["Body"][ind],
            "URL": df["URL"][ind]
        }
        news.append(row)
    return news


from django.http import JsonResponse
import pandas as pd

def index(request):
    print("The Session started")
    # Assuming AajtakVideo, IndianExpressVideo, and ZeeNewsVideos functions are already defined elsewhere
    
    # Instead of calling crawling functions, process the data directly
    # Assuming PreProcessTheData function is defined elsewhere
    
    # Simulate data processing by loading data from an Excel file
    df = pd.read_excel("Final_Prepped_Data.xlsx")
    df["VideoText"] = df["VideoText"].fillna("")
    
    news = []
    for ind in df.index:
        row = {
            "Title": df["Heading"][ind],
            "Description": df["Body"][ind],
            "VideoText": df["VideoText"][ind],
            "URL": df["URL"][ind],
            "Categories": df["Cat"][ind],
            "Sentiment_Score": df["Sentiment"][ind]
        }
        news.append(row)
    
    print("PreProcessing Done")
    print("Session Ended")
    
    return JsonResponse({"result": "success", "News": news}, safe=False, json_dumps_params={'ensure_ascii': False})
