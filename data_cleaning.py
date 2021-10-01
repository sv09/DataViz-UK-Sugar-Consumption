#import the required libraries
import csv
import pandas as pd

#read the csv data file
data = pd.read_csv('data.csv')

#rename the column names
data.rename(columns={'Free sugars intake (% of total energy) in all age groups for all paired years of the NDNS Rolling Programme\xa0': 'Age Group', '(2008/09 - 2009/10)':'2008/09 - 2009/10', '(2010/11 - 2011/12)':'2010/11 - 2011/12', '(2012/13 - 2013/14)':'2012/13 - 2013/14', '(2014/15-2015/16)':'2014/15-2015/16'}, inplace=True)

#filter out rows for entries with terms: 'Children' and 'Adults' and add it to a new dataframe
check = ['Children', 'Adults']
age_gp = pd.DataFrame(columns=['Age Group', '2008/09 - 2009/10', '2010/11 - 2011/12',
       '2012/13 - 2013/14', '2014/15-2015/16'])
for idx in data.index:
    if data.loc[idx,'Age Group'].split()[0] in check:
        age_gp.loc[idx] = data.loc[idx]

#remove the terms 'Children' and 'Adults' from the column values
for idx in age_gp.index:
    age_gp.loc[idx,'Age Group'] = age_gp.loc[idx,'Age Group'].split(' ', 1)[1]

#save the dataframe as csv
age_gp.to_csv('AgeGroup.csv', index=False)

#filter out rows for entries with terms: 'Men' and 'Women', create a new dataframe with an additional column - 'Gender', and add the filtered out row to the new dataframe
check = ['Men', 'Women']
gender_gp = pd.DataFrame(columns=['Age Group','Gender','2008/09 - 2009/10', '2010/11 - 2011/12',
       '2012/13 - 2013/14', '2014/15-2015/16'])
for idx in data.index:
    if data.loc[idx, 'Age Group'].split()[0] in check:
        row = data.loc[idx]
        row['Age Group'] = data.loc[idx,'Age Group'].split(' ', 1)[1]
        row['Gender'] = data.loc[idx, 'Age Group'].split()[0]
        gender_gp = gender_gp.append(row, ignore_index=True)
    
#save the dataframe as csv
gender_gp.to_csv('GenderGroup.csv', index=False)



