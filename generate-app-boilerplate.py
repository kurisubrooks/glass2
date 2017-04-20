# Script to quickly generator boilerplate code for new apps
# usage: python generate-app-boilerplate.py --name=<appname>
# Made with python 2.7.12

import sys
import os
import errno

appname = None
for arg in sys.argv:
    if arg[:7] == "--name=":
        appname = arg[7:]

if appname == None:
    print("ERROR: Must provide app name (--name=)")
    exit()

jstemplate = """const App = require("../../core/App");
const Window = require("../../core/Window");

class {appname}App extends App {{
    constructor() {{
        super("{appname}");
    }}
}}

class {appname}Window extends Window {{
    constructor(options) {{ // eslint-disable-line no-useless-constructor
        super(options);
    }}

    openIn(windowArea) {{
        super.openIn(windowArea);
    }}
}}

module.exports = {{
    {appname}App: {appname}App,
    {appname}Window: {appname}Window
}};
"""

render = jstemplate.format(appname=appname)

jsfilepath = os.getcwd() + "/apps/" + appname + "/index.js"
htmlfilepath = os.getcwd() + "/apps/" + appname + "/index.html"
if not os.path.isdir(os.path.dirname(jsfilepath)):
    try:
        os.makedirs(os.path.dirname(jsfilepath))
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise

with open(jsfilepath, "w") as f:
    f.write(render)
with open(htmlfilepath, "w") as f:
    f.write("<p>Hello world!</p>")
