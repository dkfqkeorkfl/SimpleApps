# JsonDB 0.1 Release

JsonDB is a simple NoSQL database that uses JSON format in Unity.

It's a simple way for Unity!

Welcome to JsonDB by Sas.

It's designed to make using JSON easy with file system like a NoSQL database.

## Dependencies
- [Newtonsoft.Json](https://www.newtonsoft.com/json)

## Newtonsoft.Json Guide
You can find a guide for Newtonsoft.Json [here](https://www.newtonsoft.com/json/help/html/Introduction.htm).

## Example
```csharp
string json = @"
[
  {
    'Title': 'Json.NET is awesome!',
    'Author': {
      'Name': 'James Newton-King',
      'Twitter': '@JamesNK',
      'Picture': '/jamesnk.png'
    },
    'Date': '2013-01-23T19:30:00',
    'BodyHtml': '&lt;h3&gt;Title!&lt;/h3&gt;\r\n&lt;p&gt;Content!&lt;/p&gt;'
  }
]";

var obj = Newtonsoft.Json.Linq.JToken.Parse(json);
Sas.JsonDB DB = new Sas.JsonDB("test");
DB.Put("item1", obj);
var root = DB.Root();
var title = DB.Get("item1\\[0]\\Title");
var title_txt = (string)title;
