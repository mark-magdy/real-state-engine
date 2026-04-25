import requests
from bs4 import BeautifulSoup
import pandas as pd

# Target website (practice scraping site)
#url = "https://www.bayut.eg/en/egypt/properties-for-sale/?gad_source=1&gad_campaignid=20972105243&gbraid=0AAAAApmroPaTHW3B8ha4JkDFTxy_ad7rg&gclid=CjwKCAiA2PrMBhA4EiwAwpHyC9JGOYcYK89x78InlAuz9Y15Lv-zVyxRsWsejT1gsfvobJK0tg3rKxoCglIQAvD_BwE"
base_url = "https://www.bayut.eg/en/egypt/properties-for-sale"

# Lists to store data
titles = []
prices = []
locations = []
types = []
areas = []
bedrooms = []
bathrooms = []
down_payments = []
instalments = []

for page in range(1, 6):  # choose how many pages you want
    if page == 1:
        url = base_url + "/"   # first page has no /page-1/
    else:
        url = f"{base_url}/page-{page}/"

    response = requests.get(url)# Send request
    soup = BeautifulSoup(response.text, "html.parser")# Parse HTML


    posts = soup.find_all("li", role="article")

    if not posts:
        print("No more pages")
        break

    for post in posts:
        price_tag = post.find("span", attrs={"aria-label": "Price"})
        title_tag = post.find("h2", attrs={"aria-label": "Title"})
        location_tag = post.find("h3", class_="_51c6b1ca")
        type_tag = post.find("span", attrs={"aria-label": "Type"})
        area_tag = post.find("h3", class_="_60820635 _07b5f28e")
        bedrooms_tag = post.find("span", attrs={"aria-label": "Beds"})
        bathrooms_tag = post.find("span", attrs={"aria-label": "Baths"})
        down_payment_tag = post.find("div", class_="ec122524 b251deeb")
        if (down_payment_tag):
            down_payment_tag = down_payment_tag.find("span", class_="fd7ade6e")
        instalment_tag = post.find("div", class_="ec122524 _4790c7a6")
        if (instalment_tag):
            instalment_tag = instalment_tag.find("span", class_="fd7ade6e")

        price = price_tag.text.strip() if price_tag else "N/A"
        title = title_tag.text.strip() if title_tag else "N/A"
        location = location_tag.text.strip() if location_tag else "N/A"
        type = type_tag.text.strip() if type_tag else "N/A"
        area = area_tag.text.strip() if area_tag else "N/A"
        bedroom = bedrooms_tag.text.strip() if bedrooms_tag else "N/A"
        bathroom = bathrooms_tag.text.strip() if bathrooms_tag else "N/A"
        down_payment = down_payment_tag.text.strip() if down_payment_tag else "N/A"
        instalment = instalment_tag.text.strip() if instalment_tag else "N/A"

        prices.append(price)
        titles.append(title)
        locations.append(location)
        types.append(type)
        areas.append(area)
        bedrooms.append(bedroom)
        bathrooms.append(bathroom)
        down_payments.append(down_payment)
        instalments.append(instalment)
        pass

    print(f"Page {page} scraped")



 # Create DataFrame
df = pd.DataFrame({
"type": types,
"Price": prices ,
"location": locations,
"Area": areas,
"bedrooms": bedrooms,
"Bathrooms": bathrooms,
"Down payment": down_payments,
"Instalment": instalments,
"Full Descrption": titles
})

# Export to Excel
df.to_excel("bayut.xlsx", index=False)

print("Data successfully saved to bayut.xlsx")