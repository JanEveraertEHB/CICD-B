

# Contributing guidelines
---

// intro


VERWIJS OOK NAAR UW CODE OF CONDUCT



## Report bugs

* Open a ticket on github, with a bug tag
* Set application to VERBOSE in your .env file
* Include your Error logs
* Explain the setup
* include the following



```
OS: 
Docker version: 
Global npms: 
npm version: 
```

examples, of good and bad requests

good: Getting error "" when trying to call endopoint
what data sending

Bad: endpoint does not work
  


## Suggest new features

* Open a feature request on github with a "enhancement" label
* Declare why usefull


## Guidelines for development

explain how to setp the system for development
env file adaption 
  * DB dev
  * VERBOSE 3
  * ...

welke globals kunnen ze gebruiken

What kind of tests need to be there

Mention development DB

Changelog (how to)


### (logging)

```
if(process.env.VERBOSE >= 2) {
  console.log()
}
```

expected log levels:
| verbose level | code |
| --- | --- |
| 2 | console.log | 
| 1 | console.warn | 
| 0 | console.error |




## Roadmap and vision

I envision....

// mention van een forum
// Discord


## Get in touch

email
discord -> 
github -> label; "question"


