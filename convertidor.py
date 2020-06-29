# -*- coding: utf-8 -*-

# convertidor del excel de lionel en professors.ts
import pandas as pd

file = pd.read_csv("comisiones2020Q2.csv", sep=";", encoding='utf8')

content = file.to_dict("records")

output = str(content)

outputfile = open("src/assets/professors.ts", "w+", encoding='utf8')

outputfile.writelines([
"// professorNames data has been hardcoded for the beta version\n",
"// of the Schedule Combinar SPA, future version should request\n",
"// this data from the SGA server as an http request.\n",
"// [Updated: 22/01/2020]\n",
"export const PROFESSORS = {\n",
'  "commissions": [\n'
])

line_total = len(content)
count = 0

for record in content:
    if count != line_total-1:
        outputfile.writelines([
    "       {\n",
    '           "subjectCode": "'+str(record["cod"])+'",\n',
    '           "commission": "'+str(record["comision"])+'",\n',
    '           "professorName": "'+str(record["Profesor"])+'"\n',
    "       },\n"
    ])
    else:
        outputfile.writelines([
    "       {\n",
    '           "subjectCode": "'+str(record["cod"])+'",\n',
    '           "commission": "'+str(record["comision"])+'",\n',
    '           "professorName": "'+str(record["Profesor"])+'"\n',
    "       }\n"
    ])

    count += 1

outputfile.writelines([
"      ]\n",
"};\n"
])

outputfile.close()