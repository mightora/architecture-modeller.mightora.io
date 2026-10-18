#!/usr/bin/env python3
"""Curate official downloaded packs. Normal builds use the committed, network-free results."""
import concurrent.futures
import hashlib
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PACKS={
 'power-platform':('Microsoft Power Platform','https://learn.microsoft.com/en-us/power-platform/guidance/icons','https://download.microsoft.com/download/498606aa-6d27-4f13-aa5c-1401078c153b/Power-Platform-icons-scalable.zip'),
 'azure':('Microsoft Azure','https://learn.microsoft.com/en-us/azure/architecture/icons/','https://arch-center.azureedge.net/icons/Azure_Public_Service_Icons_V24.zip'),
 'aws':('AWS','https://aws.amazon.com/architecture/icons/','https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip')
}
CHOICES={
 'power-platform':[
 ('power-apps','Power Apps','PowerApps_scalable.svg'),('power-automate','Power Automate','PowerAutomate_scalable.svg'),('dataverse','Dataverse','Dataverse_scalable.svg'),('power-pages','Power Pages','PowerPages_scalable.svg'),('power-platform','Power Platform','PowerPlatform_scalable.svg'),('copilot-studio','Microsoft Copilot Studio','CopilotStudio_scalable.svg'),('ai-builder','AI Builder','AIBuilder_scalable.svg'),('microsoft-agent-365','Microsoft Agent 365','Agent365_scalable.svg')],
 'azure':[
 ('azure-functions','Azure Functions','10029-icon-service-Function-Apps.svg'),('azure-app-service','Azure App Service','10035-icon-service-App-Services.svg'),('azure-sql','Azure SQL Database','10130-icon-service-SQL-Database.svg'),('azure-storage','Azure Storage account','10086-icon-service-Storage-Accounts.svg'),('azure-key-vault','Azure Key Vault','10245-icon-service-Key-Vaults.svg'),('azure-vnet','Azure Virtual Network','10061-icon-service-Virtual-Networks.svg'),('azure-logic-apps','Azure Logic Apps','02631-icon-service-Logic-Apps.svg'),('azure-api-management','Azure API Management','10042-icon-service-API-Management-Services.svg'),('azure-service-bus','Azure Service Bus','10836-icon-service-Azure-Service-Bus.svg'),('azure-aks','Azure Kubernetes Service','10023-icon-service-Kubernetes-Services.svg'),('azure-app-insights','Azure Application Insights','00012-icon-service-Application-Insights.svg')],
 'aws':[
 ('aws-lambda','AWS Lambda','Arch_AWS-Lambda_64.svg'),('aws-ec2','Amazon EC2','Arch_Amazon-EC2_64.svg'),('aws-s3','Amazon S3','Arch_Amazon-Simple-Storage-Service_64.svg'),('aws-rds','Amazon RDS','Arch_Amazon-RDS_64.svg'),('aws-dynamodb','Amazon DynamoDB','Arch_Amazon-DynamoDB_64.svg'),('aws-api-gateway','Amazon API Gateway','Arch_Amazon-API-Gateway_64.svg'),('aws-sqs','Amazon SQS','Arch_Amazon-Simple-Queue-Service_64.svg'),('aws-sns','Amazon SNS','Arch_Amazon-Simple-Notification-Service_64.svg'),('aws-cloudfront','Amazon CloudFront','Arch_Amazon-CloudFront_64.svg'),('aws-eks','Amazon EKS','Arch_Amazon-Elastic-Kubernetes-Service_64.svg'),('aws-cognito','Amazon Cognito','Arch_Amazon-Cognito_64.svg'),('aws-iam','AWS Identity and Access Management','Arch_AWS-Identity-and-Access-Management_64.svg'),('aws-step-functions','AWS Step Functions','Arch_AWS-Step-Functions_64.svg'),('aws-vpc','Amazon VPC','Arch_Amazon-Virtual-Private-Cloud_64.svg')]
}

def safe_svg(data):
    text=data.decode('utf-8-sig')
    if '<!ENTITY' in text.upper() or '<!DOCTYPE' in text.upper(): raise ValueError('SVG declarations are not allowed')
    tree=ET.fromstring(text)
    if tree.tag.split('}')[-1]!='svg': raise ValueError('Not an SVG')
    for node in tree.iter():
        if node.tag.split('}')[-1].lower() in ['script','foreignobject','iframe','image','style']:
            # SVG style blocks in official packs may contain only static paint declarations.
            if node.tag.split('}')[-1].lower()!='style' or any(s in (node.text or '').lower() for s in ['url(', '@import']): raise ValueError('Active or external SVG content')
        for key,value in node.attrib.items():
            if key.lower().startswith('on') or (key.split('}')[-1] in ['href','src'] and not value.startswith('#')): raise ValueError('Unsafe SVG attribute')
            if 'url(' in value.lower() and 'url(#' not in value.lower() and 'url(\'#' not in value.lower() and 'url("#' not in value.lower(): raise ValueError('External SVG paint')
    return data

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mightora-icon-import'}),timeout=30) as response: return response.read(2*1024*1024)

def main():
    directory=Path(sys.argv[1]); entries=[]; out=ROOT/'assets/icons';out.mkdir(exist_ok=True)
    def save(id,name,collection,terms,source,data,member=None):
        safe_svg(data);(out/(id+'.svg')).write_bytes(data)
        entries.append({'id':id,'name':name,'collection':collection,'termsUrl':terms,'sourceUrl':source,'sourceMember':member,'sha256':hashlib.sha256(data).hexdigest()})
    # Keep the original Power BI ID and artwork compatible with existing model files.
    save('power-bi','Power BI','Microsoft Power BI (archived)','https://creativecommons.org/licenses/by/4.0/','https://github.com/microsoft/PowerBI-Icons',(out/'power-bi.svg').read_bytes(),'Power-BI.svg')
    for pack,(collection,terms,source) in PACKS.items():
        with zipfile.ZipFile(directory/(pack+'.zip')) as archive:
            for id,name,filename in CHOICES[pack]:
                matches=sorted(n for n in archive.namelist() if not n.startswith('__MACOSX/') and Path(n).name==filename)
                if not matches: raise ValueError('Missing official icon: '+filename)
                save(id,name,collection,terms,source,archive.read(matches[0]),matches[0])
    generic=['user','users','cloud','database','server','network','workflow','shield','box','layers']
    urls=['https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/'+id+'.svg' for id in generic]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        for id,url,data in zip(generic,urls,pool.map(fetch,urls)):
            save('generic-'+id,id.title(),'General architecture (Lucide)','https://lucide.dev/license',url,data)
    (ROOT/'assets/LUCIDE-LICENSE.txt').write_bytes(fetch('https://raw.githubusercontent.com/lucide-icons/lucide/main/LICENSE'))
    (ROOT/'assets/icon-catalog.json').write_text(json.dumps(entries,indent=2)+'\n')
    print(json.dumps({'icons':len(entries),'collections':sorted(set(e['collection'] for e in entries))}))

if __name__=='__main__': main()
