# Pumlhorse-Browser: Automated UI testing in Pumlhorse

Pumlhorse-Browser is a module for [Pumlhorse](https://github.com/pumlhorse/pumlhorse) that allows automated UI testing. It uses [Zombie](https://github.com/assaf/zombie) as a headless browser, allowing you to write Pumlhorse tests against your websites!

## Installing

`npm install pumlhorse-browser`

## Usage

Here is a sample Pumlhorse script that opens a Pumlhorse sandbox and runs a script (so meta!)

```yaml
name: Open Pumlhorse demo site
modules:
  - ui = pumlhorse-browser
steps:
  # Open the website
  - ui.open: https://pumlhorse-plain.glitch.me/
  # Find the "submit" button
  - button = ui.findFirst: button[type="submit"]
  # And click it
  - ui.click: $button
  # Check the log messages we got back
  - messages = ui.find: "#logs > li"
  - areEqual:
      expected: 2
      actual: $messages.length
  - isTrue: ${messages[0].textContent.endsWith('This is my script!')}
  - areEqual: 
      expected: ------------
      actual: $messages[1].textContent
  
  # Update the textarea for the script with a new script
  - ui.set:
      selector: "#pumlEditor"
      value: |
             name: A test script
             steps:
               - log: Hello there!
  - ui.click: $button
  - messages = ui.find: "#logs > li"
  - areEqual:
      expected: 4
      actual: $messages.length
  - isTrue: ${messages[2].textContent.endsWith('Hello there!')}
  - areEqual: 
      expected: ------------
      actual: $messages[3].textContent
```

## Module functions

```yaml
##
## Set up ##
##

# Sets the base URL
setBaseUrl: http://www.example.org
# Sets the proxy
setProxy: http://myproxy.com

##
## DOM actions ##
## Note: DOM objects are a read-only subset of properties, { attributes, classList, id, localName, name, prefix, textContent, value }
##

# Returns an array of all DOM objects that match the selector
domObjects = find: <css_selector>
# Returns the first DOM object that matches the selector
domObject = findFirst: <css_selector> 

##
## Browser Actions ##
## Note: selector_or_dom parameters can be a CSS selector or a DOM object
##

# Opens the provided URL
open: http://www.example.org/my_page
# Clicks an item on the page
click: <selector_or_dom>
# Updates a textarea or input value
set:
  selector: <text_selector_or_dom>
  value: new text value
# Checks a checkbox
check: <checkbox_selector_or_dom>
# Unchecks a checkbox
uncheck: <checkbox_selector_or_dom>
# Selects a radio button
choose: <radio_selector_or_dom>

# Selects an option in a dropdown that matches <option_text>
select:
  selector: <select_selector_or_dom>
  value: <option_text>
# Selects an option in a dropdown
select: <option_selector_or_dom>
# Unselects an option in a dropdown that matches <option_text>
unselect:
  selector: <select_selector_or_dom>
  value: <option_text>
# Unselects an option in a dropdown
unselect: <option_selector_or_dom>

# Attaches a file
attachFile:
  selector: <selector_or_dom>
  file:

# Waits until all events are complete
wait
# Wait a specific amount of time (e.g. "5000" and "5s" are both five seconds)
wait: <duration>

##
## Cookies
##

# Get a cookie ({ name, value, domain, path, secure, httpOnly, expires, max-age })
getCookie: <cookie_name>
setCookie:
  name: <cookie_name>
  value: <cookie_value> # Can be a string or an object corresponding to the properties described above

# Delete a cookie
deleteCookie: <cookie_name>
# Delete multiple cookies
deleteCookie:
  - <cookie_name_1>
  - <cookie_name_2>
  - <cookie_name_3>

##
## Assertions
##

# Assert that the current page has the given URL
isUrl: <url>
```