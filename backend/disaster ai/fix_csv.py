#!/usr/bin/env python
import os

csv_path = 'data/karnataka_disaster_data.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove trailing whitespace and stray quotes
content = content.rstrip()
if content.endswith('"'):
    content = content[:-1].rstrip()

with open(csv_path, 'w', encoding='utf-8') as f:
    f.write(content + '\n')

print('CSV file cleaned successfully')
